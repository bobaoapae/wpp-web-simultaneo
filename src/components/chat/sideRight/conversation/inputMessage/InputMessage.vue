<template>
    <div ref="container">
        <div class="input-msg" v-show="!showSelectMsgs">
            <b-collapse id="collapse-emoji" v-model="chat.emojiVisible" @show="handleEmojiOpening"
                        @shown="handleEmojiOpened" @hide="handleEmojiClosing" @hidden="handleEmojiClosed">
                <picker
                    :color="'#009688'"
                    :data="emojiIndex"
                    :emojiSize="32"
                    :i18n="{search: 'Buscar emoji',
                            notfound: '',
                            categories: {
                              search: '',
                              recent: 'Recentes',
                              smileys: 'Emojis & Emoções',
                              people: 'Pessoas & Corpos',
                              nature: 'Animais & natureza',
                              foods: 'Comida & Bebida',
                              activity: 'Atividade',
                              places: 'Viagens & Locais',
                              objects: 'Objetos',
                              symbols: 'Símbolos',
                              flags: 'Bandeiras',
                              custom: 'Custom',
                            }}"
                    :perLine="21"
                    :recent="[]"
                    :showPreview="false"
                    :style="{ height:'320px', backgroundColor:'#f0f0f0 !important', fontSize:'14px'}"
                    @select="addEmoji"
                    set="apple"
                />
            </b-collapse>

            <b-collapse id="collapse-answer-msg" v-model="answerVisible">
                <div class="box-answer">
                    <QuotedMsg :quotedMsg="chat.quotedMsg" class="flex-grow-1" v-if="answerVisible"/>

                    <div @click="handleClickCloseAnswer" class="close-answer">
                        <img src="@/assets/images/wpp-icon-close-answer.svg">
                    </div>
                </div>
            </b-collapse>

            <b-collapse id="collapse-replies" v-model="quickRepliesVisible">
                <div class="quick-replys" v-if="quickRepliesVisible">
                    <div :key="quickReply.id" @click="handleClickQuickReply(quickReply)" class="quick-reply"
                         v-for="quickReply in filteredQuickReplies">
                        /<span class="quick-reply-name">{{quickReply.shortcut}}</span> <span class="quick-reply-msg">{{quickReply.message}}</span>
                    </div>
                </div>
            </b-collapse>

            <div id="input-message">
                <div class="box-icon-emoji">
                    <b-img
                        @mousedown.prevent
                        alt="Button emoji"
                        class="btn-emoji-open"
                        role="button"
                        src="@/assets/images/wpp-icon-emoji.svg"
                        v-b-toggle.collapse-emoji
                    />
                </div>

                <div class="box-bind-operator" v-if="user.isOperator && canBindToOperator">
                    <b-form-checkbox size="small" name="check-button" v-model="bindToOperator">
                        Vincular Chat?
                    </b-form-checkbox>
                </div>

                <div class="box-input">
                    <div
                        @focusin="restorePosition"
                        @input="onInput"
                        @keypress.enter.exact.prevent="handleEnterPress"
                        @keyup="savePosition"
                        @mouseup="savePosition"
                        @paste.prevent="onPaste"
                        class="input"
                        contenteditable="true"
                        data-text="Digite uma mensagem"
                        ref="input"
                    ></div>
                </div>

                <div class="box-icon-send">
                    <div>
                        <img @click="handleSendMessage" src="@/assets/images/wpp-icon-send.svg"
                             v-if="chat.message"/>
                        <img @click="startRecording" src="@/assets/images/wpp-icon-mic.svg" v-else-if="!recording"/>
                    </div>

                    <div v-if="recording">
                        <img @click="stopRecording" src="@/assets/images/wpp-icon-cancel-ptt-outline.svg"/>
                        <span class="recorder-time">{{timeConverter}}</span>
                        <img @click="sendPtt" src="@/assets/images/wpp-icon-send-ptt-outline.svg"/>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="showSelectMsgs" class="box-select-msgs">
            <button class="close-select-msgs" @click="handleClickCloseSelectMsgs">
                <img src="@/assets/images/wpp-icon-close-modal.svg"/>
            </button>
            <span class="qtd-msg-selected">{{qtdSelected}}</span>
            <button class="forward-select-msgs" :disabled="!hasMessageSelected" title="Encaminhar Mensagens"
                    @click="handleClickForwardMsgs">
                <img src="@/assets/images/wpp-icon-forwarded.svg"/>
            </button>
        </div>
    </div>
