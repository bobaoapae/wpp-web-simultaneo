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
import { defineAsyncComponent } from 'vue';
import { mapState } from 'vuex';
import LeftHeader from './leftHeader/LeftHeader.vue';
import ChatList from './chatList/ChatList.vue';

const NewChat = defineAsyncComponent(() => import('./newChat/NewChat.vue'));

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
