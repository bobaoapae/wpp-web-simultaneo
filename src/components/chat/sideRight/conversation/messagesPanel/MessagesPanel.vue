<template>
    <div @scroll="handleScroll" id="messages-panel">
        <LoadingEarlyMsg v-show="loadingEarly"/>

        <MessagesList :msgs="activeChat.msgs"/>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import MessagesList from './messagesList/MessagesList';
import LoadingEarlyMsg from '@/components/shared/loadingEarlyMsg/LoadingEarlyMsg';

export default {
    name: 'MessagesPanel',
    components: {
        LoadingEarlyMsg,
        MessagesList
    },
    data () {
        return {
            updatedCount: 0,
            loadingEarly: false
        };
    },
    computed: {
        ...mapState(['activeChat']),
        isChat () {
            return this.activeChat.kind === 'chat';
        },
        isGroup () {
            return this.activeChat.kind === 'group';
        }
    },
    mounted () {
        this.$el.scrollTop = Number.MAX_SAFE_INTEGER;
    },
    updated () {
        if (this.updatedCount === 0) {
            this.$el.scrollTop = Number.MAX_SAFE_INTEGER;
        } else {
            this.scrollToBottom();
        }

        this.updatedCount++;
    },
    watch: {
        'activeChat.msgs': function (val) {
            // alert("Musou");
            // this.scrollToBottom();
            // this.scrollToBottom();
        },
        'activeChat.id': function (val) {
            this.updatedCount = 0;

            if (!this.activeChat.noEarlierMsgs && this.activeChat.msgs.length <= 10) {
                this.handleLoadEarly();
            }
        }
    },
    methods: {
        scrollToBottom () {
            const element = this.$el;
            const maxScrollTop = element.scrollHeight - element.clientHeight - 200;

            if (element.scrollTop >= maxScrollTop) {
                element.scrollTop = Number.MAX_SAFE_INTEGER;
            }
        },
        handleScroll (e) {
            if (e.target.scrollTop === 0 && this.activeChat.noEarlierMsgs === false) {
                this.handleLoadEarly();
            }
        },
        handleLoadEarly () {
            this.loadingEarly = true;
            this.activeChat.loadEarly().then(() => {
                this.loadingEarly = false;
            });
        }
    }
};
</script>

<style scoped>
#messages-panel {
    padding: 10px 0;
    flex: 1;
    background-image: url("../../../../../assets/images/bg-chat.png");
    overflow: scroll;
    overflow-x: hidden;
}
</style>
