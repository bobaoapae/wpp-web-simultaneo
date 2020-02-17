<template>
    <div>
        <b-collapse id="collapse-emoji">
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
                <QuotedMsg :quotedMsg="activeChat.quotedMsg" class="flex-grow-1" v-if="answerVisible"/>

                <div @click="handleClickCloseAnswer" class="close-answer">
                    <img src="@/assets/images/wpp-icon-close-answer.svg">
                </div>
            </div>
        </b-collapse>

        <b-collapse id="collapse-answer-msg" v-model="quickReplysVisible">
            <div v-if="showQuickReplys" class="quick-replys">
                <div class="quick-reply" v-for="quickReply in filteredQuickReplys" :key="quickReply.id" @click="handleClickQuickReply(quickReply)">
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
                    <img src="@/assets/images/wpp-icon-send.svg" v-if="mensagem" @click="handleSendMsg" />
                    <img src="@/assets/images/wpp-icon-mic.svg" v-else-if="!gravando" @click="startRecording" />
                </div>

                <div v-if="gravando">
                    <img src="@/assets/images/wpp-icon-cancel-ptt-outline.svg" @click="stopRecording" />
                    <span class="recorder-time">{{timeConverter}}</span>
                    <img src="@/assets/images/wpp-icon-send-ptt-outline.svg"  @click="sendPtt" />
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { Picker } from 'emoji-mart-vue-fast';
import { mapState, mapActions } from 'vuex';
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
    data () {
        return {
            mensagem: '',
            emojiIndex: msg.emojiIndex(),
            restore: null,
            answerVisible: false,
            quickReplysVisible: false,
            recorder: {},
            gumStream: {},
            gravando: false,
            ignoreRecording: false,
            time: 0,
            interval: null
        };
    },
    watch: {
        'activeChat.quotedMsg': function (val) {
            if (val) {
                this.$refs.input.focus();
                this.answerVisible = true;
            } else {
                this.answerVisible = false;
            }
        }

    },
    computed: {
        ...mapState(['activeChat', 'quickReplys']),

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

        showQuickReplys () {
            return this.mensagem && this.mensagem.charAt(0) === '/' && this.quickReplys && this.quickReplys.length > 0;
        },

        filteredQuickReplys () {
            return this.quickReplys.filter(quickReply => {
                return ('/' + quickReply.shortcut).includes(this.mensagem);
            });
        }
    },
    methods: {
        ...mapActions(['convertToBase64']),

        toggleRecording () {
            this.gravando = !this.gravando;

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
                        this.interval = setInterval(() => { this.time++; }, 1000);

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
            this.convertToBase64({ file: data }).then(value => {
                let msg = {
                    media: value,
                    fileName: new Date().getTime() + '.ptt'
                };

                if (this.activeChat.quotedMsg) {
                    msg.quotedMsg = this.activeChat.quotedMsg.id._serialized;
                }
                this.activeChat.sendMessage(msg);
                this.clearInput();
            });
        },

        onInput (evt) {
            this.savePosition();
            this.mensagem = this.formatar(this.$refs.input);
            if (this.mensagem && this.showQuickReplys) {
                this.quickReplysVisible = true;
            } else {
                this.quickReplysVisible = false;
            }
        },

        handleClickCloseAnswer () {
            this.answerVisible = false;
            this.activeChat.quotedMsg = undefined;
        },

        onPaste (evt) {
            const textMsg = this.$options.filters.emojify(evt.clipboardData.getData('text'));
            document.execCommand('insertHTML', false, textMsg);
        },

        restorePosition () {
            if (this.restore) {
                rageSave.restoreSelection(this.restore);
                this.restore = null;
            }
        },

        savePosition () {
            this.restore = rageSave.saveSelection();
        },

        addEmoji (emoji) {
            this.$refs.input.focus();
            emoji = emoji.native;
            document.execCommand('insertHTML', false, this.$options.filters.emojify(emoji));
        },

        handleEnterPress () {
            if (this.quickReplysVisible && this.filteredQuickReplys.length === 1) {
                this.handleClickQuickReply(this.filteredQuickReplys[0]);
            } else if (this.mensagem !== '') {
                this.handleSendMsg();
            }
        },

        handleSendMsg () {
            let msg = {
                message: this.mensagem
            };

            if (this.activeChat.quotedMsg) {
                msg.quotedMsg = this.activeChat.quotedMsg.id._serialized;
            }

            this.activeChat.sendMessage(msg);
            this.clearInput();
        },

        handleClickQuickReply (quickReply) {
            this.$refs.input.focus();
            this.$refs.input.innerHTML = '';
            this.mensagem = '';
            document.execCommand('insertHTML', false, quickReply.message);
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
        },

        clearInput () {
            this.$refs.input.innerHTML = '';
            this.mensagem = '';
            this.restore = null;
            this.activeChat.quotedMsg = undefined;
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

.quick-replys {
    background-color: #f0f0f0;
    box-shadow: 0 -5px 7px -5px rgba(0,0,0,.04);
    border-left: 1px solid #e0e0e0;
    padding-top: 3px;
    position: relative;
    overflow: hidden;
}

.quick-reply {
    margin-left: 3px;
    color: rgba(0,0,0,.45);
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
    color: rgba(0,0,0,.45);
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
</style>
