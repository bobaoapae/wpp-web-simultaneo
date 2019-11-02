<template>
    <div id="messages-panel">
        <MessagesPrivate v-if="isUser" :msgs="activeChat.msgs" />
        <MessagesGroup v-else :msgs="activeChat.msgs" />
    </div>
</template>

<script>
import { mapState } from "vuex";
import MessagesPrivate from "./messagesPrivate/MessagesPrivate.vue";
import MessagesGroup from "./messagesGroup/MessagesGroup.vue";

export default {
    name: "MessagesPanel",
    components: {
        MessagesPrivate,
        MessagesGroup
    },
    computed: {
        ...mapState(["activeChat"]),
        isUser() {
            return this.activeChat.type === 'user';
        }
    },
    mounted() {
        this.scrollToBottom();
    },
    updated() {
        this.scrollToBottom();
    },
    watch: {
        "activeChat.msgs": function(val) {
            // alert("Musou");
            // this.scrollToBottom();
            this.scrollToBottom();
        }
    },
    methods: {
        scrollToBottom() {
            const element = this.$el;
            element.scrollTop = element.scrollHeight - element.clientHeight;
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