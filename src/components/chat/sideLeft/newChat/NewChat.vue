<template>
    <transition name="slide-fade">
        <div id="new-chat" v-if="showNewChat">
            <div class="header">
                <div class="header-container">
                    <div class="button-container">
                        <button @click="handleClickBack">
                    <span class="" data-icon="back-light">
                        <svg height="24" id="Layer_1" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path d="M20 11H7.8l5.6-5.6L12 4l-8 8 8 8 1.4-1.4L7.8 13H20v-2z" fill="#FFF">
                            </path>
                        </svg>
                    </span>
                        </button>
                    </div>

                    <div class="label">Nova conversa</div>
                </div>
            </div>
            <ListContact @chatClick="handleChatClick"/>
        </div>
    </transition>
</template>

<script>
import ListContact from './listContact/ListContact';
import { mapMutations, mapState } from 'vuex';

export default {
    name: 'NewChat',
    components: { ListContact },
    computed: {
        ...mapState(['showNewChat'])
    },
    methods: {
        ...mapMutations(['SET_ACTIVE_CHAT', 'SET_SHOW_NEW_CHAT']),

        handleChatClick (chat) {
            this.SET_ACTIVE_CHAT(chat);
            this.SET_SHOW_NEW_CHAT(false);
        },

        handleClickBack () {
            this.SET_SHOW_NEW_CHAT(false);
        }
    }
};
</script>

<style scoped>
#new-chat {
    background-color: #f7f7f7;
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

.header {
    display: flex;
    flex: none;
    box-sizing: border-box;
    color: #fff;
    height: 108px;
    flex-direction: column;
    justify-content: flex-end;
    background-color: #00bfa5;
    padding-right: 20px;
    padding-left: 23px;
}

.header-container {
    height: 59px;
    align-items: center;
    display: flex;
    flex: none;
    width: 100%;
}

.button-container {
    width: 53px;
    flex: none;
}

button {
    cursor: pointer;
    vertical-align: top;
    flex: none;
    outline: none;
    border: 0;
    padding: 0;
    background: none;
    font-family: Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif;
    margin: 0;
}

.label {
    margin-top: -3px;
    font-weight: 500;
    flex-grow: 1;
    font-size: 19px;
    line-height: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
