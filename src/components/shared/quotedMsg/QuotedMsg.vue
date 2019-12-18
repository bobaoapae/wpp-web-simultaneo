<template>
   <div :style="{borderColor: color}" class="quoted-msg">
      <div class="box-content">
         <Author :color="color" :senderObj="quotedMsg.senderObj"/>
         <QuotedMsgContent :body="bodyformated" :caption="captionFormated" :type="quotedMsg.type"/>
      </div>

      <div class="box-media">
         <QuotedMedia :body="quotedMsg.body" v-if=" quotedMsg.type !== 'chat' "/>
      </div>
   </div>
</template>

<script>
import { msg } from '@/helper';
import { mapState } from 'vuex';
import Author from './author/Author';
import QuotedMsgContent from './quotedMsgContent/quotedMsgContent';
import QuotedMedia from './quotedMedia/QuotedMedia';

export default {
    name: 'QuotedMsg',
    components: { QuotedMedia, QuotedMsgContent, Author },
    props: {
        quotedMsg: {
            required: true,
            type: Object
        }
    },
    computed: {
        ...mapState(['self']),

        color () {
            if (this.quotedMsg.senderObj.id !== this.self.id) {
                return '#74cff8';
            }
            return '#35cd96';
        },

        captionFormated () {
            if (this.quotedMsg.caption) {
                return msg.processNativeEmojiToImage(this.quotedMsg.caption);
            }
            return '';
        },

        bodyformated () {
            if (this.quotedMsg.body) {
                return msg.processNativeEmojiToImage(this.quotedMsg.body);
            }
            return '';
        }
    }
};
</script>

<style scoped>
   .quoted-msg {
      display: flex;
      flex-direction: row;
      background-color: rgba(0, 0, 0, .05);
      border-radius: 5px;
      border-left: 4px solid #35cd96;
      margin: 3px;
   }

   .box-content {
      flex: 1;

      display: flex;
      flex-direction: column;

      padding: 4px 12px 8px 8px;
   }
</style>
