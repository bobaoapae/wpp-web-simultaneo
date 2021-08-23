<template>
    <div class="message-body">
        <component :is="componentMsg"></component>
    </div>
</template>

<script>
import filters from '@/filters';
import { mapActions, mapMutations, useStore } from 'vuex';
import { defineComponent } from 'vue';

export default {
    name: 'MessageTextContent',
    props: {
        msg: {
            type: Object,
            required: true
        }
    },
    async setup (props) {
        const store = useStore();

        let body = filters.emojify(filters.formatMsg(props.msg.caption || props.msg.body));
        if (props.msg.mentionedJidList) {
            for await (let mentionedJid of props.msg.mentionedJidList) {
                let contact = await store.dispatch('findContactFromId', { id: mentionedJid });
                let name = contact.formattedName || contact.verifiedName || contact.pushname;
                body = body.replace('@' + mentionedJid.split('@')[0], `<span class="mention"><span class='mention-symbol'>@</span><span class='btn-link' dir="ltr" @click="clickMention('${mentionedJid}')">${name}</span></span>`);
            }
        }

        const componentMsg = defineComponent({
            name: 'componentMsg',
            template: `
                <div class="content">${body}</div>`,
            methods: {
                ...mapActions(['getGroupInviteInfo', 'findChatFromId']),
                ...mapMutations(['SET_ACTIVE_CHAT']),

                groupInviteLinkClick (link) {
                    this.getGroupInviteInfo({ link }).then(inviteLinkInfo => {
                        console.log(inviteLinkInfo);
                    });
                },

                groupViewInfo (link) {
                    this.getGroupInviteInfo({ link }).then(inviteLinkInfo => {
                        console.log(inviteLinkInfo);
                    });
                },

                async clickMention (id) {
                    let chat = await this.findChatFromId({ id: id });
                    this.SET_ACTIVE_CHAT(chat);
                }
            }
        });

        return {
            componentMsg
        };

    }
};
</script>

<style scoped>
.message-body {
    padding: 6px 7px 8px 9px;
    margin-right: 55px;
    color: #262626;
    font-size: 14px;
    line-height: 19px;
    white-space: pre-wrap;
    word-wrap: break-word;
}

.message-body ::v-deep(.mention) {
    cursor: pointer;
}

.message-body ::v-deep(.mention-symbol) {
    color: rgba(0, 0, 0, 0.25)
}
</style>
