<template>
    <div :class="{'message-in' : !msg.id.fromMe, 'message-out': msg.id.fromMe, 'blink' : msg.blink}"
         class="message-container" @click="handleClickMessageContainer">
        <div class="message-row">
            <div class="select-msg-container" v-if="showSelectMsgs">
                <div class="select-msg" :class="{'selected' : isMsgSelected}">
                    <div class="select-msg-check"></div>
                </div>
            </div>
            <div :class="showTail ? 'tail' : ''" class="message-body" v-b-hover="handleHover">
                <div class="tail-container" v-if="showTail"></div>
                <div
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
                        <b-dropdown-item @click="handleClickForward">Encaminhar</b-dropdown-item>
                        <b-dropdown-item @click="handleClickDelete"
                                         v-if="user.canCreateOperator || user.superConfiguracao.operadorPodeExcluirMsg">
                            Apagar mensagem
                        </b-dropdown-item>
                    </b-dropdown>
                </div>

                <!-- Identificador de mensagens no grupo -->
                <div class="identify-msg-group pb-0 pt-2 pl-2 pr-2"
                     v-if="activeChat.isGroup && !msg.id.fromMe && showTail">
                    <div :style="{color: colorMsgGroup}" @click="handleClick" class="btn-link"
                         v-if="name">
                        {{name | emojify}}
                    </div>

                    <div class="d-flex justify-content-between" v-else>
                    <span :style="{color: colorMsgGroup}" @click="handleClick"
                          class="btn-link number">{{formattedName | emojify}}</span>
                        <span class="name">~{{pushName}}</span>
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
import randomColor from 'random-color';

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
    mounted () {
        this.$root.$on('keyDown', (evt) => {
            if (this.showSelectMsgs) {
                evt.preventDefault();
                if (evt.key === 'Escape') {
                    this.SET_SELECT_MSGS({ show: false });
                }
            }
        });
    },
    watch: {
        'activeChat.quotedMsg': function (val) {
            if (val === this.msg) {
                this.msg.blink = true;
                setTimeout(() => {
                    this.msg.blink = false;
                }, 1500);
            }
        },

        'activeChat': function () {
            this.SET_SELECT_MSGS({ show: false });
        },

        'selectMsgs.msg': function (msg) {
            let selectThisMsg = msg === this.msg;
            if (selectThisMsg) {
                console.log('select this msg::', msg);
            }
        }
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
        ...mapState(['activeChat', 'user', 'selectMsgs']),

        showSelectMsgs () {
            return this.selectMsgs && this.selectMsgs.show;
        },

        isMsgSelected () {
            return this.selectMsgs.msgs.includes(this.msg);
        }
    },
    asyncComputed: {
        colorMsgGroup: {
            async get () {
                if (this.activeChat.isGroup) {
                    let senderObj = await this.msg.senderObj();
                    return this.activeChat.getColor(senderObj.id);
                }
                return false;
            },
            default () {
                return randomColor().hexString();
            }
        },
        name: {
            async get () {
                let senderObj = await this.msg.senderObj();
                return senderObj.name;
            },
            default () {
                return '';
            }
        },
        pushName: {
            async get () {
                let senderObj = await this.msg.senderObj();
                return senderObj.pushname;
            },
            default () {
                return '';
            }
        },
        formattedName: {
            async get () {
                let senderObj = await this.msg.senderObj();
                return senderObj.formattedName;
            },
            default () {
                return '';
            }
        },
        showTail: {
            async get () {
                let senderObj = await this.msg.senderObj();
                let previousMsgSenderObj = this.previousMsg ? await this.previousMsg.senderObj() : false;
                return !this.previousMsg || !senderObj || !previousMsgSenderObj || (this.previousMsg.isSticker && !this.msg.isSticker) || senderObj.id !== previousMsgSenderObj.id || this.msg.hasQuotedMsg || this.msg.isSticker || this.msg.fomattedDate !== this.previousMsg.fomattedDate;
            },
            default () {
                return false;
            }
        }
    },
    methods: {
        ...mapMutations(['SET_ACTIVE_CHAT', 'SET_SELECT_MSGS', 'TOGGLE_SELECT_MSG']),
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

        handleClickForward (evt) {
            this.SET_SELECT_MSGS({ show: true });
        },

        handleClickDelete () {
            this.$root.$emit('showModalDeleteMsg', this.msg);
        },

        handleClick () {
            this.findChatFromId({ id: this.msg.senderObj.id }).then(chat => {
                this.SET_ACTIVE_CHAT(chat);
            });

            this.$root.$emit('showNewChat', false);
        },

        handleClickMessageContainer () {
            if (this.selectMsgs.show) {
                this.TOGGLE_SELECT_MSG({ msg: this.msg });
            }
        }
    }
};
</script>

<style scoped>
.message-row {
    display: flex;
    align-items: center;
}

.message-out .message-row {
    flex-direction: row-reverse;
}

.msg-menu {
    position: absolute;
    right: 3px;
    border-top-right-radius: 5px;
    display: block;
    text-align: right;
    height: 18px;
    top: 2px;
    width: 18px;
    z-index: 1;
}

.msg-menu img {
    vertical-align: top;
    top: -3px;
    position: relative;
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

.message-in .message-body {
    background-color: #fff;
}

.message-out .message-body {
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

.message-out.blink .message-body, .message-out.blink >>> .time {
    animation-name: blink-out;
    animation-duration: 1500ms;
    animation-timing-function: ease-in-out;
    animation-direction: reverse;
    animation-play-state: running;
}

.message-in.blink .message-body, .message-in.blink .identify-msg-group, .message-in.blink >>> .time {
    animation-name: blink-in;
    animation-duration: 1500ms;
    animation-timing-function: ease-in-out;
    animation-direction: reverse;
    animation-play-state: running;
}

.blink .tail-container {
    animation-name: blink-tail;
    animation-duration: 1500ms;
    animation-timing-function: ease-in-out;
    animation-direction: reverse;
    animation-play-state: running;
}

.select-msg-container {
    cursor: pointer;
    display: inline-block;
    height: 18px;
    transform: translateZ(0);
    vertical-align: middle;
    width: 18px;
}

.message-in .select-msg-container {
    margin-right: 10px;
}

.message-out .select-msg-container {
    margin-left: 10px;
}

.select-msg {
    background-color: initial;
    border-radius: 2px;
    border: 2px solid rgba(74, 74, 74, .75);
    box-sizing: border-box;
    height: 100%;
    pointer-events: none;
    transition: background-color .14s, border-color .14s;
}

.select-msg.selected {
    background-color: #00bfa5;
    border-color: #00bfa5;
}

.select-msg-check {
    opacity: 0;
    border-bottom: 2px solid var(--white);
    border-right: 2px solid var(--white);
    position: relative;
    height: 11px;
    width: 6px;
    left: 5px;
    transform: rotate(45deg);
    animation: _28R-H .16s ease-out forwards;
}

.selected .select-msg-check {
    opacity: 1;
}

@keyframes blink-out {
    from {
        background-color: #DCF8C6;
    }
    to {
        background-color: rgb(179, 203, 161);
    }
}

@keyframes blink-in {
    from {
        background-color: #fff;
    }
    to {
        background-color: rgb(204, 204, 204);
    }
}

@keyframes blink-tail {
    from {
        filter: brightness(1);
    }
    to {
        filter: brightness(0.8);
    }
}

@keyframes _28R-H {
    0% {
        left: 2px;
        width: 0;
        height: 0
    }

    to {
        height: 11px;
        width: 6px;
        left: 5px;
    }
}
</style>
