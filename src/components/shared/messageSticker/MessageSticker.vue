<template>
    <div class="sticker-container" v-b-visible.once="onVisible">
        <div class="box-sticker">
            <img :src="this.sticker" alt="sticker" class="sticker"/>
        </div>

        <MessageTime :msg="msg"/>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';
    import MessageTime from '@/components/shared/messageTime/MessageTime.vue';
    import api from '@/api.js';
    import LoadingMedia from "../loadingMedia/LoadingMedia";

    export default {
        name: 'MessageSticker',
        components: {
            LoadingMedia,
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
                sticker: this.msg.base64MediaFull
            }
        },
        computed: {
            ...mapState(['activeChat'])
        },
        methods: {
            ...mapActions(['addFullMediaInMsg']),

            getSticker() {
                if (!this.msg.base64MediaFull) {
                    api.get(`/api/whatsApp/mediaMessage/${this.msg.id._serialized}/false`)
                        .then(r => {
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
                                media: r.data.base64,
                            })
                        })
                } else {
                    this.sticker = this.msg.base64MediaFull;
                }
            },
            onVisible(visible) {
                if (visible && !this.sticker) {
                    this.getSticker();
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