<template>
    <div tabindex="0" id="conversation" @keydown="handleKeyDown">
        <ConversationHeader/>

        <MessagesList/>

        <InputMessage/>
    </div>
</template>

<script>
import ConversationHeader from './conversationHeader/ConversationHeader.vue';
import InputMessage from './inputMessage/InputMessage';
import MessagesList from './messagesList/MessagesList';

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
