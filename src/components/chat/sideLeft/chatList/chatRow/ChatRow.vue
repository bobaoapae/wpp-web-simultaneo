<template>
    <div class="chat-row" @contextmenu.prevent="handleContextMenu" @mouseenter="handleHover(true)"
         @mouseleave="handleHover(false)">
        <Picture :group="chat.isGroup" :id="chat.id"/>

        <div class="box-info-chat" @click="handleClick">
            <div class="d-flex">
                <NameChat :chat="chat"/>
                <TimeMsg :chat="chat"/>
            </div>

            <div class="d-flex row-info">
                <PresenceChat :chat="chat"
                              :class="{'d-flex align-items-center flex-grow-1': chat.isChat && (chat.isComposing || chat.isRecording)}"
                              :showLastTime="false"
                              :showOnline="false"
                              v-if="chat.isChat"
                              :key="chat.id"/>
                <LastMsg :chat="chat" v-if="chat.lastMsg && (!chat.isChat || (!chat.isComposing && !chat.isRecording))"
                         :key="chat.lastMsg.id._serialized"/>
                <Icons :chat="chat"/>
                <div v-if="!processing" :class="{'chat-menu-open' : showMenuIcon || menuOpen}" @click.stop>
                    <div
                        class="chat-menu"
                        v-if="showMenuIcon || menuOpen">
                        <b-dropdown
                            @hide="handleMenuHide"
                            @show="handleMenuShow"
                            lazy
                            no-caret
                            toggle-class="text-decoration-none p-0"
                            variant="link"
                            ref="dropdown"
                        >
                            <template v-slot:button-content>
                                <img src="@/assets/images/wpp-message-arrow-down.svg">
                            </template>

                            <b-dropdown-item @click.stop="handlePinChat" v-if="!chat.pin || chat.pin === 0">Fixar a
                                Conversa
                            </b-dropdown-item>
                            <b-dropdown-item @click.stop="handleUnPinChat" v-else>Desafixar a Conversa</b-dropdown-item>
                            <b-dropdown-item @click.stop="handleUnReadChat" v-if="chat.unreadCount === 0">Marcar como não lido
                            </b-dropdown-item>
                            <b-dropdown-item @click.stop="handleReadChat" v-if="chat.unreadCount !== 0">Marcar como lido
                            </b-dropdown-item>
                            <b-dropdown-item @click.stop="handleClearChat"
                                             v-if="user.canCreateOperator || user.superConfiguracao.operadorPodeExcluirMsg">
                                Limpar Conversa
                            </b-dropdown-item>
                            <b-dropdown-item @click.stop="handleDeleteChat"
                                             v-if="chat.isChat && user.canCreateOperator || user.superConfiguracao.operadorPodeExcluirMsg">
                                Deletar Conversa
                            </b-dropdown-item>
                        </b-dropdown>
                    </div>
                </div>
                <LoadingSpinner class="processing" v-else/>
            </div>
        </div>
    </div>
</template>

<script>
import TimeMsg from '../timeMsg/TimeMsg.vue';
import LastMsg from '../lastMsg/LastMsg.vue';
import Icons from '../icons/Icons.vue';
import NameChat from '../nameChat/NameChat.vue';
import Picture from '@/components/shared/picture/Picture.vue';
import PresenceChat from '@/components/shared/presenceChat/PresenceChat.vue';
import { mapMutations, mapState } from 'vuex';
import LoadingSpinner from '../../../../shared/loadingSpinner/LoadingSpinner.vue';

export default {
    name: 'ChatRow',
    components: {
        LoadingSpinner,
        Picture,
        TimeMsg,
        LastMsg,
        Icons,
        NameChat,
        PresenceChat
    },
    props: {
        chat: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            showMenuIcon: false,
            menuOpen: false,
            processing: false
        };
    },
    computed: {
        ...mapState(['activeChat', 'user'])
    },
    methods: {
        ...mapMutations(['SET_ACTIVE_CHAT']),

        handleClick () {
            this.SET_ACTIVE_CHAT(this.chat);
            if (this.chat.unreadCount > 0) {
                this.chat.seeChat();
            }
        },

        handleContextMenu () {
            this.$refs.dropdown.show();
        },

        handleHover (flag) {
            this.showMenuIcon = flag;
        },

        handleMenuShow () {
            this.menuOpen = true;
        },

        handleMenuHide () {
            this.menuOpen = false;
            this.showMenuIcon = false;
        },

        handlePinChat () {
            this.processing = true;
            this.chat.pinChat().finally(() => {
                this.processing = false;
            });
        },

        handleUnPinChat () {
            this.processing = true;
            this.chat.unPinChat().finally(() => {
                this.processing = false;
            });
        },

        handleUnReadChat () {
            this.processing = true;
            this.chat.markUnRead().finally(() => {
                this.processing = false;
            });
        },

        handleReadChat () {
            this.processing = true;
            this.chat.markRead().finally(() => {
                this.processing = false;
            });
        },

        handleDeleteChat () {
            this.processing = true;
            this.chat.deleteChat().finally(() => {
                this.processing = false;
            });
        },

        handleClearChat () {
            this.processing = true;
            this.chat.clearChat().finally(() => {
                this.processing = false;
            });
        }
    }
};
</script>

<style scoped>
.chat-row {
    display: flex;
    width: 100%;
}

.chat-row ::v-deep(.picture) {
    padding: 0 13px 0 15px;
    height: 73px;
    display: flex;
    align-items: center;
}

.chat-row ::v-deep(.picture) img {
    height: 49px;
    width: 49px;
    border-radius: 50%;
}

.chat-menu {
    height: 18px;
    position: absolute;
    right: 3px;
    border-top-right-radius: 5px;
    display: block;
    text-align: right;
    z-index: 999;
    width: 20px;
}

.chat-menu img {
    vertical-align: unset;
    filter: brightness(0.7);
}

.chat-menu ::v-deep(.dropdown-menu) {
    position: absolute;
    z-index: 1;
}

.chat-menu-open {
    width: 10px;
    min-width: 10px;
    max-width: 10px;
}

.row-info {
    color: #07bc4c;
}

.processing {
    margin: 5px;
}

.processing ::v-deep(.vg) {
    height: 15px;
    width: 15px;
}

.box-info-chat {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    justify-content: center;
    overflow: hidden;
    padding-right: 15px;
    border-top: 1px solid #f2f2f2 !important;
}
</style>
