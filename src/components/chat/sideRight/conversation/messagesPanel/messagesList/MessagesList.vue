<template>
    <div class="messages-list">
        <div :id="encodedMsgId(item)" :key="encodedMsgId(item)" @dblclick.left.prevent="handleDoubleClick(item)"
             v-for="(item, index) in msgs">
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
import { mapState } from 'vuex';

export default {
    name: 'MessagesList',
    components: {
        MessageContainer,
        MessageInfo,
        MessageDateFormatted
    },
    props: {
        msgs: {
            type: Array,
            required: true
        }
    },
    computed: {
        ...mapState(['activeChat'])
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
            console.log('double click');
            if (!this.isNotification(msg)) {
                this.activeChat.quotedMsg = msg;
            }
        }
    }
};
</script>

<style scoped>
.messages-list {
    user-select: none;
}
</style>
