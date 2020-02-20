<template>
   <div class="message-container" :class="{'message-in' : !msg.id.fromMe, 'message-out': msg.id.fromMe}">
      <div v-b-hover="handleHover" class="message-body" :class="showTail ? 'tail' : ''">
         <div v-if="showTail" class="tail-container"></div>
         <div
            :class="{'same-color' : msg.isSameColor}"
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
                  <img src="@/assets/images/wpp-message-arrow-down.svg">
               </template>

               <b-dropdown-item @click="handleClickAnswer">Responder</b-dropdown-item>
               <b-dropdown-item @click="handleClickDelete">Apagar mensagem</b-dropdown-item>
            </b-dropdown>
         </div>

         <!-- Identificador de mensagens no grupo -->
         <div class="identify-msg-group pb-0 pt-2 pl-2 pr-2" v-if="activeChat.isGroup && !msg.id.fromMe && showTail">
            <div v-if="msg.senderObj.name" class="btn-link" :style="{color: activeChat.getColor(msg.senderObj.id)}" @click="handleClick">
               {{msg.senderObj.name | emojify}}
            </div>

            <div class="d-flex justify-content-between" v-else>
               <span class="btn-link number" :style="{color: activeChat.getColor(msg.senderObj.id)}" @click="handleClick">{{msg.senderObj.formattedName | emojify}}</span>
               <span class="name">~{{msg.senderObj.pushname}}</span>
            </div>
         </div>

         <!-- Mensagem Encaminhada -->
         <ForwardedIndicator v-if="msg.isForwarded"/>

         <QuotedMsg :quotedMsg="msg.quotedMsgObject" v-if="msg.hasQuotedMsg"/>

         <MessageText :msg="msg" v-if="msg.isChat"/>
         <MessagePhoto :msg="msg" v-else-if="msg.isImage"/>
         <MessageSticker :msg="msg" v-else-if="msg.isSticker"/>
         <MessageGif :msg="msg" v-else-if="msg.isGif"/>
         <MessageVideo :msg="msg" v-else-if="msg.isVideo"/>
         <MessageDocument :msg="msg" v-else-if="msg.isDocument"/>
         <MessageAudio :msg="msg" v-else-if="msg.isAudio || msg.isPtt"/>
         <MessageRevoked :msg="msg" v-else-if="msg.isRevoked"/>
         <MessageLocation :msg="msg" v-else-if="msg.isLocation"/>
         <MessageContact :msg="msg" v-else-if="msg.isVcard"/>
      </div>
   </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import MessageText from '@/components/shared/messageText/MessageText.vue';
import MessagePhoto from '@/components/shared/messagePhoto/MessagePhoto.vue';
import MessageSticker from '@/components/shared/messageSticker/MessageSticker.vue';
import MessageVideo from '@/components/shared/messageVideo/MessageVideo.vue';
import MessageGif from '@/components/shared/messageGif/MessageGif.vue';
import MessageDocument from '@/components/shared/messageDocument/MessageDocument';
import ForwardedIndicator from '@/components/shared/forwardedIndicator/ForwardedIndicator';
import MessageAudio from '@/components/shared/messageAudio/MessageAudio';
import QuotedMsg from '../quotedMsg/QuotedMsg';
import MessageRevoked from '../messageRevoked/MessageRevoked';
import MessageLocation from '../messageLocation/MessageLocation';
import MessageContact from '../messageContact/MessageContact';

export default {
    name: 'MessageContainer',
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
        MessageContact,
        MessageGif
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
            return !this.previousMsg || !this.msg.senderObj || !this.previousMsg.senderObj || (this.previousMsg.isSticker && !this.msg.isSticker) || this.msg.senderObj.id !== this.previousMsg.senderObj.id;
        }
    },
    methods: {
        ...mapMutations(['SET_ACTIVE_CHAT']),
        ...mapActions(['findChatFromId']),

        handleHover (isHover) {
            this.showMenuIcon = isHover;
        },

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
            this.$root.$emit('showModalDeleteMsg', this.msg);
        },

        handleClick () {
            this.findChatFromId({ id: this.msg.senderObj.id }).then(chat => {
                this.SET_ACTIVE_CHAT(chat);
            });

            this.$root.$emit('showNewChat', false);
        }
    }
};
</script>

