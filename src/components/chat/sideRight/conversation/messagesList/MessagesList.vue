<template>
    <div class="messages-list" @scroll="handleScroll" @mousewheel="handleScroll" @touchmove="handleScroll"
         ref="messageList">
        <LoadingEarlyMsg v-show="loadingEarly"/>
        <div :id="encodedMsgId(item)" :key="encodedMsgId(item)" @dblclick.left.prevent="handleDoubleClick(item)"
             v-for="(item, index) in msgs" v-for-callback="{key: index, array: msgs, callback: handleLoadMsgFinish}">
            <MessageDateFormatted :formattedDate="item.fomattedDate"
                                  v-if="!msgs[index-1] || msgs[index-1].fomattedDate !== item.fomattedDate"/>
            <MessageInfo :msg="item" v-if="isNotification(item.type)"/>
            <MessageContainer :msg="item" :previousMsg="msgs[index-1]" v-else/>
        </div>
    </div>
</template>

<script>
import MessageContainer from '@/components/shared/messageContainer/MessageContainer.vue';
import MessageInfo from '@/components/shared/messageInfo/MessageInfo.vue';
import MessageDateFormatted from '@/components/shared/messageDateFormatted/MessageDateFormatted.vue';
import LoadingEarlyMsg from '@/components/shared/loadingEarlyMsg/LoadingEarlyMsg';
import { mapState } from 'vuex';

export default {
    name: 'MessagesList',
    components: {
        MessageContainer,
        MessageInfo,
        MessageDateFormatted,
        LoadingEarlyMsg
    },
    props: {
        chat: {
            type: Object,
            required: true
        }
    },
    mounted () {
        this.$root.$on('startOpenEmoji', () => {
            if (this.isInBottom()) {
                this.isBottomWhenOpening = true;
                this.intervalBottom = setInterval(() => {
                    this.scrollToBottom();
                }, 10);
            } else {
                this.isBottomWhenOpening = false;
            }
        });
        this.$root.$on('finishOpenEmoji', () => {
            if (this.isBottomWhenOpening) {
                this.scrollToBottom();
            }
            clearInterval(this.intervalBottom);
        });
        this.$root.$on('startCloseEmoji', () => {
            if (this.isInBottom()) {
                this.isBottomWhenClosing = true;
                this.intervalBottom = setInterval(this.scrollToBottom, 10);
            } else {
                this.isBottomWhenClosing = false;
            }
        });
        this.$root.$on('finishCloseEmoji', () => {
            if (this.isBottomWhenClosing) {
                this.scrollToBottom();
            }
            clearInterval(this.intervalBottom);
        });
        this.clientHeight = this.$el.clientHeight;
        this.scrollTop = this.$el.scrollTop;
        this.scrollHeight = this.$el.scrollHeight;
        if (!this.resizeObserver) {
            this.resizeObserver = new ResizeObserver(() => {
                let isInBotton = this.scrollHeight - this.scrollTop <= this.clientHeight + 15;
                this.clientHeight = this.$el.clientHeight;
                this.scrollTop = this.$el.scrollTop;
                this.scrollHeight = this.$el.scrollHeight;
                if (isInBotton) {
                    this.scrollToBottom();
                }
            }).observe(this.$refs.messageList);
        }
        this.$nextTick(() => {
            this.scrollToBottom();
            if (!this.chat.noEarlierMsgs && this.chat.msgsParted.length <= 10) {
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
            loadingEarly: false,
            msgsLoaded: false,
            resizeObeserver: null,
            clientHeight: -1,
            scrollTop: -1,
            scrollHeight: -1,
            calc: -1,
            isBottomWhenOpening: false,
            isBottomWhenClosing: false
        };
    },
    computed: {
        ...mapState(['visible', 'idle']),
        msgs () {
            return this.chat.msgsParted;
        },

        active () {
            return this.visible && !this.idle;
        }
    },
    watch: {
        'chat.id': function () {
            this.chat.__x_msgsIndex = 1;
            this.$nextTick(() => {
                this.scrollToBottom();
            });
            if (!this.chat.noEarlierMsgs && this.chat.msgsParted.length <= 10) {
                this.handleLoadEarly().then((val) => {
                    if (val) {
                        this.scrollToBottom();
                    }
                });
            }
        },
        'chat.lastMsg.id._serialized': function (val) {
            if (val && !this.loadingEarly && this.visible && (this.chat.lastMsg.id.fromMe || this.isInBottom())) {
                this.scrollToBottom();
            }
        },
        'active': function (val) {
            if (val && this.isInBottom()) {
                this.chat.seeChat();
            }
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
                this.chat.quotedMsg = msg;
            }
        },

        scrollToBottom () {
            this.$nextTick(() => {
                this.$el.scrollTop = this.$el.scrollHeight - this.$el.clientHeight;
            });
        },

        handleScroll (e) {
            let props = {
                scrollHeight: this.$el.scrollHeight,
                scrollTop: this.$el.scrollTop,
                clientHeight: this.$el.clientHeight,
                calc: this.$el.scrollHeight - (this.$el.scrollHeight - this.$el.scrollTop)
            };
            this.scrollHeight = props.scrollHeight;
            this.scrollTop = props.scrollTop;
            this.clientHeight = props.clientHeight;
            if (this.loadingEarly) {
                e.preventDefault();
            } else if (!this.loadingEarly && !this.chat.noEarlierMsgs && ((props.scrollHeight > 1050 && props.calc <= 1050) || props.scrollTop === 0)) {
                this.handleLoadEarly();
            } else if (this.active && this.isInBottom() && this.chat.isUnread) {
                this.chat.seeChat();
            }
        },

        async handleLoadEarly () {
            if (!this.loadingEarly) {
                this.loadingEarly = true;
                await this.chat.loadEarly();
                this.loadingEarly = false;
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

        isInBottom () {
            return this.$el.scrollHeight - this.$el.scrollTop <= this.$el.clientHeight + 15;
        },

        handleKeyDown (evt) {
            this.$emit('keyDown', evt);
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
}
</style>
