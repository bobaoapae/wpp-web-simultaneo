<template>
   <div class="text-container">
      <div class="message-text">
         <Thumbnail v-if="msg.matchedText" :msg="msg"/>

         <span :inner-html.prop="msg.body | formatMsg | emojify"></span>
      </div>

      <MessageTime :msg="msg"/>

   </div>
</template>

<script>
import MessageTime from '../messageTime/MessageTime';
import Thumbnail from '../thumbnail/Thumbnail';

export default {
    name: 'MessageText',
    components: {
        MessageTime,
        Thumbnail
    },
    props: {
        msg: {
            type: Object,
            required: true
        }
    }
};
</script>

<style scoped>
   .text-container {
      min-width: 100px;
      max-width: 500px;
   }

   .message-text {
      padding: 6px 7px 8px 9px;
   }

   .message-text span {
      margin-right: 55px;
      white-space: pre-wrap;
      word-wrap: break-word;
      color: #262626;
      font-size: 14.2px;
   }
</style>
