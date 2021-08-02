<template>
    <div class="col-4 col-md-4 col-lg-4 col-xs-3 p-0" id="side-left">
        <NewChat v-if="showNewChat"/>

        <div id="list-chat" v-else>
            <LeftHeader/>

            <ChatList/>
        </div>
    </div>
</template>

<script>
import LeftHeader from './leftHeader/LeftHeader.vue';
import ChatList from './chatList/ChatList.vue';
import NewChat from './newChat/NewChat.vue';
import { mapState } from 'vuex';

export default {
    name: 'SideLeft',
    components: {
        NewChat,
        LeftHeader,
        ChatList
    },
    computed: {
        ...mapState(['showNewChat'])
    }
};
</script>

<style scoped>
#side-left {
    height: 100%;
    /* padding: 0; */
    display: flex;
    flex-direction: column;
}
</style>
