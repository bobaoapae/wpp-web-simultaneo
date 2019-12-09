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
                              people: 'Emojis & Pessoas',
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

        <div id="input-message">
            <div class="box-icon-emoji">
                <b-img
                        v-b-toggle.collapse-emoji
                        @mousedown.prevent
                        alt="Button emoji"
                        class="btn-emoji-open"
                        role="button"
                        src="@/assets/images/wpp-icon-emoji.svg"
                />
            </div>

            <div class="box-input">
                <div
                        @keypress.enter.exact.prevent="handleEnterPress"
                        @paste.prevent="onPaste"
                        @focusin="restorePosition"
                        @input="savePosition"
                        @keyup="savePosition"
                        @mouseup="savePosition"
                        class="input"
                        contenteditable="true"
                        data-text="Digite uma mensagem"
                        ref="input"
                ></div>
            </div>

            <div class="box-icon-send">
                <img src="@/assets/images/wpp-icon-send.svg"/>
            </div>
        </div>
    </div>
</template>

<script>
    import api from "@/api.js";
    import {Picker} from 'emoji-mart-vue-fast'
    import {mapState} from "vuex";
    import {msg} from '@/helper.js'
    import {rageSave} from '@/rangeSelectionSaveRestore.js'

    export default {
        name: "InputMessage",
        components: {
            Picker
        },
        data() {
            return {
                mensagem: "",
                emojiIndex: msg.emojiIndex(),
                restore: null
            };
        },
        computed: {
            ...mapState(["activeChat"])
        },
        methods: {
            onPaste(evt) {
                const textMsg = msg.processNativeEmojiToImage(evt.clipboardData.getData("text"));
                document.execCommand("insertHTML", false, textMsg);
            },
            restorePosition(evt) {
                if (this.restore) {
                    rageSave.restoreSelection(this.restore);
                    this.restore = null;
                }
            },
            savePosition(evt) {
                this.restore = rageSave.saveSelection();
            },
            addEmoji(emoji) {
                this.$refs.input.focus();
                emoji = emoji.native;
                document.execCommand("insertHTML", false, msg.processNativeEmojiToImage(emoji));
            },
            handleEnterPress(evt) {
                this.mensagem = this.formatarEnviar(this.$refs.input);
                console.log("ENVIAR MENSAGEM:", this.mensagem);

                if (this.mensagem !== '') {
                    this.sendMsg();
                    this.$refs.input.innerHTML = "";
                    this.mensagem = "";
                    this.restore = null
                }
            },
            sendMsg() {
                const form = new FormData();
                form.append("chatId", this.activeChat.id);
                form.append("message", this.mensagem);
                api.post('/api/whatsApp/sendMessage', form);
            },
            capitalize(value) {
                if (!value) return "";
                value = value.toString();
                return value.charAt(0).toUpperCase() + value.slice(1);
            },
            formatarEnviar(domElement) {
                let msg = "";
                domElement.childNodes.forEach(function (e) {
                    let nodeName = e.nodeName;
                    if (nodeName == "#text") {
                        msg += e.data;
                    } else if (nodeName == "IMG") {
                        msg += e.alt;
                    } else if (nodeName == "BR") {
                        msg += "\n";
                    }
                });
                domElement.innerHTML = "";
                return msg;
            }
        }
    }
    ;
</script>

<style scoped>
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
</style>