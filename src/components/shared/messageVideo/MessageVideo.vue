<template>
    <div class="message-video" v-observe-visibility="{
         throttle: 300,
         callback: onVisible,
         once: true
    }">
        <div @click="handleClick" class="video-container">
            <div class="box-preview blur">
                <img :src=" 'data:image/jpeg;base64,'+ msg.body" alt="body">
            </div>

            <LoadingMedia v-if="!srcVideo"/>
            <PlayMedia v-else/>
        </div>

        <MessageTextContent @dblclick.prevent.stop v-if="msg.hasCaption" :msg="msg"/>

        <MessageTime :class="{'no-caption' : !msg.hasCaption, 'custom-time' : !msg.hasCaption}" :msg="msg"/>
    </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import LoadingMedia from '../loadingMedia/LoadingMedia.vue';
import MessageTime from '../messageTime/MessageTime.vue';
import PlayMedia from '../playMedia/PlayMedia.vue';
import MessageTextContent from '@/components/shared/messageTextContent/MessageTextContent.vue';

export default {
    name: 'MessageVideo',
    components: {
        MessageTextContent,
        PlayMedia,
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
        ...mapMutations(['SET_MODAL']),

        getVideo () {
            this.downloadMedia({ id: this.msg.id._serialized }).then(e => {
                this.srcVideo = e.base64;
            });
        },
        handleClick () {
            if (this.srcVideo) {
                this.SET_MODAL({
                    show: true,
                    type: 'video',
                    media: this.srcVideo,
                    id: this.msg.id._serialized
                });
            }
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
.message-video {
    padding: 3px;
}

.video-container {
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

img {
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
    color: rgba(0, 0, 0, 0.25);
}
</style>
