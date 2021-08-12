<template>
    <div class="quoted-msg-content">
        <MsgSymbol :msg="msg"/>

        <div class="box-content">
            <span :inner-html.prop="caption" class="content" v-if="msg.caption"></span>
            <span :inner-html.prop="body" class="content" v-else-if="msg.body && msg.isChat"></span>
            <MsgType :msg="msg" v-else/>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import MsgSymbol from './msgSymbol/MsgSymbol.vue';
import MsgType from './msgType/MsgType.vue';

export default {
    name: 'quotedMsgContent',
    components: { MsgType, MsgSymbol },
    props: {
        msg: {
            type: Object,
            required: true
        }
    },
    asyncComputed: {
        caption: {
            async get () {
                let caption = this.$options.filters.emojify(this.$options.filters.formatMsg(this.msg.caption));
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
                        let contact = await chat.contact();
                        let name = contact.formattedName || contact.verifiedName || contact.pushname;
                        caption = caption.replace('@' + this.msg.mentionedJidList[x].split('@')[0], `<span class='mention-symbol'>@</span><span class='btn-link' dir="ltr">${name}</span>`);
                    }
                }
                return caption;
            },
            default () {
                return this.msg.caption;
            }
        },
        body: {
            async get () {
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
                        let contact = await chat.contact();
                        let name = contact.formattedName || contact.verifiedName || contact.pushname;
                        body = body.replace('@' + this.msg.mentionedJidList[x].split('@')[0], `<span class='mention-symbol'>@</span><span class='btn-link' dir="ltr">${name}</span>`);
                    }
                }
                return body;
            },
            default () {
                return this.msg.body;
            }
        }
    },
    methods: {
        ...mapActions(['findChatFromId'])
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
