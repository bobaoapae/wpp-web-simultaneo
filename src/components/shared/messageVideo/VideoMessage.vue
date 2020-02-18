<template>
   <div class="message-video" v-b-visible.once="onVisible">
      <div @click="handleClick" class="video-container">
         <div class="box-preview blur">
            <img :src=" 'data:image/jpeg;base64,'+ msg.body" alt="body">
         </div>

         <LoadingMedia v-if="!srcVideo"/>
         <PlayMedia v-else/>
      </div>

      <div class="box-caption" v-if="msg.caption">
         <span v-html="msg.caption | formatMsg"></span>
      </div>

      <MessageTime :class="{'no-caption' : !haveCaption, 'custom-time' : !haveCaption}" :msg="msg"/>
   </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import LoadingMedia from '../loadingMedia/LoadingMedia.vue';
import MessageTime from '../messageTime/MessageTime.vue';
import PlayMedia from '../playMedia/PlayMedia';

export default {
    name: 'VideoMessage',
    components: {
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
            srcVideo: this.msg.base64MediaFull
        };
    },
    computed: {
        haveCaption () {
            return this.msg.caption !== undefined;
        }
    },
    methods: {
        ...mapActions(['addFullMediaInMsg', 'downloadMedia']),
        ...mapMutations(['SET_MODAL']),

        getVideo () {
            if (!this.msg.base64MediaFull) {
                this.downloadMedia({ id: this.msg.id._serialized }).then(e => {
                    this.srcVideo = e.base64;
                    this.saveInCache(this.srcVideo);
                });
            } else {
                this.srcVideo = this.msg.base64MediaFull;
            }
        },
        saveInCache (media) {
            let idChat;
            if (this.msg.id.fromMe) {
                idChat = this.msg.to;
            } else {
                idChat = this.msg.from;
            }

            this.addFullMediaInMsg({
                idChat: idChat,
                idMsg: this.msg.id,
                media: media
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

   .box-caption {
      max-width: 220px;
      min-width: 220px;
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
</style>
