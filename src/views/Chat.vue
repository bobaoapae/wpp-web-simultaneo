<template>
    <div id="chat" @mousemove="handleActive" @keypress="handleActive" @focusin="handleActive">
        <SideMenu/>
            <div class="box-chat container-fluid">
                <div class="row">
                    <SideLeft/>
                    <SideRight/>
                    <ChatInfo v-if="activeChat && activeChat.openChatInfo"/>
                </div>
        </div>

        <ModalMedia/>
        <ModalDeleteMsg/>
        <ModalSelectChats/>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import ChatInfo from '@/components/chat/sideRight/chatInfo/ChatInfo';
import SideLeft from '@/components/chat/sideLeft/SideLeft.vue';
import SideRight from '@/components/chat/sideRight/SideRight.vue';
import ModalMedia from './ModalMedia';
import ModalDeleteMsg from './ModalDeleteMsg';
import ModalSelectChats from './ModalSelectChats';
import SideMenu from '@/views/SideMenu.vue';

export default {
    name: 'Chat',
    components: {
        ModalDeleteMsg,
        ModalMedia,
        ModalSelectChats,
        SideLeft,
        SideRight,
        ChatInfo,
        SideMenu
    },
    computed: {
        ...mapState(['activeChat'])
    },
    methods: {
        ...mapActions(['appActive']),

        handleActive () {
            this.appActive();
        }
    }
};
</script>

<style scoped>
#chat {
    height: 100%;
    background: linear-gradient(#009688 127px, #d7dbd8 0%);
    display: flex;
    justify-content: center;
    align-items: center;
    min-width: 648px;
}

.box-chat {
    height: 100%;
    background: #fff;
    flex: 1;
    box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.2);
}

.row {
    height: 100%;
}

@media screen and (min-width: 648px) {
    #chat {
        overflow-x: hidden;
    }
}

@media screen and (min-width: 1441px) {
    .my-container {
        width: 1396px;
        height: calc(100% - 38px);
        margin: 0 auto;
    }
}
</style>
