<template>
    <div :class="{unread : chat.isUnread}" class="last-msg flex-grow-1 d-flex align-items-center" v-if="chat.lastMsg">
        <MessageIconStatus :ack="chat.lastMsg.ack" class="icon-status" v-if="chat.lastMsg.id.fromMe"/>

        <span :inner-html.prop="`${chat.lastMsg.senderObj.formattedName}: ` | emojify"
              v-if="chat.isGroup && chat.lastMsg && chat.lastMsg.senderObj && !chat.lastMsg.id.fromMe"></span>

        <MessageBody :lastMsg="chat.lastMsg"/>
    </div>
</template>

<script>

import MessageBody from './messageBody/MessageBody.vue';
import MessageIconStatus from '@/components/shared/messageIconStatus/MessageIconStatus.vue';

export default {
    name: 'LastMsg',
    components: {
        MessageIconStatus,
        MessageBody
    },
    props: {
        chat: {
            type: Object,
            required: true
        }
    },
    data () {
        return {};
    },
    created () {

    },
    watch: {}
};
</script>

<style scoped>
.last-msg {
    overflow: hidden;
}

.last-msg span {
    color: rgba(0, 0, 0, 0.4);
    font-size: 14px;
    white-space: nowrap;
    margin-right: 3px;
}

img {
    width: 20px;
}

.icon-status {
    margin-right: 3px;
}

.unread span {
    color: rgba(0, 0, 0, 0.8) !important;
    font-weight: 500 !important;
}
</style>
