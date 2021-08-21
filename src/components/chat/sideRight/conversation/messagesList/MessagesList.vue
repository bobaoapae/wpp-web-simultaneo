<template>
    <div class="messages-list" @scroll="handleMessageListChange" @mousewheel="handleMessageListChange"
         @touchmove="handleMessageListChange"
         ref="messageList">
        <LoadingEarlyMsg v-show="activeChat.loadingEarly"/>
        <div :id="encodedMsgId(item)" :key="encodedMsgId(item)" @dblclick.left.prevent="handleDoubleClick(item)"
             v-for="(item, index) in msgs" v-for-callback="{key: index, array: msgs, callback: handleLoadMsgFinish}">
            <MessageDateFormatted :formattedDate="item.fomattedDate"
                                  v-if="!msgs[index+1] || msgs[index+1].fomattedDate !== item.fomattedDate"/>
            <MessageInfo :msg="item" v-if="isNotification(item.type)"/>
            <MessageContainer :msg="item" :previousMsg="msgs[index+1]" v-else/>
        </div>
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import { mapState } from 'vuex';

const MessageContainer = defineAsyncComponent(() => import('@/components/shared/messageContainer/MessageContainer.vue'));
const MessageInfo = defineAsyncComponent(() => import('@/components/shared/messageInfo/MessageInfo.vue'));
const MessageDateFormatted = defineAsyncComponent(() => import('@/components/shared/messageDateFormatted/MessageDateFormatted.vue'));
const LoadingEarlyMsg = defineAsyncComponent(() => import('@/components/shared/loadingEarlyMsg/LoadingEarlyMsg.vue'));

export default {
    name: 'MessagesList',
    components: {
        MessageContainer,
        MessageInfo,
        MessageDateFormatted,
        LoadingEarlyMsg
    },
    mounted () {
        if (!this.resizeObserver) {
            this.resizeObserver = new ResizeObserver(() => {
                if (this.isInBottom()) {
                    this.scrollToBottom();
                }
            }).observe(this.$refs.messageList);
        }
        this.$nextTick(() => {
            this.scrollToBottom();
            if (!this.activeChat.noEarlierMsgs && this.activeChat.msgsParted.length <= 10) {
                this.handleLoadEarly().then((val) => {
                    if (val) {
                        this.scrollToBottom();
                    }
                });
            }
        });
    },
    data () {
        return {
            msgsLoaded: false,
            resizeObserver: null
        };
    },
    computed: {
        ...mapState(['visible', 'idle', 'activeChat']),
        msgs () {
            let msgs = this.activeChat.msgsParted;
            return msgs.reverse();
        },

        active () {
            return this.visible && !this.idle;
        }
    },
    watch: {
        'activeChat.id': function () {
            this.activeChat.__x_msgsIndex = 1;
            this.$nextTick(() => {
                this.scrollToBottom();
            });
            if (!this.activeChat.noEarlierMsgs && this.activeChat.msgsParted.length <= 10) {
                this.handleLoadEarly().then((val) => {
                    if (val) {
                        this.scrollToBottom();
                    }
                });
            }
        },
        'activeChat.lastMsg.id._serialized': function (val) {
            if (val && !this.activeChat.loadingEarly && this.visible && (this.activeChat.lastMsg.id.fromMe || this.isInBottom())) {
                this.scrollToBottom();
            }
        },
        'active': function (val) {
            if (val && this.isInBottom()) {
                this.activeChat.seeChat();
            }
        },
        'msgs': function () {
            this.handleMessageListChange();
        }
    },
    methods: {
        isNotification (type) {
            if (type === 'gp2') {
                return true;
            } else if (type === 'e2e_notification') {
                return true;
            }
            return false;
        },

        encodedMsgId (msg) {
            return msg.id._serialized.replace(/[^\w\s]/gi, '').replace(/[_]/gi, '');
        },

        handleDoubleClick (msg) {
            if (!this.isNotification(msg)) {
                this.activeChat.quotedMsg = msg;
            }
        },

        handleMessageListChange (e) {
            let props = {
                scrollHeight: this.$el.scrollHeight,
                scrollTop: this.$el.scrollTop,
                clientHeight: this.$el.clientHeight,
            };
            this.scrollHeight = props.scrollHeight;
            this.scrollTop = props.scrollTop;
            this.clientHeight = props.clientHeight;
            if (e && this.activeChat.loadingEarly) {
                e.preventDefault();
            } else if (!this.activeChat.loadingEarly && !this.activeChat.noEarlierMsgs && props.scrollHeight + props.scrollTop <= props.clientHeight + 300) {
                this.handleLoadEarly();
            } else if (this.active && this.isInBottom() && this.activeChat.isUnread) {
                this.activeChat.seeChat();
            }
        },

        async handleLoadEarly () {
            if (!this.activeChat.loadingEarly) {
                this.activeChat.loadingEarly = true;
                try {
                    await this.activeChat.loadEarly();
                } catch (e) {
                    console.error('LoadEarly Error::', e);
                }
                this.activeChat.loadingEarly = false;
                return true;
            }
            return Promise.resolve(false);
        },

        handleLoadMsgFinish () {
            if (!this.msgsLoaded) {
                this.msgsLoaded = true;
                this.scrollToBottom();
            }
        },

        scrollToBottom () {
            console.log('scrollToBottom');
            this.$nextTick(() => {
                this.$el.scrollTop = 0;
            });
        },

        isInBottom () {
            return this.$el.scrollTop <= 15;
        }
    },
    directives: {
        forCallback (el, binding) {
            let element = binding.value;
            let key = element.key;
            let len = 0;

            if (Array.isArray(element.array)) {
                len = element.array.length;
            } else if (typeof element.array === 'object') {
                let keys = Object.keys(element.array);
                key = keys.indexOf(key);
                len = keys.length;
            }

            if (key === len - 1) {
                if (typeof element.callback === 'function') {
                    window.setTimeout(() => {
                        element.callback();
                    }, 40);
                }
            }
        }
    }
};
</script>

<style scoped>
.messages-list {
    user-select: none;
    padding: 10px 0;
    flex: 1;
    background-image: url("../../../../../assets/images/bg-chat.png");
    overflow: scroll;
    overflow-x: hidden;
    display: flex;
    flex-direction: column-reverse;
}
</style>
