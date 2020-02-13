<template>
   <div class="message-out">
       <div v-if="showTail" class="tail"></div>
       <div @mouseenter="showMenuIcon = true" @mouseleave="showMenuIcon = false" class="message-out-container" :class="showTail ? 'tail' : ''">
           <div v-if="showTail" class="tail-container"></div>
           <div
            :style="[msg.isSameColor ? {background: 'linear-gradient(90deg,hsla(0,0%,100%,0) 0,#DCF8C6 50%)', height: '25px', width: '40px'} : {}]"
            class="msg-menu"
            v-show="showMenuIcon || menuAberto">
            <b-dropdown
               @hide="handleHideMenu"
               @show="handleShowMenu"
               lazy
               no-caret
               toggle-class="text-decoration-none p-0"
               variant="link"
            >
               <template v-slot:button-content>
                  <img :style="[msg.isSameColor ? {filter: 'brightness(0.55) grayscale(1)'} :{}]" class="icon"
                       src="@/assets/images/wpp-message-arrow-down.svg">
               </template>

               <b-dropdown-item @click="handleClickAnswer">Responder</b-dropdown-item>
               <b-dropdown-item @click="handleClickDelete">Apagar mensagem</b-dropdown-item>
            </b-dropdown>
         </div>

         <!-- Mensagem Encaminhada -->
         <ForwardedIndicator v-if="msg.isForwarded"/>
         <QuotedMsg :quotedMsg="msg.quotedMsgObject" v-if="msg.hasQuotedMsg"/>
         <MessageText :msg="msg" v-if="msg.isChat"/>
         <MessagePhoto :msg="msg" v-else-if="msg.isImage"/>
         <MessageSticker :msg="msg" v-else-if="msg.isSticker"/>
         <MessageVideo :msg="msg" v-else-if="msg.isVideo"/>
         <MessageDocument :msg="msg" v-else-if="msg.isDocument"/>
         <MessageAudio :msg="msg" v-else-if="msg.isAudio"/>
         <MessageRevoked :msg="msg" v-else-if="msg.isRevoked"/>
         <MessageLocation :msg="msg" v-else-if="msg.isLocation"/>
         <MessageContact :msg="msg" v-else-if="msg.isVcard"/>
      </div>
   </div>
</template>

<script>
import { mapState } from 'vuex';
import MessageText from '@/components/shared/messageText/MessageText.vue';
import MessagePhoto from '@/components/shared/messagePhoto/MessagePhoto.vue';
import MessageSticker from '@/components/shared/messageSticker/MessageSticker';
import MessageVideo from '@/components/shared/messageVideo/VideoMessage.vue';
import MessageDocument from '@/components/shared/messageDocument/MessageDocument';
import ForwardedIndicator from '@/components/shared/forwardedIndicator/ForwardedIndicator';
import MessageAudio from '@/components/shared/messageAudio/MessageAudio';
import QuotedMsg from '../quotedMsg/QuotedMsg';
import MessageRevoked from '../messageRevoked/MessageRevoked';
import MessageLocation from '../messageLocation/MessageLocation';
import MessageContact from '../messageContact/MessageContact';

export default {
    name: 'MessageOut',
    components: {
        QuotedMsg,
        MessageAudio,
        ForwardedIndicator,
        MessageSticker,
        MessageText,
        MessagePhoto,
        MessageVideo,
        MessageDocument,
        MessageRevoked,
        MessageLocation,
        MessageContact
    },
    data () {
        return {
            showMenuIcon: false,
            menuAberto: false
        };
    },
    props: {
        msg: {
            type: Object,
            required: true
        },
        previousMsg: {
            type: Object,
            required: false
        }
    },
    computed: {
        ...mapState(['activeChat']),

        showTail () {
            return !this.previousMsg || this.msg.from !== this.previousMsg.from;
        }
    },
    methods: {
        handleShowMenu (evt) {
            this.menuAberto = true;
        },

        handleHideMenu (evt) {
            this.menuAberto = false;
        },

        handleClickAnswer (evt) {
            this.activeChat.quotedMsg = this.msg;
        },

        handleClickDelete () {
            this.$root.$emit('showModalDelteMsg', this.msg);
        }
    }
};
</script>

<style scoped>
   .msg-menu {
      position: absolute;
      top: 3px;
      right: 3px;
      border-top-right-radius: 5px;
      display: block;
      text-align: right;
      background: linear-gradient(15deg, transparent, transparent 45%, rgba(0, 0, 0, .12) 70%, rgba(0, 0, 0, .33));
      height: 25px;
      max-width: 90%;
      width: 156px;
      z-index: 1;
   }

   .icon {
      cursor: pointer;
      margin-top: -15px;
   }

   .message-out {
      padding: 0 9%;
      margin-bottom: 8px;
      display: flex;
      justify-content: flex-end;
   }

   .message-out-container {
      box-shadow: 0 1px 0.5px rgba(0, 0, 0, .13);
      position: relative;
      background-color: #DCF8C6;
      border-radius: 7.5px;
   }

   .tail {
       border-top-right-radius: 0;
   }

   .tail-container {
       position: absolute;
       right: -12px;
       min-width: 12px;
       min-height: 19px;
       max-width: 12px;
       max-height: 19px;
       background-position: 50% 50%;
       background-repeat: no-repeat;
       background-size: contain;
       background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAmCAMAAADp2asXAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADAUExURUxpcXmHa4maet/4yA0aDRMTE8fhsgAAAAAAAMDXrCsxJeX/z1xzXIiYetPsvGBsVUdPPuH8zOH8zNDrvMvmtrrOpwAAAAAAABUVFRoaGtnyxLTMozQ+MMfftFBeSR8nH5aoh6q/mW9+ZN/4yMjhtRwlHAAAAIOWd+r/06C1kkNLOwsLC9z4xur/0+n/0t76x9v4xeL9y+b/z+j/0d/7yeH8yuX/zeD8ytz5xt76yOP/zeH+y+b/zuD8yd35xuf/0MY9jkkAAAAsdFJOUwBvd/ATDZIBAsMp/At/11c9yPbizHoICQwT4bY1ykkgjahl6s8bBYT6nUAWOLbtFAAAAIhJREFUKM/tzbUWwlAURNFBE9zdg0NecLf//yvKUJyUdDnl7HXXletXqmXl9wPbQ9JCcC+VJsOj2mDwovzj3osjHGNFEVxNRAj7UR1hlx+I4FbuC8HkZBE8OwnRxamdFsEmUxCCGdoI51RLBK9xVwTvjyMEbzlDMJMp7lqseNc8YNc6CGyF/a0vcmwhZbCG+kEAAAAASUVORK5CYII=");
   }

</style>
