<template>
    <div tabindex="0" id="conversation" @keydown="handleKeyDown">
        <ConversationHeader/>

        <MessagesList :chat="activeChat"/>

        <InputMessage/>
    </div>
</template>

<script>
import ConversationHeader from './conversationHeader/ConversationHeader.vue';
import InputMessage from './inputMessage/InputMessage';
import MessagesList from './messagesList/MessagesList';
import { mapState } from 'vuex';

export default {
    name: 'Conversation',
    components: {
        MessagesList,
        InputMessage,
        ConversationHeader
    },
    computed: {
        ...mapState(['activeChat'])
    },
    methods: {
        handleKeyDown (evt) {
            this.$root.$emit('keyDown', evt);
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