<style scoped>
.msg-menu {
    position: absolute;
    right: 3px;
    border-top-right-radius: 5px;
    display: block;
    text-align: right;
    height: 25px;
    z-index: 1;
}

.msg-menu img{
    vertical-align: top;
    top: -3px;
    position: relative;
}

.msg-menu.same-color img{
    filter: brightness(0.55);
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

.message-container {
    padding: 0 9%;
    margin-bottom: 2.5px;
    display: flex;
    user-select: none;
}

.message-container.message-in {
    max-width: 65%;
}

.message-container.message-in {
    justify-content: flex-start;
}

.message-container.message-out {
    justify-content: flex-end;
}

.message-body {
    box-shadow: 0 1px 0.5px rgba(0, 0, 0, .13);
    position: relative;
    border-radius: 7.5px;
}

.message-in .message-body{
    background-color: #fff;
}

.message-out .message-body{
    background-color: #DCF8C6;
}

.tail {
    margin-top: 12px;
}

.message-in .tail {
    border-top-left-radius: 0;
}

.message-out .tail {
    border-top-right-radius: 0;
}

.tail-container {
    position: absolute;
    min-width: 12px;
    min-height: 19px;
    max-width: 12px;
    max-height: 19px;
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: contain;
}

.message-in .tail-container {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAmCAMAAADp2asXAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAACQUExURUxpccPDw9ra2m9vbwAAAAAAADExMf///wAAABoaGk9PT7q6uqurqwsLCycnJz4+PtDQ0JycnIyMjPf3915eXvz8/E9PT/39/RMTE4CAgAAAAJqamv////////r6+u/v7yUlJeXl5f///5ycnOXl5XNzc/Hx8f///xUVFf///+zs7P///+bm5gAAAM7Ozv///2fVensAAAAvdFJOUwCow1cBCCnqAhNAnY0WIDW2f2/hSeo99g1lBYT87vDXG8/6d8oL4sgM5szrkgl660OiZwAAAHRJREFUKM/ty7cSggAABNFVUQFzwizmjPz/39k4YuFWtm55bw7eHR6ny63+alnswT3/rIDzUSC7CrAziPYCJCsB+gbVkgDtVIDh+DsE9OTBpCtAbSBAZSEQNgWIygJ0RgJMDWYNAdYbAeKtAHODlkHIv997AkLqIVOXVU84AAAAAElFTkSuQmCC");
    left: -12px;
}

.message-out .tail-container {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAmCAMAAADp2asXAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAADAUExURUxpcXmHa4maet/4yA0aDRMTE8fhsgAAAAAAAMDXrCsxJeX/z1xzXIiYetPsvGBsVUdPPuH8zOH8zNDrvMvmtrrOpwAAAAAAABUVFRoaGtnyxLTMozQ+MMfftFBeSR8nH5aoh6q/mW9+ZN/4yMjhtRwlHAAAAIOWd+r/06C1kkNLOwsLC9z4xur/0+n/0t76x9v4xeL9y+b/z+j/0d/7yeH8yuX/zeD8ytz5xt76yOP/zeH+y+b/zuD8yd35xuf/0MY9jkkAAAAsdFJOUwBvd/ATDZIBAsMp/At/11c9yPbizHoICQwT4bY1ykkgjahl6s8bBYT6nUAWOLbtFAAAAIhJREFUKM/tzbUWwlAURNFBE9zdg0NecLf//yvKUJyUdDnl7HXXletXqmXl9wPbQ9JCcC+VJsOj2mDwovzj3osjHGNFEVxNRAj7UR1hlx+I4FbuC8HkZBE8OwnRxamdFsEmUxCCGdoI51RLBK9xVwTvjyMEbzlDMJMp7lqseNc8YNc6CGyF/a0vcmwhZbCG+kEAAAAASUVORK5CYII=");
    right: -12px;
}
</style>
