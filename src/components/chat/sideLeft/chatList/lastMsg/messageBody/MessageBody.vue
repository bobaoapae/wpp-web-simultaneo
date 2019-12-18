<template>
   <span v-html="bodyFormated" v-if="isChat"></span>

   <span v-else-if="isImage">
        <img src="@/assets/images/wpp-type-foto.svg">
        Foto
    </span>

   <span v-else-if="isSticker">
        <img src="@/assets/images/wpp-type-sticker.svg">
        Figurinha
    </span>

   <span v-else-if="isVideo">
        <img src="@/assets/images/wpp-type-video.svg">
        Video
    </span>

   <span v-else-if="isGif">
        <img src="@/assets/images/wpp-type-gif.svg">
        GIF
    </span>

   <span v-else-if="isDocument">
        <img src="@/assets/images/wpp-type-document.svg">
        {{lastMsg.filename}}
    </span>

   <span v-else-if="isAudio">
        <img src="@/assets/images/wpp-type-ptt-blue.svg">
        {{duration}}
    </span>
</template>

<script>
import { msg } from '@/helper.js';

export default {
    name: 'MessageBody',
    props: {
        lastMsg: {
            type: Object,
            required: true
        }
    },
    computed: {
        isChat () {
            return this.lastMsg.type === 'chat';
        },
        isImage () {
            return this.lastMsg.type === 'image';
        },
        isSticker () {
            return this.lastMsg.type === 'sticker';
        },
        isVideo () {
            return this.lastMsg.type === 'video';
        },
        isGif () {
            return this.lastMsg.type === 'gif';
        },
        isDocument () {
            return this.lastMsg.type === 'document';
        },
        isAudio () {
            return this.lastMsg.type === 'ptt';
        },
        bodyFormated () {
            return msg.processNativeEmojiToImage(this.lastMsg.body);
        },
        duration () {
            const duration = this.lastMsg.duration;

            if (duration < 10) {
                return `0:0${duration}`;
            } else if (duration < 60) {
                return `0:${duration}`;
            }
            const m = Math.floor(duration / 60);
            let s = Math.floor((((duration / 60) - m) * 60));

            if (s < 10) s = '0' + s;

            return `${m}:${s}`;
        }
    }
};
</script>

<style scoped>
   span {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
   }

   span img {
      margin-right: 3px;
   }
</style>
