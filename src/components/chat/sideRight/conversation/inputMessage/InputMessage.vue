<template>
    <div>
        <div class="collapse" id="collapseEmoji">
            <picker
                set="emojione"
                @select="addEmoji"
                :showPreview="false"
                :emojiSize="32"
                :recent="[]"
                :style="{ height:'320px'}"
            />
        </div>

        <div id="input-message">
            <div class="box-icon-emoji">
                <img
                    src="@/assets/images/wpp-icon-emoji.svg"
                    alt="Button emoji"
                    data-toggle="collapse"
                    href="#collapseEmoji"
                    role="button"
                    class="btn-emoji-open"
                    @mousedown.prevent
                />
            </div>

            <div class="box-input">
                <div
                    data-text="Digite uma mensagem"
                    class="input"
                    contenteditable="true"
                    @keypress.enter.exact.prevent="handleEnterPress"
                    @paste.prevent="onPaste"
                ></div>
            </div>

            <div class="box-icon-send">
                <img src="@/assets/images/wpp-icon-send.svg" />
            </div>
        </div>
    </div>
</template>

<script>
import api from "@/api.js";
import { Collapse } from "bootstrap";
import { Picker } from "emoji-mart-vue";
import { mapState } from "vuex";
import emojione from "emojione";
import jquery from "jquery";

export default {
    name: "InputMessage",
    components: {
        Picker
    },
    data() {
        return {
            mensagem: ""
        };
    },
    mounted() {
        jquery(".emoji-mart-emoji").on("mousedown", (e) => {
            e.preventDefault();
        });
    },
    computed: {
        ...mapState(["activeChat"])
    },
    methods: {
        onPaste(evt) {
            console.log("PASTE", evt.clipboardData.getData("text"));
            const msg = emojione.toImage(evt.clipboardData.getData("text"));
            document.execCommand("insertHTML", false, msg);
        },
        onChange(evt) {
            console.log(evt);
        },
        addEmoji(emoji) {
            emoji = emoji.native;
            document.execCommand("insertHTML", false, emojione.toImage(emoji));
        },
        handleEnterPress(evt) {
            console.log("handleEnterPress -> ");
            this.mensagem = evt.target.innerText;
            console.log("ENVIAR MENSAGEM:", this.mensagem);

            this.sendMsg();

            evt.target.innerText = "";
            this.mensagem = "";
        },
        onInput(evt) {
            this.mensagem = evt.target.innerText;
            console.log("onEdit ->", evt.target.innerHTML);
            console.log("this.mensagem =>", this.mensagem);
        },
        sendMsg() {
            console.log("SEND MSG ENVIAR ->");

            const form = new FormData();
            form.append("chatId", this.activeChat.id);
            form.append("message", this.formatarEnviar(jquery(".input")));

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