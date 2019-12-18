<template>
   <div class="message-audio" v-b-visible.once="onVisible">
      <div class="audio-container">
         <div class="box-spinner" v-show="srcLoading && !srcAudio">
            <svg
               class="_2bESe"
               height="34"
               viewBox="0 0 43 43"
               width="34">
               <circle
                  class="oWVod _1y_Nu _2BA8e"
                  cx="21.5"
                  cy="21.5"
                  fill="none"
                  r="20"
                  stroke-width="3">

               </circle>
            </svg>
         </div>

         <div @click="getAudio" class="box-download" v-show="srcError && !srcLoading && !srcAudio">
            <img src="@/assets/images/wpp-icon-download-audio.svg">
         </div>

         <div class="box-range" v-show="srcLoading || srcError"></div>

         <audio :src="srcAudio" controls ref="playAudio" v-show="!srcLoading && !srcError && srcAudio"></audio>

         <MessageTime :msg="msg"/>
      </div>
   </div>
</template>

<script>
import { mapActions } from 'vuex';
import MessageTime from '../messageTime/MessageTime';

export default {
    name: 'MessageAudio',
    components: {
        MessageTime
    },
    props: {
        msg: {
            type: Object,
            required: true
        }
    },
    mounted () {
        this.$refs.playAudio.addEventListener('play', this.handleMarkPlayed);
    },
    data () {
        return {
            srcAudio: this.msg.base64MediaFull,
            srcLoading: false,
            srcError: false
        };
    },
    methods: {
        ...mapActions(['addFullMediaInMsg', 'markPlayed', 'sendWsMessage']),

        handleMarkPlayed () {
            if (this.msg.ack !== 4) {
                this.markPlayed({ msgId: this.msg.id._serialized });
            }
        },
        getAudio () {
            this.srcLoading = true;

            if (!this.msg.base64MediaFull) {
                this.sendWsMessage({ msg: `downloadMedia,${this.msg.id._serialized}` }).then(e => {
                    this.srcAudio = e.base64;
                    this.srcLoading = false;
                    this.srcError = false;
                    this.saveInCache(this.srcAudio);
                }).catch(e => {
                    this.srcLoading = false;
                    this.srcError = true;
                });
            } else {
                this.srcAudio = this.msg.base64MediaFull;
                this.srcLoading = false;
                this.srcError = false;
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
        onVisible (visible) {
            if (visible && !this.srcAudio) {
                this.getAudio();
            }
        }
    }
};
</script>

<style scoped>
   .message-audio {
      padding: 3px;
   }

   .audio-container {
      display: flex;
      align-items: center;
      margin-bottom: 25px;
   }

   .box-spinner {
      padding: 5px;
      margin-right: 10px;
   }

   .box-download {
      padding: 5px;
      margin-right: 10px;
   }

   .box-range {
      min-width: 200px;
      min-height: 20px;
      display: flex;
      align-items: center;
      margin-right: 10px;
   }

   .box-range::before {
      content: '';
      width: 100%;
      height: 3px;
      background-color: rgba(0, 0, 0, .2);
      display: block;
      border-radius: 10px;
   }

   audio {
      background: transparent !important;
   }

   svg {
      animation: _3rafi 2s linear infinite;
   }

   ._2BA8e {
      stroke: #849982;
   }

   .oWVod {
      stroke-dasharray: 1, 150;
      stroke-dashoffset: 0;
      stroke-linecap: round;
      animation: _1NbMv 1.5s ease-in-out infinite;
   }

   @keyframes _3rafi {
      100% {
         transform: rotate(1turn);
      }
   }

   @keyframes _1NbMv {
      0% {
         stroke-dasharray: 1, 150;
         stroke-dashoffset: 0;
      }
      50% {
         stroke-dasharray: 90, 150;
         stroke-dashoffset: -35;
      }
      100% {
         stroke-dasharray: 90, 150;
         stroke-dashoffset: -124;
      }
   }
</style>
