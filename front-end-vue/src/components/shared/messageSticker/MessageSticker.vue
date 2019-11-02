<template>
    <img :src="imagem" alt="sticker">
</template>

<script>
    export  default {
        name: 'MessageSticker',
        props: {
            msg: {
                type: Object,
                required: true
            }
        },
        data() {
            return {
                imagem:''
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

</style>