</template>

<script>
import { Picker } from 'emoji-mart-vue-fast';
import { mapActions, mapMutations, mapState } from 'vuex';
import { msg } from '@/helper.js';
import { rageSave } from '@/rangeSelectionSaveRestore.js';
import QuotedMsg from '../../../../shared/quotedMsg/QuotedMsg';
import OpusMediaRecorder from 'opus-media-recorder';
import Worker from 'worker-loader!opus-media-recorder/encoderWorker.js';

const OggOpusWasm = import('opus-media-recorder/OggOpusEncoder.wasm');
const WebMOpusWasm = import('opus-media-recorder/WebMOpusEncoder.wasm');

window.MediaRecorder = OpusMediaRecorder;

export default {
    name: 'InputMessage',
    components: {
        QuotedMsg,
        Picker
    },
    props: {
        chat: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            preventOverrideRestore: false,
            emojiIndex: msg.emojiIndex(),
            answerVisible: false,
            quickRepliesVisible: false,
            recorder: {},
            gumStream: {},
            recording: false,
            ignoreRecording: false,
            time: 0,
            interval: null,
            bindToOperator: true,
            filteredQuickReplies: []
        };
    },
    mounted () {
        this.$root.$on('keyDown', (evt) => {
            if (!evt.ctrlKey && evt.target.placeholder !== 'Buscar emoji') {
                this.$refs.input.focus();
            }
        });
        this.$root.$on('focusInput', () => {
            this.$refs.input.focus();
        });
        this.$refs.input.focus();
    },
    watch: {
        'chat.quotedMsg': function (val) {
            if (val) {
                this.$refs.input.focus();
                this.answerVisible = true;
            } else {
                this.answerVisible = false;
            }
        },
        'chat': function (val) {
            this.bindToOperator = true;
            this.preventOverrideRestore = true;
            this.$refs.input.innerHTML = this.chat.htmlInput;
            this.$refs.input.focus();
            this.preventOverrideRestore = false;
            this.savePosition();
        }

    },
    computed: {
        ...mapState(['quickReplys', 'user', 'selectMsgs']),

        timeConverter () {
            let a = new Date(this.time * 1000);
            let sec = a.getSeconds();
            let min = a.getMinutes();

            let time;

            if (min < 10) {
                min = '0' + min;
            }
            if (sec < 10) {
                sec = '0' + sec;
            }

            time = min + ':' + sec;
            return time;
        },

        canBindToOperator () {
            return false;
        },

        showSelectMsgs () {
            return this.selectMsgs && this.selectMsgs.show;
        },

        hasMessageSelected () {
            return this.selectMsgs.msgs.length > 0;
        },

        qtdSelected () {
            let qtd = this.selectMsgs.msgs.length;
            let text = `${qtd} selecionada`;
            if (qtd > 1 || qtd === 0) {
                text += 's';
            }
            return text;
        }
    },
    methods: {
        ...mapActions(['uploadFile']),
        ...mapMutations(['SET_SELECT_MSGS', 'SET_SELECT_CHATS']),

        toggleRecording () {
            this.recording = !this.recording;

            if (this.recorder && this.recorder.state === 'recording') {
                this.recorder.stop();
                this.gumStream.getAudioTracks().forEach(value => value.stop());
                clearInterval(this.interval);
                this.time = 0;
            } else {
                navigator.mediaDevices.getUserMedia({
                    audio: true
                })
                    .then(async (stream) => {
                        this.interval = setInterval(() => {
                            this.time++;
                        }, 1000);

                        this.gumStream = stream;
                        const options = { mimeType: 'audio/ogg' };
                        const ogg = await OggOpusWasm;
                        const webm = await WebMOpusWasm;
                        const workerOptions = {
                            encoderWorkerFactory: _ => new Worker(),
                            OggOpusEncoderWasmPath: ogg.default,
                            WebMOpusEncoderWasmPath: webm.default
                        };
                        this.recorder = new MediaRecorder(stream, options, workerOptions);
                        this.recorder.ondataavailable = (e) => {
                            if (!this.ignoreRecording) {
                                this.handleSendPtt(e.data);
                            }
                        };
                        this.recorder.start();
                    });
            }
        },

        startRecording () {
            this.toggleRecording();
        },

        stopRecording () {
            this.ignoreRecording = true;
            this.toggleRecording();
        },

        sendPtt () {
            this.ignoreRecording = false;
            this.toggleRecording();
        },

        handleSendPtt (data) {
            let currentChat = this.chat;
            this.uploadFile(new File([data], new Date().getTime() + '.ptt', { type: data.type })).then(tag => {
                let msg = {
                    fileUUID: tag
                };

                currentChat.buildAndSendMessage(msg);
            });
        },

        handleSendMessage () {
            this.chat.buildAndSendMessage();
            this.$refs.input.innerHTML = '';
        },

        onInput (evt) {
            this.savePosition();
            this.chat.htmlInput = this.$refs.input.innerHTML;
            this.chat.message = this.formatar(this.$refs.input);
            this.quickRepliesVisible = this.chat.message.charAt(0) === '/' && this.quickReplys && this.quickReplys.length > 0;
            if (this.quickRepliesVisible) {
                this.filteredQuickReplies = this.getQuickRepliesToShow();
            }
        },

        getQuickRepliesToShow () {
            return this.quickReplys.filter(quickReply => {
                return ('/' + quickReply.shortcut).toLowerCase().includes(this.chat.message.toLowerCase());
            });
        },

        handleClickCloseAnswer () {
            this.answerVisible = false;
            this.chat.quotedMsg = undefined;
        },

        onPaste (evt) {
            let items = evt.clipboardData.items;
            let files = [];
            for (let i = 0; i < items.length; i++) {
                if (items[i].type.indexOf('image') === -1) continue;
                files.push(items[i].getAsFile());
            }
            if (files.length > 0) {
                let currentChat = this.chat;
                files.forEach(async file => {
                    let tag = await this.uploadFile(file);
                    await currentChat.buildAndSendMessage({ fileUUID: tag });
                });
            } else {
                const textMsg = this.$options.filters.emojify(evt.clipboardData.getData('text'));
                document.execCommand('insertHTML', false, textMsg);
            }
        },

        restorePosition () {
            if (this.chat.restoreInput) {
                rageSave.restoreSelection(this.chat.restoreInput);
                this.chat.restoreInput = null;
            }
        },

        savePosition () {
            if (!this.preventOverrideRestore) {
                if (this.chat.restoreInput) {
                    rageSave.removeMarkers(this.chat.restoreInput);
                }
                if (this.$refs.input.textContent.length > 0) {
                    this.chat.restoreInput = rageSave.saveSelection();
                }
                this.chat.htmlInput = this.$refs.input.innerHTML;
            }
        },

        addEmoji (emoji) {
            this.$refs.input.focus();
            emoji = emoji.native;
            document.execCommand('insertHTML', false, this.$options.filters.emojify(emoji));
        },

        handleEnterPress () {
            if (this.quickRepliesVisible && this.filteredQuickReplies.length === 1) {
                this.handleClickQuickReply(this.filteredQuickReplies[0]);
            } else if (this.chat.message !== '') {
                this.handleSendMessage();
            }
        },

        handleClickQuickReply (quickReply) {
            this.$refs.input.focus();
            this.$refs.input.innerHTML = '';
            this.chat.message = '';
            document.execCommand('insertHTML', false, quickReply.message);
        },

        handleEmojiOpening () {
            this.$root.$emit('startOpenEmoji');
        },

        handleEmojiOpened () {
            this.$root.$emit('finishOpenEmoji');
        },

        handleEmojiClosing () {
            this.$root.$emit('startCloseEmoji');
        },

        handleEmojiClosed () {
            this.$root.$emit('finishCloseEmoji');
        },

        handleClickCloseSelectMsgs () {
            this.SET_SELECT_MSGS({ show: false });
        },

        handleClickForwardMsgs () {
            this.SET_SELECT_CHATS({ show: true });
        },

        formatar (domElement) {
            let msg = '';
            domElement.childNodes.forEach(function (e) {
                let nodeName = e.nodeName;
                if (nodeName === '#text') {
                    msg += e.data;
                } else if (nodeName === 'IMG') {
                    msg += e.alt;
                } else if (nodeName === 'BR') {
                    msg += '\n';
                }
            });

            return this.$options.filters.capitalize(msg);
        }
    }
};

