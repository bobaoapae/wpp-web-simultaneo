<template>
    <div class="message-gif" v-observe-visibility="{
         throttle: 300,
         callback: onVisible,
         once: true
    }">
        <div class="gif-container">
            <div class="box-preview blur" v-if="!srcVideo">
                <img :src=" 'data:image/jpeg;base64,'+ msg.body" alt="body">
            </div>
            <video :src="srcVideo" autoplay loop v-else/>
            <LoadingMedia v-if="!srcVideo"/>
        </div>

        <MessageTextContent @dblclick.prevent.stop v-if="msg.hasCaption" :msg="msg"/>

        <MessageTime :class="{'no-caption' : !msg.hasCaption, 'custom-time' : !msg.hasCaption}" :msg="msg"/>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import LoadingMedia from '../loadingMedia/LoadingMedia.vue';
import MessageTime from '../messageTime/MessageTime.vue';
import MessageTextContent from '@/components/shared/messageTextContent/MessageTextContent.vue';

export default {
    name: 'MessageGif',
    components: {
        MessageTextContent,
        LoadingMedia,
        MessageTime
    },
    props: {
        msg: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            srcVideo: ''
        };
    },
    methods: {
        ...mapActions(['downloadMedia']),
        getVideo () {
            this.downloadMedia({ id: this.msg.id._serialized }).then(e => {
                this.srcVideo = e.base64;
            });
        },
        onVisible (visible) {
            if (visible && !this.srcVideo) {
                this.getVideo();
            }
        }
    }
};
</script>

<style scoped>
.message-gif {
    padding: 3px;
}

.gif-container {
    max-width: 220px;
    min-width: 220px;
    max-height: 160px;
    min-height: 160px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
}

.box-preview {
    min-width: 100%;
    min-height: 100%;
}

.blur {
    filter: blur(8px);
}

video {
    width: 100%;
    height: 100%;
}

.no-caption {
    color: #FFF;
    background: rgba(0, 0, 0, 0.3);
    padding: 0 5px;
    border-radius: 3px;
}

.box-caption span {
    font-size: 14.2px;
    color: #262626;
}

.custom-time {
    right: 3px;
    bottom: 3px;
}

.box-caption ::v-deep(.mention-symbol) {
    color: rgba(0, 0, 0, 0.25)
}
</style>
