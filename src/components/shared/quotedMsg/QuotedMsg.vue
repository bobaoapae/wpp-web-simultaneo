<template>
    <!--
    TODO: scroll-to
    v-scroll-to="{
     el: `#${encodedQuotedMsgId}`,
     container: '.messages-list',
     duration: 500,
     easing: 'linear',
     offset: -200,
     force: true,
     cancelable: true,
     onDone: onDone,
     x: false,
     y: true
 }"
    -->
    <div :style="{borderColor: color}" class="quoted-msg" v-if="senderObj">
        <div class="box-content">
            <Author :color="color" :senderObj="senderObj"/>
            <QuotedMsgContent :msg="quotedMsg"/>
        </div>

        <div class="box-media">
            <QuotedMedia :body="quotedMsg.body" v-if="!quotedMsg.isChat && !quotedMsg.isVcard"/>
            <Picture :id="vCardChatId" :key="vCardChatId" v-else-if="quotedMsg.isVcard"/>
        </div>
    </div>
</template>

<script>
import { mapActions, useStore } from 'vuex';
import { asyncComputed } from '@/AsyncComputed';
import Author from './author/Author.vue';
import QuotedMsgContent from './quotedMsgContent/quotedMsgContent.vue';
import QuotedMedia from './quotedMedia/QuotedMedia.vue';
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
    setup (props) {
        const store = useStore();

        const senderObj = asyncComputed(async () => {
            return props.quotedMsg.senderObj();
        }, { default: false, lazy: true });

        const color = asyncComputed(async () => {
            let senderObj = await props.quotedMsg.senderObj();
            if (store.state.activeChat.isGroup && senderObj.id !== store.state.self.id) {
                return store.state.activeChat.getColor(senderObj.id);
            } else if (senderObj.id !== store.state.self.id) {
                return '#74cff8';
            }
            return '#35cd96';
        });

        return {
            senderObj,
            color
        };
    },
    computed: {
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
        ...mapActions(['updateMsg']),

        onDone () {
            //TODO: blink quotedMsg
            //this.quotedMsg.blink = true;
            this.updateMsg(this.quotedMsg);
            setTimeout(() => {
                //this.quotedMsg.blink = false;
                this.updateMsg(this.quotedMsg);
            }, 1500);
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
