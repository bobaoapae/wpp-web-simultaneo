<template>
   <div class="message-in">
      <div @mouseenter="showMenuIcon = true" @mouseleave="showMenuIcon = false" class="message-in-container">

         <div
            :style="[isSameColor ? {background: 'linear-gradient(90deg,hsla(0,0%,100%,0) 0,#FFF 50%)', height: '25px', width: '48px'} : {}]"
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
                  <img :style="[isSameColor ? {filter: 'brightness(0.55) grayscale(1)'} :{}]" class="icon"
                       src="@/assets/images/wpp-message-arrow-down.svg">
               </template>

               <b-dropdown-item @click="handleClickAnswer">Responder</b-dropdown-item>
               <b-dropdown-item>Apagar mensagem</b-dropdown-item>
            </b-dropdown>
         </div>

         <!-- Identificador de mensagens no grupo -->
         <div class="identify-msg-group p-2" v-if="activeChat.kind === 'group'">
            <div v-if="msg.senderObj.name">
               {{msg.senderObj.name}}
            </div>

            <div class="d-flex justify-content-between" v-else>
               <span class="number">+{{msg.senderObj.id.replace('@c.us','')}}</span>
               <span class="name">~{{msg.senderObj.pushname}}</span>
            </div>
         </div>

         <!-- Mensagem Encaminhada -->
         <ForwardedIndicator v-if="msg.isForwarded"/>

         <QuotedMsg :quotedMsg="msg.quotedMsgObject" v-if="hasQuotedMsg"/>

         <MessageText :msg="msg" v-if="isChat"/>
         <MessagePhoto :msg="msg" v-else-if="isImage"/>
         <MessageSticker :msg="msg" v-else-if="isSticker"/>
         <MessageVideo :msg="msg" v-else-if="isVideo"/>
         <MessageDocument :msg="msg" v-else-if="isDocument"/>
         <MessageAudio :msg="msg" v-else-if="isAudio"/>
      </div>
   </div>
</template>

<script>
import { mapState } from 'vuex';
import MessageText from '@/components/shared/messageText/MessageText.vue';
import MessagePhoto from '@/components/shared/messagePhoto/MessagePhoto.vue';
import MessageSticker from '@/components/shared/messageSticker/MessageSticker.vue';
import MessageVideo from '@/components/shared/messageVideo/VideoMessage.vue';
import MessageDocument from '@/components/shared/messageDocument/MessageDocument';
import ForwardedIndicator from '@/components/shared/forwardedIndicator/ForwardedIndicator';
import MessageAudio from '@/components/shared/messageAudio/MessageAudio';
import QuotedMsg from '../quotedMsg/QuotedMsg';

export default {
    name: 'MessageIn',
    components: {
        QuotedMsg,
        MessageAudio,
        ForwardedIndicator,
        MessageText,
        MessagePhoto,
        MessageSticker,
        MessageVideo,
        MessageDocument
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
        }
    },
    computed: {
        ...mapState(['activeChat']),

        isSameColor () {
            return this.isChat && !this.hasQuotedMsg;
        },
        hasQuotedMsg () {
            return !!this.msg.quotedMsg;
        },
        isChat () {
            return this.msg.type === 'chat';
        },
        isImage () {
            return this.msg.type === 'image';
        },
        isSticker () {
            return this.msg.type === 'sticker';
        },
        isVideo () {
            return this.msg.type === 'video';
        },
        isDocument () {
            return this.msg.type === 'document';
        },
        isAudio () {
            return this.msg.type === 'ptt' || this.msg.type === 'audio';
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
      height: 40px;
      max-width: 90%;
      width: 156px;
      z-index: 1;
   }

   .icon {
      cursor: pointer;
      margin-top: -15px;
   }

   .identify-msg-group {
      font-size: 12px;
      font-weight: 500;
   }

   .name {
      color: rgba(0, 0, 0, .4) !important;
      margin-left: 8px;
   }

   .message-in {
      max-width: 65%;
      padding: 0 9%;
      margin-bottom: 8px;
      display: flex;
      justify-content: flex-start;
   }

   .message-in-container {
      box-shadow: 0 1px 0.5px rgba(0, 0, 0, .13);
      position: relative;
      background-color: #fff;
      border-radius: 7.5px;
   }
</style>
