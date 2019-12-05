<template>
    <div>
        <div @mousemove="handlePickerChange" @wheel="handlePickerChange"
             class="collapse"
             id="collapseEmoji">
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
        </div>

        <div id="input-message">
            <div class="box-icon-emoji">
                <img
                        @mousedown.prevent
                        alt="Button emoji"
                        class="btn-emoji-open"
                        data-toggle="collapse"
                        href="#collapseEmoji"
                        role="button"
                        src="@/assets/images/wpp-icon-emoji.svg"
                />
            </div>

            <div class="box-input">
                <div
                        @keypress.enter.exact.prevent="handleEnterPress"
                        @keypress.shift.enter
                        @paste.prevent="onPaste"
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
    import {collapse} from 'bootstrap'
    import {mapState} from "vuex";
    import jquery from "jquery";
    import {msg} from '@/helper.js'

    export default {
        name: "InputMessage",
        components: {
            Picker
        },
        data() {
            return {
                mensagem: "",
                emojiIndex: msg.emojiIndex(),
            };
        },
        computed: {
            ...mapState(["activeChat"])
        },
        methods: {
            onPaste(evt) {
                console.log("PASTE", evt.clipboardData.getData("text"));
                const textMsg = msg.processNativeEmojiToImage(evt.clipboardData.getData("text"));
                document.execCommand("insertHTML", false, textMsg);
            },
            onChange(evt) {
                console.log(evt);
            },
            addEmoji(emoji) {
                this.$refs.input.focus();
                emoji = emoji.native;
                document.execCommand("insertHTML", false, msg.processNativeEmojiToImage(emoji));
            },
            handlePickerChange() {
                console.log("handlePickerChange");
                jquery(".emoji-mart-emoji").on("mousedown", (e) => {
                    e.preventDefault();
                });
                jquery(".emoji-type-image").on("mousedown", (e) => {
                    e.preventDefault();
                });
                jquery(".emoji-mart-anchor").on("mousedown", (e) => {
                    e.preventDefault();
                });
            },
            handleEnterPress(evt) {
                console.log("handleEnterPress -> ");
                this.mensagem = this.formatarEnviar(jquery(this.$refs.input));
                console.log("ENVIAR MENSAGEM:", this.mensagem);

                if (this.mensagem !== '') {
                    this.sendMsg();
                    this.$refs.input.innerHTML = "";
                    this.mensagem = "";
                }
            },
            sendMsg() {
                console.log("SEND MSG ENVIAR ->");

                const form = new FormData();
                form.append("chatId", this.activeChat.id);
                form.append("message", this.mensagem);

                console.log("ENVIAR -> ", this.mensagem);

                api.post('/api/whatsApp/sendMessage', form);
            },
            capitalize(value) {
                if (!value) return "";
                value = value.toString();
                return value.charAt(0).toUpperCase() + value.slice(1);
            },
            formatarEnviar(domElement) {
                let msg = "";
                domElement.contents().each(function (e) {
                    let nodeName = jquery(this)[0].nodeName;
                    if (nodeName == "#text") {
                        msg += jquery(this)[0].data;
                    } else if (nodeName == "IMG") {
                        msg += jquery(this)[0].alt;
                    } else if (nodeName == "BR") {
                        msg += "\n";
                    }
                });
                domElement.empty();
                return msg;
            }
        }
    };
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