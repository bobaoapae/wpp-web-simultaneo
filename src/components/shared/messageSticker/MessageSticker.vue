<template>
    <div class="sticker-container">
        <div class="box-sticker">
            <img :src="srcSticker" alt="sticker" class="sticker">
        </div>

        <MessageTime :msg="msg"/>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import MessageTime from '@/components/shared/messageTime/MessageTime.vue';
    import api from '@/api.js';

    export default {
        name: 'MessageSticker',
        components: {
            MessageTime
        },
        props: {
            msg: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                sticker: ''
            }
        },
        computed: {
            ...mapState(['activeChat']),

            srcSticker() {
                if (this.msg.base64MediaFull) {
                    return this.msg.base64MediaFull;
                } else {
                    return this.sticker;
                }
            }
        },
        created() {
            this.getSticker();
        },
        methods: {
            ...mapActions(['addFullMediaInMsg']),

            getSticker() {
                if (!this.msg.base64MediaFull) {
                    console.log('GET STICKER');
                    api.get(`/api/whatsApp/mediaMessage/${this.msg.id._serialized}/false`)
                        .then(r => {
                            //console.log(r);
                            this.sticker = r.data.base64;

                            let idChat;
                            if (this.msg.id.fromMe) {
                                idChat = this.msg.to;
                            } else {
                                idChat = this.msg.from;
                            }

                            this.addFullMediaInMsg({
                                idChat: idChat,
                                idMsg: this.msg.id,
                                imagem: r.data.base64,
                            })
                        })
                }
            }
        }
    }
</script>


<style scoped>
    .sticker-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .box-sticker {
        min-width: 125px;
        max-width: 125px;
        min-height: 125px;
        max-height: 125px;
        margin-bottom: 30px;
    }

    img {
        width: 100%;
        height: 100%;
    }
</style>