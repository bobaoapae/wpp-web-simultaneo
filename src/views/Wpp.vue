<template>
    <div id="wpp">
        <div class="my-modal">

        </div>

        <LoginFailed v-if="driverState === 'LOGIN_FAILED'"/>
        <QrCode v-if="!isQrCodeLogged && isLoadingChat"/>
        <Loading v-else-if="isLoadingChat && isQrCodeLogged"/>
        <Chat v-else-if="isQrCodeLogged &&  !isLoadingChat"/>
    </div>
</template>

<script>
import { mapState } from 'vuex';

import Loading from '@/views/Loading.vue';
import QrCode from '@/views/QrCode.vue';
import Chat from '@/views/Chat.vue';
import LoginFailed from '@/views/LoginFailed.vue';

export default {
    name: 'Wpp',
    components: {
        LoginFailed,
        Loading,
        QrCode,
        Chat
    },
    data () {
        return {};
    },
    computed: {
        ...mapState(['isQrCodeLogged', 'isLoadingChat', 'driverState'])
    }
};
</script>

<style scoped>
#wpp {
    height: 100%;
}
</style>
