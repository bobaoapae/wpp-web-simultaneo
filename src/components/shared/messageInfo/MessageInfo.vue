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

            <span v-else-if=" isInvite ">
                {{ formatedNumbers }} entrou usando o link de convite deste grupo
            </span>
        </div>
    </div>
</template>

<script>
// e2e_notification identity
// e2e_notification encrypt

// gp2
import { mapState, mapActions } from 'vuex';

export default {
    name: 'MessageInfo',
    props: {
        msg: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapState(['activeChat', 'self']),

        isMe () {
            if (this.msg.senderObj && this.msg.senderObj.id === this.self.id) {
                return 'Você';
            } else if (this.msg.senderObj && this.msg.senderObj.formattedName) {
                return this.msg.senderObj.formattedName;
            } else if (this.msg.senderObj) {
                return '+' + this.msg.senderObj.id.replace('@c.us', '');
            }
            return 'Você';
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
        },
        isInvite () {
            return this.msg.type === 'gp2' && this.msg.subtype === 'invite';
        }
    },
    methods: {
        ...mapActions(['findFormattedNameFromId'])
    },
    asyncComputed: {
        formatedNumbers: {
            async get () {
                if (this.msg.recipients && this.msg.recipients.length >= 1) {
                    let promises = this.msg.recipients.map((e) => {
                        return this.findFormattedNameFromId({ id: e });
                    });
                    let results = await Promise.all(promises);
                    return results.join(', ');
                }
                return '';
            },
            default () {
                if (this.msg.recipients) {
                    return this.msg.recipients.join(', ');
                }
                return '';
            }
        }
    }
};
</script>

<style scoped>
.message-info {
    padding: 0 9%;
    margin-bottom: 8px;
    margin-top: 8px;
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
