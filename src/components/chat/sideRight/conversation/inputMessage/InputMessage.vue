<template>
    <div>
        <div class="collapse" id="collapseEmoji">
            <picker
                    set="emojione"
                    @select="addEmoji"
                    :showPreview="false"
                    :emojiSize="32"
                    :recent="[]"
                    :style="{ height:'320px' }"
            />
        </div>


        <div id="input-message">
            <div class="box-icon-send">
                <img src="@/assets/images/wpp-icon-emoji.svg" alt="Button emoji" data-toggle="collapse"
                     href="#collapseEmoji" role="button">
            </div>

            <div class="box-input">
                <div
                        data-text="Digite uma mensagem"
                        class="input"
                        contenteditable="true"
                        @keypress.enter.exact.prevent="handleEnterPress"
                        @input="onInput"
                ></div>
            </div>

            <div class="box-icon-emoji">
                <img src="@/assets/images/wpp-icon-send.svg" alt="Button emoji">
            </div>
        </div>

    </div>
</template>

<script>
    import api from '@/api.js';
    import { Collapse } from 'bootstrap';
    import { Picker } from 'emoji-mart-vue';
    import { mapState } from 'vuex';
    import emojione from 'emojione'

    export default {
        name: "InputMessage",
        components: {
            Picker,
        },
        data() {
            return {
                mensagem: "<b>dw</b>",
            }
        },
        computed: {
            ...mapState(['activeChat'])
        },
        methods: {
            onChange(evt) {
                console.log(evt);
            },
            addEmoji(evt) {
                console.log(evt);
            },
            labelClick() {

            },
            handleEnterPress(evt) {
                console.log("handleEnterPress -> ");
                this.mensagem = evt.target.innerText;
                console.log('ENVIAR MENSAGEM:', this.mensagem);

                this.sendMsg();

                evt.target.innerText = '';
                this.mensagem = '';
            },
            onInput(evt) {
                this.mensagem = evt.target.innerText;
                console.log("onEdit ->", evt.target.innerHTML);
                console.log("this.mensagem =>", this.mensagem);
            },
            sendMsg() {
                const form = new FormData();
                form.append('chatId', this.activeChat.id);
                form.append('message', this.mensagem);

                console.log("ENVIAR -> ", this.mensagem);

                //api.post('/api/whatsApp/sendMessage', form);
            },

            capitalize(value) {
                if (!value) return '';
                value = value.toString();
                return value.charAt(0).toUpperCase() + value.slice(1)
            }

        }
    };
</script>

<style scoped>
    .emoji-mart {
        width: 100% !important;
    }

    [contentEditable=true]:empty:before {
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
        background: #EFEFEF;
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