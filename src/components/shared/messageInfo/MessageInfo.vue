<template>
   <div class="message-info">
      <div :class="{ e2e : msg.type === 'e2e_notification' }" class="message-info-container">
            <span v-if=" isEncrypt ">
                As mensagens e chamadas desta conversa estão protegidas com a criptografia de ponta a ponta.
            </span>

         <span v-else-if=" isIdentity ">
                O código de segurança de +{{ msg.body.replace('@c.us', '') }} mudou.
            </span>

         <span v-else-if=" isCreate ">
                {{ isMe }} criou o grupo "{{ activeChat.formattedTitle }}"
            </span>

         <span v-else-if=" isAdd ">
                {{ isMe }} adicionou {{ formatedNumbers }}
            </span>

         <span v-else-if=" isRemove ">
                {{ isMe }} removeu {{ formatedNumbers }}
            </span>

         <span v-else-if=" isPromote ">
                Você agora é um administrador
            </span>

         <span v-else-if=" isDemote ">
                Você não é mais um administrador
            </span>

         <span v-else-if=" isLeave ">
                {{ formatedNumbers }} saiu
            </span>
      </div>
   </div>
</template>

<script>
// e2e_notification identity
// e2e_notification encrypt

// gp2
import { mapState } from 'vuex';

export default {
  name: 'MessageInfo',
  props: {
    msg: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState(['activeChat', 'self', 'contacts']),

    isMe () {
      if (this.msg.senderObj && this.msg.senderObj.id === this.self.id) {
        return 'Você';
      } else if (this.msg.senderObj && this.msg.senderObj.name) {
        return this.msg.senderObj.name;
      } else if (this.msg.senderObj) {
        return '+' + this.msg.senderObj.id.replace('@c.us', '');
      } else {
        return 'Você';
      }
    },

    formatedNumbers () {
      if (this.msg.recipients.length > 1) {
        return this.msg.recipients.map(e => {
          const el = this.contacts.find(el => el.id === e);

          if (el) {
            return el.formattedName;
          } else {
            return '+' + (e.split('@')[0]);
          }
        })
          .slice(0, -1)
          .join(', ') + ' e ' + this.msg.recipients.map(e => {
          const el = this.contacts.find(el => el.id === e);

          if (el) {
            return el.formattedName;
          } else {
            return '+' + (e.split('@')[0]);
          }
        })
          .slice(-1);
      } else {
        const el = this.contacts.find(el => el.id === this.msg.recipients[0]);

        if (el && el.formattedName) {
          return el.formattedName;
        } else {
          return '+' + this.msg.recipients[0].replace('@c.us', '');
        }
      }
    },

    isEncrypt () {
      return this.msg.type === 'e2e_notification' && this.msg.subtype === 'encrypt';
    },
    isIdentity () {
      return this.msg.type === 'e2e_notification' && this.msg.subtype === 'identity';
    },
    isCreate () {
      return this.msg.type === 'gp2' && this.msg.subtype === 'create';
    },
    isAdd () {
      return this.msg.type === 'gp2' && this.msg.subtype === 'add';
    },
    isRemove () {
      return this.msg.type === 'gp2' && this.msg.subtype === 'remove';
    },
    isPromote () {
      return this.msg.type === 'gp2' && this.msg.subtype === 'promote';
    },
    isDemote () {
      return this.msg.type === 'gp2' && this.msg.subtype === 'demote';
    },
    isLeave () {
      return this.msg.type === 'gp2' && this.msg.subtype === 'leave';
    }
  }
};
</script>

<style scoped>
   .message-info {
      padding: 0 9%;
      margin-bottom: 8px;
      display: flex;
      justify-content: center;
   }

   .message-info-container {
      background-color: rgba(225, 245, 254, .92);
      border-radius: 7.5px;
      box-shadow: 0 1px 0.5px rgba(0, 0, 0, .13);
      padding: 5px 12px 6px;
      text-align: center;
      text-shadow: 0 1px 0 hsla(0, 0%, 100%, .4);

      box-sizing: border-box;
      color: rgba(74, 74, 74, .88);
      display: inline-block;
      flex: none;
      font-size: 12.5px;
      line-height: 21px;
   }

   .e2e {
      background-color: rgba(255, 245, 196, .95);
   }
</style>
