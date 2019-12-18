<template>
   <div class="col-8 col-md-8 col-lg-8 col-xs-9 p-0" id="side-right">
      <ChatIntro v-if="!activeChat"/>
      <Conversation v-else/>
   </div>
</template>

<script>
import { mapState } from 'vuex';

import ChatIntro from './chatIntro/ChatIntro.vue';
import Conversation from './conversation/Conversation.vue';

export default {
    name: 'SideRight',
    components: {
        ChatIntro,
        Conversation
    },
    computed: {
        ...mapState(['activeChat'])
    }
};
</script>

<style scoped>
   #side-right {
      height: 100%;
      background: blue;
   }
</style>
