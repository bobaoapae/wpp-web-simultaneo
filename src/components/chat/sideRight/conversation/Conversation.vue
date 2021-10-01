<template>
    <div tabindex="0" class="conversation" @keydown="handleKeyDown">
        <ConversationHeader class="conversation-header"/>

        <MessagesList class="messages-list"/>

        <InputMessage ref="inputMessage" class="input-message"/>
    </div>
</template>

<script>
import { defineAsyncComponent } from 'vue';
import ConversationHeader from './conversationHeader/ConversationHeader.vue';
import MessagesList from './messagesList/MessagesList.vue';

const InputMessage = defineAsyncComponent(() => import('./inputMessage/InputMessage.vue'));

export default {
    name: 'Conversation',
    components: {
        MessagesList,
        InputMessage,
        ConversationHeader
    },
    methods: {
        handleKeyDown (evt) {
            this.$refs.inputMessage.focusInput(evt);
        }
    }
};
</script>

<style scoped>
.conversation {
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    outline: none;
}

.conversation-header {
    display: flex;
    flex-grow: 1;
    height: 63px;
    max-height: 63px;
}

.messages-list {
    display: flex;
    flex-grow: 200;
}

.input-message {
    display: flex;
    flex-grow: 1;
}
</style>
