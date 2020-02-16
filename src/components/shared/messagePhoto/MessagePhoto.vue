<template>
   <div class="message-photo" v-b-visible.once="onVisible">
      <div class="photo-container">
         <div class="box-image">
            <img
               :src="imageFull"
               @click="handleClick"
               class="imageFull"
               v-if="imageFull"
            />

            <img :class="{blur : !imageFull}" :src="preview" class="preview" v-else/>
         </div>

         <LoadingMedia v-if="!imageFull"/>
      </div>

      <div class="box-caption" v-if="msg.caption">
         <span :inner-html.prop="msg.caption | formatMsg | emojify"></span>
      </div>

      <MessageTime :class="{'no-caption' : !haveCaption}" :msg="msg"/>
   </div>
</template>

<script>
import MessageTime from '../messageTime/MessageTime';
import LoadingMedia from '../loadingMedia/LoadingMedia';
import { mapActions, mapMutations } from 'vuex';

export default {
    name: 'MessagePhoto',
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
    data () {
        return {
            imageFull: this.msg.base64MediaFull
        };
    },
    computed: {
        preview () {
            return 'data:image/jpeg;base64,' + this.msg.body;
        },
        haveCaption () {
            return this.msg.caption !== undefined;
        }
    },
    methods: {
        ...mapMutations(['SET_MODAL']),
        ...mapActions(['addFullMediaInMsg', 'downloadMedia']),

        getFullImage () {
            if (!this.msg.base64MediaFull) {
                this.downloadMedia({ id: this.msg.id._serialized }).then(e => {
                    this.imageFull = e.base64;

                    let idChat;
                    if (this.msg.id.fromMe) {
                        idChat = this.msg.to;
                    } else {
                        idChat = this.msg.from;
                    }

                    this.addFullMediaInMsg({
                        idChat: idChat,
                        idMsg: this.msg.id,
                        media: this.imageFull
                    });
                });
            } else {
                this.imageFull = this.msg.base64MediaFull;
            }
        },
        handleClick () {
            this.SET_MODAL({
                show: true,
                media: this.imageFull,
                type: 'img',
                id: this.msg.id._serialized
            });
        },
        onVisible (visible) {
            if (visible && !this.imageFull) {
                this.getFullImage();
            }
        }
    }
};
</script>

<style scoped>
   .message-photo {
      padding: 5px;
   }

   .photo-container {
      max-width: 330px;
      min-width: 330px;

      max-height: 330px;
      min-height: 100px;

      overflow: hidden;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 6px;
   }

   .box-caption {
      max-width: 330px;
      min-width: 330px;
      word-wrap: break-word;
   }

   .box-image {
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

   .imageFull {
      cursor: pointer;
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
</style>
