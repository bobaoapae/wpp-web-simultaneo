<template>
   <div class="message-out">
      <div @mouseenter="showMenuIcon = true" @mouseleave="showMenuIcon = false" class="message-out-container">
         <div
            :style="[isSameColor ? {background: 'linear-gradient(90deg,hsla(0,0%,100%,0) 0,#DCF8C6 50%)', height: '25px', width: '40px'} : {}]"
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
               <b-dropdown-item @click="handleClickDelete">Apagar mensagem</b-dropdown-item>
            </b-dropdown>
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
          <MessageRevoked :msg="msg" v-else-if="isRevoked"/>
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
        MessageRevoked
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
        },
        isRevoked () {
            return this.msg.type === 'revoked';
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

</style>
