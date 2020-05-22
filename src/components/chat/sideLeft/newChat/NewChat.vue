<template>
    <transition name="slide-fade">
        <div id="new-chat" v-if="show">
            <Header/>
            <InputSearch/>
            <ListContact @chatClick="handleChatClick"/>
        </div>
    </transition>
</template>

<script>
import Header from './header/Header';
import InputSearch from './inputSearch/InputSearch';
import ListContact from './listContact/ListContact';
import { mapMutations } from 'vuex';

export default {
    name: 'NewChat',
    components: { ListContact, InputSearch, Header },
    data () {
        return {
            show: false
        };
    },
    mounted () {
        this.$root.$on('showNewChat', data => {
            this.show = data;
        });
    },
    methods: {
        ...mapMutations(['SET_ACTIVE_CHAT']),

        handleChatClick (chat) {
            this.SET_ACTIVE_CHAT(chat);
            this.$root.$emit('showNewChat', false);
        }
    }
};
</script>

<style scoped>
#new-chat {
    background-color: #f7f7f7;
    position: absolute;
    width: 100%;
    height: 100%;
    z-index: 5;
}

/* Enter and leave animations can use different */
/* durations and timing functions.              */
.slide-fade-enter-active {
    transition: all .2s ease;

}

.slide-fade-leave-active {
    transition: all .35s cubic-bezier(1.0, 0.5, 0.8, 1.0);

}

.slide-fade-enter, .slide-fade-leave-to
    /* .slide-fade-leave-active below version 2.1.8 */
{
    transform: translateX(-250px);
    opacity: 0;

}
</style>
