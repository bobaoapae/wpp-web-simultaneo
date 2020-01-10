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

   <span v-else-if="isPtt">
        <img src="@/assets/images/wpp-type-ptt-blue.svg">
        {{duration}}
    </span>

    <span v-else-if="isAudio">
        <img src="@/assets/images/wpp-type-audio.svg">
        Áudio
    </span>

    <span v-else-if="isRevoked" class="msgRevoked">
        <span data-icon="recalled-in">
            <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 17 19" width="17" height="19">
                <path fill="#9BA3A7" d="M12.629 12.463a5.17 5.17 0 0 0-7.208-7.209l7.208 7.209zm-1.23 1.229L4.191 6.484a5.17 5.17 0 0 0 7.208 7.208zM8.41 2.564a6.91 6.91 0 1 1 0 13.82 6.91 6.91 0 0 1 0-13.82z">
                </path>
            </svg>
        </span>

        <span v-if="lastMsg.id.fromMe">Você apagou essa mensagem</span>
        <span v-else>Essa mensagem foi apagada</span>
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
            return this.lastMsg.type === 'audio';
        },
        isPtt () {
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
        },
        isRevoked () {
            return this.lastMsg.type === 'revoked';
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
       vertical-align: top;
   }

    .msgRevoked {
        font-style: italic;
    }

    .msgRevoked span:nth-child(1) {
        margin-right: 2px;
    }
</style>
