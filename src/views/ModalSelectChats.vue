<template>
    <div class="modal-select-chats" v-if="selectChats.show">
        <div class="box-modal">
            <header class="modal-header">
                <div class="header-body">
                    <div class="header-close">
                        <button class="button-close" @click="closeModal">
                            <img src="@/assets/images/wpp-icon-close-modal.svg"/>
                        </button>
                    </div>
                    <div class="header-text">Encaminhar mensagem para</div>
                </div>
            </header>
            <div class="chats">
                <transition name="slide-fade">
                    <div id="chat-forward">
                        <InputSearch/>
                        <ListContact @chatClick="handleChatClick"/>
                    </div>
                </transition>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import InputSearch from '../components/chat/sideLeft/newChat/inputSearch/InputSearch';
import ListContact from '../components/chat/sideLeft/newChat/listContact/ListContact';

export default {
    name: 'ModalSelectChats',
    components: {
        InputSearch,
        ListContact
    },
    computed: {
        ...mapState(['selectChats', 'selectMsgs', 'activeChat'])
    },
    mounted () {
        this.$root.$on('keyDown', (evt) => {
            if (this.selectChats.show) {
                evt.preventDefault();
                if (evt.key === 'Escape') {
                    this.closeModal();
                }
            }
        });
    },
    methods: {
        ...mapMutations(['TOGGLE_SELECT_CHAT', 'SET_SELECT_CHATS']),

        closeModal () {
            this.SET_SELECT_CHATS({ show: false });
        },

        handleChatClick (chat) {
            this.TOGGLE_SELECT_CHAT({ chat });
            this.activeChat.forwardMessages({
                msgs: this.selectMsgs.msgs,
                chats: this.selectChats.chats
            }).finally(() => {
                this.closeModal();
            });
        }
    }
};
</script>

<style scoped>
.modal-select-chats {
    position: absolute;
    z-index: 99;
    width: 100%;
    background-color: hsla(0, 0%, 100%, .85);
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}

.modal-select-chats button, .modal-select-chats button:focus {
    border: none;
    outline: none;
    background-color: rgba(0, 0, 0, 0);
    filter: invert(1);
}

.box-modal {
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 17px 50px 0 rgba(0, 0, 0, .19), 0 12px 15px 0 rgba(0, 0, 0, .24);
    box-sizing: border-box;
    display: flex;
    overflow: hidden;
    width: 400px;
    flex-direction: column;
    flex: none;
}

.modal-header {
    display: flex;
    flex: none;
    box-sizing: border-box;
    height: 59px;
    color: #FFFFFF;
    align-items: center;
    padding: 0 20px 0 25px;
    border-top-left-radius: 3px;
    border-top-right-radius: 3px;
    background-color: #009688;
}

.header-body {
    align-items: center;
    display: flex;
    flex: none;
    width: 100%;
}

.header-text {
    flex-grow: 1;
    font-size: 19px;
    line-height: normal;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-weight: 500;
}
</style>
