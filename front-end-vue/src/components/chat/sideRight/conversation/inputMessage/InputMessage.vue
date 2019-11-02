<template>
    <div id="input-message">
        <div class="box-icon-send">
            <img src="@/assets/images/wpp-icon-emoji.svg" alt="Button emoji">
        </div>

        <div class="box-input">
            <div
                    class="input"
                    contenteditable="true"
                    @keypress.prevent.enter="handleEnterPress"
                    v-html="mensagem"
                    @input="onEdit"
            ></div>
        </div>

        <div class="box-icon-emoji">
            <img src="@/assets/images/wpp-icon-send.svg" alt="Button emoji">
        </div>
    </div>
</template>

<script>
    import api from '@/api.js'
    import {mapState} from 'vuex'

    export default {
        name: "InputMessage",
        data() {
            return {
                mensagem:''
            }
        },
        computed: {
            ...mapState(['activeChat'])
        },
        methods: {
            handleEnterPress(evt) {
                this.mensagem = evt.target.innerText;
                //console.log('ENVIAR MENSAGEM:', this.mensagem);

                this.sendMsg();

                evt.target.innerText = '';
                this.mensagem = '';
            },
            onEdit(evt) {

            },
            sendMsg() {
                const form = new FormData();
                form.append('chatId', this.activeChat.id);
                form.append('message', this.mensagem);

                api.post('/api/whatsApp/sendMessage', form);
            }

        }
    };
</script>

<style scoped>
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
        position: relative;
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