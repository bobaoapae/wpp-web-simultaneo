<template>
    <div id="messages-panel" @scroll="handleScroll">
        <LoadingEarlyMsg v-show="loadingEarly"/>

        <MessagesPrivate v-if="isChat" :msgs="activeChat.msgs" />
        <MessagesGroup v-else-if="isGroup" :msgs="activeChat.msgs" />
    </div>
</template>

<script>
import { mapState } from "vuex";
import MessagesPrivate from "./messagesPrivate/MessagesPrivate.vue";
import MessagesGroup from "./messagesGroup/MessagesGroup.vue";
import api from "@/api";
import LoadingEarlyMsg from "@/components/shared/loadingEarlyMsg/LoadingEarlyMsg";

export default {
    name: "MessagesPanel",
    components: {
        LoadingEarlyMsg,
        MessagesPrivate,
        MessagesGroup
    },
    data() {
      return {
          updatedCount: 0,
          loadingEarly: false
      }
    },
    computed: {
        ...mapState(["activeChat"]),
        isChat() {
            return this.activeChat.type === 'chat';
        },
        isGroup() {
            return this.activeChat.type === 'group';
        }
    },
    mounted() {
        console.log('mounted');
        this.$el.scrollTop = Number.MAX_SAFE_INTEGER;
    },
    updated() {
        console.log('updated');
        console.log('updatedCount:', this.updatedCount);

        if (this.updatedCount === 0) {
            this.$el.scrollTop = Number.MAX_SAFE_INTEGER;
        } else {
            this.scrollToBottom();
        }

        this.updatedCount++;
    },
    watch: {
        "activeChat.msgs": function(val) {
            // alert("Musou");
            // this.scrollToBottom();
            //this.scrollToBottom();
        },
        "activeChat.id": function(val) {
            this.updatedCount = 0;

            if (this.activeChat.msgs.length <= 10) {
                this.loadEarly();
            }
        }
    },
    methods: {
        scrollToBottom() {
            console.log('scrollToBottom::');
            const element = this.$el;
            const maxScrollTop = element.scrollHeight - element.clientHeight - 150;

            console.log('maxScrollTop::',maxScrollTop);
            console.log('element.scrollTop::',element.scrollTop);

            if (element.scrollTop >= maxScrollTop) {
                element.scrollTop = Number.MAX_SAFE_INTEGER;
            }
        },
        handleScroll(e) {
            if (e.target.scrollTop === 0 && this.activeChat.noEarlierMsgs === false) {
                this.loadEarly()
            }
        },
        loadEarly() {
            console.log('loadEarly::');
            this.loadingEarly = true;

            api.post(`/api/whatsApp/loadEarly/${this.activeChat.id}`)
                .then(() => {
                    setTimeout(() => this.loadingEarly = false, 6000);
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