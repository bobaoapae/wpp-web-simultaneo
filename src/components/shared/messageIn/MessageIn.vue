<template>
   <div class="message-in">
      <div @mouseenter="showMenuIcon = true" @mouseleave="showMenuIcon = false" class="message-in-container" :class="showTail ? 'tail' : ''">
         <div v-if="showTail" class="tail-container"></div>
         <div
            :style="[msg.isSameColor ? {background: 'linear-gradient(90deg,hsla(0,0%,100%,0) 0,#FFF 50%)', height: '25px', width: '48px'} : {}]"
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

         <!-- Identificador de mensagens no grupo -->
         <div class="identify-msg-group p-2" v-if="activeChat.isGroup && showTail">
            <div v-if="msg.senderObj.name" :style="{color: activeChat.getColor(msg.senderObj.id)}">
               {{msg.senderObj.name | emojify}}
            </div>

            <div class="d-flex justify-content-between" v-else>
               <span class="number" :style="{color: activeChat.getColor(msg.senderObj.id)}">{{msg.senderObj.formattedName | emojify}}</span>
               <span class="name">~{{msg.senderObj.pushname}}</span>
            </div>
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
import MessageSticker from '@/components/shared/messageSticker/MessageSticker.vue';
import MessageVideo from '@/components/shared/messageVideo/VideoMessage.vue';
import MessageDocument from '@/components/shared/messageDocument/MessageDocument';
import ForwardedIndicator from '@/components/shared/forwardedIndicator/ForwardedIndicator';
import MessageAudio from '@/components/shared/messageAudio/MessageAudio';
import QuotedMsg from '../quotedMsg/QuotedMsg';
import MessageRevoked from '../messageRevoked/MessageRevoked';
import MessageLocation from '../messageLocation/MessageLocation';
import MessageContact from '../messageContact/MessageContact';

export default {
    name: 'MessageIn',
    components: {
        MessageRevoked,
        QuotedMsg,
        MessageAudio,
        ForwardedIndicator,
        MessageText,
        MessagePhoto,
        MessageSticker,
        MessageVideo,
        MessageDocument,
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
            required: false
        },
        previousMsg: {
            type: Object,
            required: false
        }
    },
    computed: {
        ...mapState(['activeChat']),

        showTail () {
            return !this.previousMsg || !this.msg.senderObj || !this.previousMsg.senderObj || (this.previousMsg.isSticker && !this.msg.isSticker) || this.msg.senderObj.id !== this.previousMsg.senderObj.id;
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

.identify-msg-group {
    font-size: 12px;
    font-weight: 500;
    background-color: white;
    border-radius: 0 7.5px 7.5px 7.5px;
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

.tail {
    border-top-left-radius: 0;
}

.tail-container {
    position: absolute;
    left: -12px;
    min-width: 12px;
    min-height: 19px;
    max-width: 12px;
    max-height: 19px;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: contain;
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAmCAMAAADp2asXAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACQUExURUxpccPDw9ra2m9vbwAAAAAAADExMf///wAAABoaGk9PT7q6uqurqwsLCycnJz4+PtDQ0JycnIyMjPf3915eXvz8/E9PT/39/RMTE4CAgAAAAJqamv////////r6+u/v7yUlJeXl5f///5ycnOXl5XNzc/Hx8f///xUVFf///+zs7P///+bm5gAAAM7Ozv///2fVensAAAAvdFJOUwCow1cBCCnqAhNAnY0WIDW2f2/hSeo99g1lBYT87vDXG8/6d8oL4sgM5szrkgl660OiZwAAAHRJREFUKM/ty7cSggAABNFVUQFzwizmjPz/39k4YuFWtm55bw7eHR6ny63+alnswT3/rIDzUSC7CrAziPYCJCsB+gbVkgDtVIDh+DsE9OTBpCtAbSBAZSEQNgWIygJ0RgJMDWYNAdYbAeKtAHODlkHIv997AkLqIVOXVU84AAAAAElFTkSuQmCC");
}
</style>
