<template>
    <div tabindex="0" id="conversation" @keydown="handleKeyDown">
        <ConversationHeader/>

        <MessagesList/>

        <InputMessage/>
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
        handleKeyDown () {
            //TODO: focus input on keydown
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
