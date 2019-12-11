<template>
    <div id="conversation-header">
        <div class="box-img">
            <ChatActivePhoto/>
        </div>

        <div class="box-info">
            <div class="nome" v-html="nameEmojify"></div>

            <div class="info">

            </div>
        </div>

        <div class="box-icons">
            <img src="@/assets/images/wpp-icon-search.svg">

            <label for="file">
                <img src="@/assets/images/wpp-icon-clip.svg">
                <input @change="onChange" id="file" type="file"/>
            </label>

            <img src="@/assets/images/wpp-icon-kebab-menu.svg">
        </div>

    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex'
    import api from '@/api.js';
    import ChatActivePhoto from './chatActivePhoto/ChatActivePhoto.vue'
    import {msg} from '@/helper.js'

    export default {
        name: "ConversationHeader",
        components: {
            ChatActivePhoto
        },
        data() {
            return {
                file: ''
            }
        },
        computed: {
            ...mapState(['activeChat']),

            nameEmojify() {
                if (this.activeChat.contact.name) {
                    return msg.processNativeEmojiToImage(this.activeChat.contact.name)
                } else {
                    return "+" + this.activeChat.id.replace('@c.us', '');
                }
            }
        },
        methods: {
            ...mapActions(["sendMsg"]),

            onChange(event) {
                const toBase64 = (file) => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });

                (async () => {
                    const file = event.target.files[0];
                    this.file = (await toBase64(file));
                    this.handleSendMsg(event.target.files[0].name);

                    this.activeChat.quotedMsg = undefined;
                })();
            },

            handleSendMsg(name) {
                let msg = {
                    chatId: this.activeChat.id,
                    media: this.file,
                    fileName: name
                };

                if (this.activeChat.quotedMsg) {
                    msg.quotedMsg = this.activeChat.quotedMsg.id._serialized;
                }

                this.sendMsg(msg);
            }
        }
    };
</script>

<style scoped>
    #file {
        display: none;
    }

    label {
        margin: 0;
        padding: 0;
    }


    #conversation-header {
        background: #eee;
        display: flex;
        padding: 10px 16px;
    }

    .box-img {
        padding-right: 15px;
        display: flex;
        align-items: center;
    }

    .box-img img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }

    .box-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        flex-grow: 1;
    }

    .box-info .nome {
        font-size: 16px;
        color: #000000;
    }

    .box-info .info {
        font-size: 13px;
        color: rgba(0, 0, 0, 0.6);
    }

    .box-icons img {
        cursor: pointer;
        padding: 8px;
        margin-left: 10px
    }
</style>