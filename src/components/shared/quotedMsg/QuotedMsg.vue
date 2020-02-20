<template>
    <div :style="{borderColor: color}" class="quoted-msg" v-scroll-to="{
     el: `#${encodedQuotedMsgId}`,
     container: '#messages-panel',
     duration: 500,
     easing: 'linear',
     offset: -200,
     force: true,
     cancelable: true,
     onDone: onDone,
     x: false,
     y: true
 }">
        <div class="box-content">
            <Author :color="color" :senderObj="quotedMsg.senderObj"/>
            <QuotedMsgContent :msg="quotedMsg"/>
        </div>

        <div class="box-media">
            <QuotedMedia :body="quotedMsg.body" v-if="!quotedMsg.isChat && !quotedMsg.isVcard"/>
            <Picture :id="vCardChatId" :key="vCardChatId" v-else-if="quotedMsg.isVcard"/>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Author from './author/Author';
import QuotedMsgContent from './quotedMsgContent/quotedMsgContent';
import QuotedMedia from './quotedMedia/QuotedMedia';
import Picture from '@/components/shared/picture/Picture.vue';

export default {
    name: 'QuotedMsg',
    components: { Picture, QuotedMedia, QuotedMsgContent, Author },
    props: {
        quotedMsg: {
            required: true,
            type: Object
        }
    },
    computed: {
        ...mapState(['self', 'activeChat']),

        color () {
            if (this.activeChat.isGroup && this.quotedMsg.senderObj.id !== this.self.id) {
                return this.activeChat.getColor(this.quotedMsg.senderObj.id);
            } else if (this.quotedMsg.senderObj.id !== this.self.id) {
                return '#74cff8';
            }
            return '#35cd96';
        },

        encodedQuotedMsgId () {
            return this.quotedMsg.id._serialized.replace(/[^\w\s]/gi, '').replace(/[_]/gi, '');
        },

        vCardChatId () {
            for (let tel in this.quotedMsg.vCard.tel) {
                if (this.quotedMsg.vCard.tel[tel].meta && this.quotedMsg.vCard.tel[tel].meta.waid) {
                    return this.quotedMsg.vCard.tel[tel].meta.waid[0] + '@c.us';
                }
            }
            return '';
        }
    },
    methods: {
        onDone (element) {
            // fazer piscar
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
    overflow-x: hidden;
}

.box-content {
    flex: 1;

    display: flex;
    flex-direction: column;

    padding: 4px 12px 8px 8px;
    overflow-x: hidden;
    text-overflow: ellipsis;
}
</style>
