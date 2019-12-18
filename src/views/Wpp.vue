<template>
   <div id="wpp">
      <div class="my-modal">

      </div>

      <QrCode v-show="!isQrCodeLogged && isLoadingChat"/>
      <Loading v-if="isLoadingChat && isQrCodeLogged"/>
      <Chat v-else-if="isQrCodeLogged &&  !isLoadingChat"/>
   </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

import Loading from '@/views/Loading.vue';
import QrCode from '@/views/QrCode.vue';
import Chat from '@/views/Chat.vue';

export default {
    name: 'Wpp',
    components: {
        Loading,
        QrCode,
        Chat
    },
    data () {
        return {};
    },
    computed: {
        ...mapState(['isQrCodeLogged', 'isLoadingChat'])
    },
    created () {
    // this.getChats();
    },

    methods: {
        ...mapActions(['getChats'])
    }
};
</script>

<style scoped>
   #wpp {
      height: 100%;
   }
</style>
