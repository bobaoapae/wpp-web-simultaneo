<template>
   <div class="quoted-msg-content">
      <MsgSymbol :msg="msg"/>

      <div class="box-content">
         <span class="content" :inner-html.prop="msg.caption | formated" v-if="msg.caption"></span>
         <span class="content" v-else-if="msg.body && msg.isChat" :inner-html.prop="msg.body | formated"></span>
         <MsgType :msg="msg" v-else/>
      </div>
   </div>
</template>

<script>
import MsgSymbol from './msgSymbol/MsgSymbol';
import MsgType from './msgType/MsgType';
import { msg } from '@/helper';

export default {
    name: 'quotedMsgContent',
    components: { MsgType, MsgSymbol },
    props: {
        msg: {
            type: Object,
            required: true
        }
    },
    filters: {
        formated (value) {
            if (value) {
                return msg.processNativeEmojiToImage(value);
            }
            return '';
        }
    }
};
</script>

<style scoped>
   .quoted-msg-content {
      display: flex;
      align-items: center;

   }

   .box-content {
      -webkit-line-clamp: 3;
      color: rgba(0, 0, 0, .6);
      display: -webkit-box;
      font-size: 13.2px;
      line-height: 20px;
      max-height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: pre-wrap;
      word-wrap: break-word;
      -webkit-box-orient: vertical;
   }

   .content {
      color: rgba(0, 0, 0, 0.6);
      font-size: 13.2px;
      white-space: pre-wrap;
      word-wrap: break-word;

      overflow-y: hidden;
      text-overflow: ellipsis;

       max-width: 200px;

   }
</style>
