<template>
    <div class="sticker-container">
        <div class="box-sticker">
            <img :src="imagem" alt="sticker" class="sticker">
        </div>

        <MessageTime :msg="msg"/>
    </div>
</template>

<script>
    import MessageTime from '@/components/shared/messageTime/MessageTime.vue';
    import api from '@/api.js';

    export  default {
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
                imagem: ''
            }
        },
        created() {
            this.getFullImage();
        },
        methods: {
            getFullImage() {
                console.log('GET STICKER');
                api.get(`/api/whatsApp/mediaMessage/${this.msg.id._serialized}`)
                    .then(r => {
                        this.imagem = r.data.base64;
                    })
            }
        }
    }
</script>


<style scoped>
    .sticker-container {
        max-width: 125px;
        max-height: 125px;
    }

    .box-sticker {
        width: 100%;
        height: 100%;
        margin-bottom: 30px;
    }

    img {
        width: 100%;
        height: 100%;
    }
</style>