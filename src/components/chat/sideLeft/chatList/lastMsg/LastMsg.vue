<template>
   <div :class="{unread : isUnread}" class="last-msg flex-grow-1 d-flex align-items-center" v-if="lastMsg">
      <MessageIconStatus :ack="lastMsg.ack" class="icon-status" v-if="lastMsg.id.fromMe"/>

      <span v-if="isGroup && lastMsg && lastMsg.senderObj && !lastMsg.id.fromMe">
            {{senderFormated}}:
        </span>

      <MessageBody :lastMsg="lastMsg"/>
   </div>
</template>

<script>
// TODOS
// chat
// image
// audio
// sticker
// video
// ptt = audio
// document
// revoked = Mensagem apagada
// e2e_notification = O código de segurança de ... mudou.

// GRUPO
// gp2 = ... saiu do grupo

// USUARIO
// call_log = log de chamada

// vcard
// notification_template
// broadcast_notification

import MessageBody from './messageBody/MessageBody.vue';
import MessageIconStatus from '@/components/shared/messageIconStatus/MessageIconStatus.vue';
import { mapActions } from 'vuex';
import { msg } from '@/helper.js';

export default {
    name: 'LastMsg',
    components: {
        MessageIconStatus,
        MessageBody
    },
    props: {
        chat: {
            type: Object,
            required: true
        }
    },
    data () {
        return {};
    },
    created () {

    },
    watch: {},
    computed: {
        isUnread () {
            return this.chat.unreadCount > 0;
        },
        isGroup () {
            return this.chat.kind === 'group';
        },
        lastMsg () {
            return this.chat.lastMsg;
        }
    },
    asyncComputed: {
        senderFormated: {
            async get () {
                if (this.lastMsg && this.lastMsg.senderObj) {
                    return msg.processNativeEmojiToImage(await this.findFormattedNameFromId({ id: this.lastMsg.senderObj.id }));
                }
            },
            default () {
                if (this.lastMsg && this.lastMsg.senderObj) {
                    return '+' + this.lastMsg.senderObj.id.split('@')[0];
                }
            }
        }
    },
    methods: {
        ...mapActions(['findFormattedNameFromId'])
    }
};
</script>

<style scoped>
   .last-msg {
      overflow: hidden;
   }

   .last-msg span {
      color: rgba(0, 0, 0, 0.4);
      font-size: 14px;
      white-space: nowrap;
      margin-right: 3px;
   }

   img {
      width: 20px;
   }

   .icon-status {
      margin-right: 3px;
   }

   .unread span {
      color: rgba(0, 0, 0, 0.8) !important;
      font-weight: 500 !important;
   }
</style>
