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
import MessageTime from '../messageTime/MessageTime';
import Thumbnail from '../thumbnail/Thumbnail';
import { mapActions } from 'vuex';
import Vue from 'vue';

export default {
    name: 'MessageText',
    components: {
        MessageTime,
        Thumbnail
    },
    data () {
        return {
            componentMsg: null
        };
    },
    props: {
        msg: {
            type: Object,
            required: true
        }
    },
    async mounted () {
        let body = this.$options.filters.emojify(this.$options.filters.formatMsg(this.msg.body));
        if (this.msg.mentionedJidList && this.msg.mentionedJidList.length > 0) {
            let promises = [];
            let results = {};
            for (let x = 0; x < this.msg.mentionedJidList.length; x++) {
                promises.push(this.findChatFromId({ id: this.msg.mentionedJidList[x] }).then(value => {
                    results[this.msg.mentionedJidList[x]] = value;
                }));
            }
            await Promise.all(promises);
            for (let x = 0; x < this.msg.mentionedJidList.length; x++) {
                let chat = results[this.msg.mentionedJidList[x]];
                let name = chat.contact.formattedName || chat.contact.verifiedName || chat.contact.pushname;
                body = body.replace('@' + this.msg.mentionedJidList[x].split('@')[0], `<span class='mention-symbol'>@</span><span class='btn-link' dir="ltr">${name}</span>`);
            }
        }

        this.componentMsg = Vue.component('componentMsg', {
            template: `<div>${body}</div>`,
            methods: {
                ...mapActions(['getGroupInviteInfo']),

                groupInviteLinkClick (link) {
                    this.getGroupInviteInfo({ link }).then(inviteLinkInfo => {
                        console.log(inviteLinkInfo);
                    });
                },

                groupViewInfo (link) {
                    this.getGroupInviteInfo({ link }).then(inviteLinkInfo => {
                        console.log(inviteLinkInfo);
                    });
                }
            }
        });
    },
    methods: {
        ...mapActions(['findChatFromId'])
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

.message-body >>> .mention-symbol {
    color: rgba(0, 0, 0, 0.25)
}
</style>
