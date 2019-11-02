<template>
    <span v-if="isChat">
        {{lastMsg.body}}
    </span>

    <span v-else-if="isImage">
        <img src="@/assets/images/wpp-type-foto.svg" alt="">
        Foto
    </span>

    <span v-else-if="isSticker">
        <img src="@/assets/images/wpp-type-sticker.svg" alt="">
        Figurinha
    </span>

    <span v-else-if="isVideo">
        <img src="@/assets/images/wpp-type-video.svg" alt="">
        Video
    </span>

    <span v-else-if="isGif">
        <img src="@/assets/images/wpp-type-gif.svg" alt="">
        GIF
    </span>
</template>

<script>
    export default {
        name:'MessageBody',
        props: {
            lastMsg: {
                type: Object,
                required: true
            }
        },
        computed: {
            isChat() {
                return this.lastMsg.type === 'chat';
            },
            isImage() {
                return this.lastMsg.type === 'image';
            },
            isSticker() {
                return this.lastMsg.type === 'sticker';
            },
            isVideo() {
                return this.lastMsg.type === 'video';
            },
            isGif() {
                return this.lastMsg.type === 'gif';
            }
        }
    }
</script>

<style scoped>

</style>