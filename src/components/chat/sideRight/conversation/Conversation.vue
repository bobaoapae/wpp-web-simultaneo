<template>
    <div tabindex="0" id="conversation" @keydown="handleKeyDown">
        <ConversationHeader/>

        <MessagesList/>

        <InputMessage ref="inputMessage"/>
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
#conversation {
    height: 100%;
    background: #fff;
    display: flex;
    flex-direction: column;
    outline: none;
}
</style>
