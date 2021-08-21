<template>
    <div class="quoted-msg-content">
        <MsgSymbol :msg="msg"/>

        <div class="box-content">
            <span v-html="caption" class="content" v-if="msg.caption"></span>
            <span v-html="body" class="content" v-else-if="msg.body && msg.isChat"></span>
            <MsgType :msg="msg" v-else/>
        </div>
    </div>
</template>

<script>
import { useStore } from 'vuex';
import { asyncComputed } from '@/AsyncComputed';
import filters from '@/filters';
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
    setup (props) {
        const store = useStore();

        const getMentionedJid = async (text) => {
            let caption = filters.emojify(filters.formatMsg(text));
            if (props.msg.mentionedJidList && props.msg.mentionedJidList.length > 0) {
                let promises = [];
                let results = {};
                for (let x = 0; x < props.msg.mentionedJidList.length; x++) {
                    promises.push(store.dispatch('findChatFromId', { id: props.msg.mentionedJidList[x] }).then(value => {
                        results[props.msg.mentionedJidList[x]] = value;
                    }));
                }
                await Promise.all(promises);
                for (let x = 0; x < props.msg.mentionedJidList.length; x++) {
                    let chat = results[props.msg.mentionedJidList[x]];
                    let contact = await chat.contact();
                    let name = contact.formattedName || contact.verifiedName || contact.pushname;
                    caption = caption.replace('@' + props.msg.mentionedJidList[x].split('@')[0], `<span class='mention-symbol'>@</span><span class='btn-link' dir="ltr">${name}</span>`);
                }
            }
            return caption;
        };

        const caption = asyncComputed(() => {
            return getMentionedJid(props.msg.caption);
        }, { default: props.msg.caption, lazy: true });

        const body = asyncComputed(() => {
            return getMentionedJid(props.msg.body);
        }, { default: props.msg.body, lazy: true });

        return {
            caption,
            body
        };
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
