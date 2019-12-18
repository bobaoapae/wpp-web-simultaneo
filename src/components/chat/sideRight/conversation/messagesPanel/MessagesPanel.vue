<template>
  <div @scroll="handleScroll" id="messages-panel">
    <LoadingEarlyMsg v-show="loadingEarly"/>

    <MessagesPrivate :msgs="activeChat.msgs" v-if="isChat"/>
    <MessagesGroup :msgs="activeChat.msgs" v-else-if="isGroup"/>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import MessagesPrivate from './messagesPrivate/MessagesPrivate.vue';
import MessagesGroup from './messagesGroup/MessagesGroup.vue';
import LoadingEarlyMsg from '@/components/shared/loadingEarlyMsg/LoadingEarlyMsg';

export default {
  name: 'MessagesPanel',
  components: {
    LoadingEarlyMsg,
    MessagesPrivate,
    MessagesGroup
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
        this.handleloadEarly();
      }
    }
  },
  methods: {
    ...mapActions(['loadEarly']),

    scrollToBottom () {
      const element = this.$el;
      const maxScrollTop = element.scrollHeight - element.clientHeight - 200;

      if (element.scrollTop >= maxScrollTop) {
        element.scrollTop = Number.MAX_SAFE_INTEGER;
      }
    },
    handleScroll (e) {
      if (e.target.scrollTop === 0 && this.activeChat.noEarlierMsgs === false) {
        this.handleloadEarly();
      }
    },
    handleloadEarly () {
      this.loadingEarly = true;

      this.loadEarly({ chatId: this.activeChat.id });

      setTimeout(() => { this.loadingEarly = false; }, 7000);
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
