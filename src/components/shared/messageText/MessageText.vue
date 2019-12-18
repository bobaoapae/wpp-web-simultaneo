<template>
   <div class="text-container">

      <div class="message-text">
         <span v-html="msgFormated"></span>
      </div>

      <MessageTime :msg="msg"/>

   </div>
</template>

<script>
import MessageTime from '../messageTime/MessageTime';

import { msg } from '@/helper.js';

export default {
    name: 'MessageText',
    components: {
        MessageTime
    },
    props: {
        msg: {
            type: Object,
            required: true
        }
    },
    computed: {
        msgFormated () {
            return msg.processNativeEmojiToImage(msg.formatMsg(this.msg.body));
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
