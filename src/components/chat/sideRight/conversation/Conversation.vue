<template>
   <div id="conversation">
      <ConversationHeader/>

      <MessagesPanel/>

      <InputMessage/>
   </div>
</template>

<script>
import ConversationHeader from './conversationHeader/ConversationHeader.vue';
import MessagesPanel from './messagesPanel/MessagesPanel.vue';
import InputMessage from './inputMessage/InputMessage';

export default {
  name: 'Conversation',
  components: {
    InputMessage,
    ConversationHeader,
    MessagesPanel
  }
};
</script>

<style scoped>
   #conversation {
      height: 100%;
      background: #fff;
      display: flex;
      flex-direction: column;
   }
</style>
