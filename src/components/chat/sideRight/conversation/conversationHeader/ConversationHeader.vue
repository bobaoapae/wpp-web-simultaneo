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
                <img src="@/assets/images/wpp-icon-clip.svg" @click="handleClick">
                <input type="file" id="file" @change="onChange" />
            </label>

            <img src="@/assets/images/wpp-icon-kebab-menu.svg">
        </div>

    </div>
</template>

<script>
    import {mapState} from 'vuex'
    import api from '@/api.js';
    import ChatActivePhoto from './chatActivePhoto/ChatActivePhoto.vue'

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
                    return emojione.toImage(this.activeChat.contact.name)
                } else {
                    return "+" + this.activeChat.id.replace('@c.us', '');
                }
            }
        },
        created() {
            console.log('activeChat', this.activeChat);
        },
        methods: {
            handleClick() {

            },
            onChange(event) {
                console.log(event.target.files[0]);

                const toBase64 = (file) => new Promise((resolve, reject) => {
                    const reader = new FileReader();
                    reader.readAsDataURL(file);
                    reader.onload = () => resolve(reader.result);
                    reader.onerror = error => reject(error);
                });

                (async () => {
                    const file = event.target.files[0];
                    this.file = (await toBase64(file));
                    this.sendMsg(event.target.files[0].name)
                })();
            },
            sendMsg(name) {
                const form = new FormData();
                form.append('chatId', this.activeChat.id);
                form.append('media', this.file);
                form.append('fileName', name);

                api.post('/api/whatsApp/sendMessage', form);
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