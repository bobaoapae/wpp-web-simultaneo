<template>
    <div :class="{unread : chat.isUnread}" class="last-msg flex-grow-1 d-flex align-items-center">
        <template v-if="lastMsg">
            <MessageIconStatus :ack="lastMsg.ack" class="icon-status" v-if="lastMsg.id.fromMe"/>

            <span v-html="`${formattedName}: `"
                  v-if="chat.isGroup && !lastMsg.id.fromMe"></span>

            <MessageBody :lastMsg="lastMsg"/>
        </template>
    </div>
</template>

<script>
import filters from '@/filters';
import { asyncComputed } from '@/AsyncComputed';
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
    setup (props) {
        const formattedName = asyncComputed(async () => {
            let senderObj = await props.chat.lastMsg.senderObj();
            let name = senderObj.formattedName || senderObj.verifiedName || senderObj.pushname;
            return filters.emojify(name);
        }, { default: '', lazy: true });

        return {
            formattedName
        };
    },
    computed: {
        lastMsg () {
            return this.chat.lastMsg;
        }
    },
    methods: {
        async loadFormattedName () {
            let senderObj = await this.chat.lastMsg.senderObj();
            this.formattedNameLastMsg = filters.emojify(senderObj.formattedName);
        }
    }
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
