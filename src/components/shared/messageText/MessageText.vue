<template>
    <div class="text-container">
        <div @dblclick.prevent.stop class="message-text">
            <Thumbnail :msg="msg" v-if="msg.matchedText"/>

            <span class="message-body"><component :is="componentMsg"></component></span>
        </div>

        <MessageTime :msg="msg"/>

    </div>
</template>

<script>
import filters from '@/filters';
import MessageTime from '../messageTime/MessageTime.vue';
import Thumbnail from '../thumbnail/Thumbnail.vue';
import { mapActions, mapMutations, useStore } from 'vuex';
import { defineComponent } from 'vue';

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
    },
    async setup (props) {
        const store = useStore();

        let body = filters.emojify(filters.formatMsg(props.msg.body));
        if (props.msg.mentionedJidList) {
            for await (let mentionedJid of props.msg.mentionedJidList) {
                let contact = await store.dispatch('findContactFromId', { id: mentionedJid });
                let name = contact.formattedName || contact.verifiedName || contact.pushname;
                body = body.replace('@' + mentionedJid.split('@')[0], `<div class="mention"><span class='mention-symbol'>@</span><span class='btn-link' dir="ltr" @click="clickMention('${mentionedJid}')">${name}</span></div>`);
            }
        }

        const componentMsg = defineComponent({
            name: 'componentMsg',
            template: `
                <div>${body}</div>`,
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
.text-container {
    min-width: 100px;
    max-width: 500px;
    user-select: text;
}

.message-text {
    padding: 6px 7px 8px 9px;
    line-height: 19px;
}

.message-text span {
    margin-right: 55px;
    white-space: pre-wrap;
    word-wrap: break-word;
    color: #262626;
    font-size: 14.2px;
}

.message-body ::v-deep(.mention) {
    cursor: pointer;
}

.message-body ::v-deep(.mention-symbol) {
    color: rgba(0, 0, 0, 0.25)
}
</style>