</script>

<style scoped>
.recorder-time {
    margin-right: 40px;
    margin-left: 40px;
    font-size: 23px;
    color: rgba(0, 0, 0, 0.45);
}

.box-answer {
    display: flex;
    flex-direction: row;
    background-color: #f0f0f0;
}

.close-answer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px;
    cursor: pointer;
}

.emoji-mart {
    width: 100% !important;
}

[contentEditable="true"]:empty:before {
    content: attr(data-text);
    color: #a0a0a0;
    cursor: text;
}

.label {
    display: none;
    position: absolute;
    color: #a0a0a0;
    visibility: visible;
}

#input-message {
    display: flex;
    background: #efefef;
    padding: 5px 10px;
}

.box-icon-send {
    padding: 5px 10px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.box-input {
    box-sizing: border-box;
    flex: 1 1 auto;
    font-size: 15px;
    font-weight: 400;
    line-height: 20px;
    min-height: 20px;
    min-width: 0;
    outline: none;
    width: inherit;
    will-change: width;
    background-color: #fff;
    border: 1px solid #fff;
    border-radius: 21px;
    padding: 9px 12px 11px;
    margin: 5px 10px;
}

.box-input .input {
    font-size: 15px;
    font-weight: 400;
    max-height: 100px;
    min-height: 20px;
    outline: none;
    overflow-x: hidden;
    overflow-y: auto;
    white-space: pre-wrap;
    word-wrap: break-word;
    z-index: 1;
}

.box-icon-emoji {
    padding: 5px 10px;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
}

.box-bind-operator {
    user-select: none;
    margin: auto;
}

.quick-replys {
    background-color: #f0f0f0;
    box-shadow: 0 -5px 7px -5px rgba(0, 0, 0, .04);
    border-left: 1px solid #e0e0e0;
    padding-top: 3px;
    position: relative;
    overflow: hidden;
}

.quick-reply {
    margin-left: 3px;
    color: rgba(0, 0, 0, .45);
    font-size: 14px;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    white-space: nowrap;
    padding: 16px 19px;
    cursor: pointer;
}

.quick-reply-name {
    color: #303030;
}

.quick-reply-msg {
    color: rgba(0, 0, 0, .45);
    font-size: 14px;
    height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    vertical-align: middle;
    white-space: nowrap;
    flex-grow: 1;
    position: relative;
    margin-left: 3px;
}

.box-select-msgs {
    box-sizing: border-box;
    flex: 1 1 auto;
    font-size: 15px;
    font-weight: 400;
    line-height: 20px;
    min-height: 20px;
    min-width: 0;
    outline: none;
    width: inherit;
    will-change: width;
    padding: 9px 12px 11px;
    background-color: #efefef;
    align-items: center;
    justify-content: center;
    height: 62px;
    display: flex;
}

.box-select-msgs button {
    margin-right: 10px;
    border: none;
    width: 40px;
    height: 40px;
}

.box-select-msgs button:focus {
    border: none;
    outline: none;
}

.box-select-msgs button:disabled {
    opacity: 0.4;
}

.qtd-msg-selected {
    flex: 1;
    font-size: 14.5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.input-msg >>> .emoji-mart-category-label h3{
    background-color: transparent;
}
</style>
