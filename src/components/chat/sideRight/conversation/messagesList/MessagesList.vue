<template>
    <div class="messages-list" @scroll="handleScroll">
        <div :id="encodedMsgId(item)" :key="encodedMsgId(item)" @dblclick.left.prevent="handleDoubleClick(item)"
             v-for="(item, index) in reverseMsgs">
            <MessageDateFormatted :formattedDate="item.fomattedDate"
                                  v-if="!reverseMsgs[index+1] || reverseMsgs[index+1].fomattedDate !== item.fomattedDate"/>
            <MessageInfo :msg="item" v-if="isNotification(item.type)"/>
            <MessageContainer :msg="item" :previousMsg="reverseMsgs[index+1]" v-else/>
        </div>
        <LoadingEarlyMsg v-show="loadingEarly"/>
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
    data () {
        return {
            loadingEarly: false,
            msgsLoaded: false
        };
    },
    computed: {
        ...mapState(['visible']),
        reverseMsgs () {
            return this.chat.msgs.slice().reverse();
        }
    },
    watch: {
        'chat.id': function () {
            this.$nextTick(() => {
                this.scrollToBottom();
            });
            if (!this.chat.noEarlierMsgs && this.chat.msgs.length <= 10) {
                this.handleLoadEarly();
            }
        },
        'chat.lastMsg': function (val) {
            if (!this.loadingEarly && this.visible && (val.id.fromMe || this.isInBottom())) {
                this.scrollToBottom();
            } else if (this.visible && this.isInBottom()) {
                this.chat.seeChat();
            }
        },
        'visible': function (val) {
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
                this.$el.scrollTop = Number.MAX_SAFE_INTEGER;
            });
        },

        handleScroll (e) {
            if (this.$el.scrollTop === 0 && !this.chat.noEarlierMsgs) {
                this.handleLoadEarly();
            } else if (this.isInBottom() && this.chat.isUnread) {
                this.chat.seeChat();
            }
        },

        handleLoadEarly () {
            this.loadingEarly = true;
            this.chat.loadEarly().then(() => {
                this.loadingEarly = false;
            });
        },

        handleLoadMsgFinish () {
            if (!this.msgsLoaded) {
                this.msgsLoaded = true;
                this.scrollToBottom();
            }
        },

        isInBottom () {
            return this.$el.scrollHeight - this.$el.scrollTop <= this.$el.clientHeight + 15;
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
                    element.callback();
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
