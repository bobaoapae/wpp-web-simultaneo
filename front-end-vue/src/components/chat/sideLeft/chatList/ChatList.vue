<template>
    <div id="chat-list">
        <div class="box-input-search">
            <input type="text" placeholder="Procurar ou começar uma nova conversa" disabled />
        </div>

        <div class="box-list-group">
            <transition-group name="flip-list" tag="ul" class="list-group">
                <li
                    class="list-group-item d-flex"
                    v-for="chat in chats"
                    :key="chat.id"
                    @click="handleClick(chat)"
                    :class="{ active : active_el === chat.id }"
                >
                    <ChatPhoto :chat="chat" />

                    <div class="box-info-chat">
                        <div class="d-flex">
                            <NameChat :chat="chat" />
                            <TimeMsg :chat="chat" />
                        </div>

                        <div class="d-flex">
                            <LastMsg :chat="chat"/>
                            <Icons :chat="chat" />
                        </div>
                    </div>
                </li>
            </transition-group>
        </div>
    </div>
</template>

<script>
import ChatPhoto from "./chatPhoto/ChatPhoto.vue";
import TimeMsg from "./timeMsg/TimeMsg.vue";
import LastMsg from "./lastMsg/LastMsg.vue";
import Icons from "./icons/Icons.vue";
import NameChat from "./nameChat/NameChat.vue";

import { mapState, mapMutations } from "vuex";

import api from '@/api.js';

export default {
    name: "ChatList",
    components: {
        ChatPhoto,
        TimeMsg,
        LastMsg,
        Icons,
        NameChat
    },
    data() {
        return {
            active_el: null,
        };
    },
    computed: {
        ...mapState(["chats"])
    },
    methods: {
        ...mapMutations(["SET_ACTIVE_CHAT"]),
        handleClick(chat) {
            console.log(chat);
            // console.log("SET ACTIVE", chat);
            // seta o chat que sera visto
            this.SET_ACTIVE_CHAT(chat);
            // seta a cor do li do chat clicado
            this.active_el = chat.id;

            this.visualizarMsgs(chat.id);
        },
        visualizarMsgs(id) {
            api.post(`/api/whatsApp/sendSeenChat/${id}`);
            console.log('visualizar msgs...')
        },
    }
};
</script>

<style scoped>
.active {
    background: #e9ebeb !important;
}

.flip-list-move {
    transition: transform 0.3s !important;
}

#chat-list {
    background: #fff;
    flex-grow: 1;
}

.box-input-search {
    background: #f8f8f8;
    padding: 5px 15px;
}

.box-input-search input {
    width: 100%;
    background: #fff;
    border-radius: 18px;
    height: 35px;
    border: none;
    padding: 0 25px;
}

.box-list-group {
    max-height: calc(100vh - 105px);
    overflow-y: scroll;
    overflow-x: hidden;
}

.list-group-item {
    padding: 0;
    cursor: pointer;
    border: none;
    transition: background 0.2s;
}

.list-group-item:hover {
    background: #f4f5f5;
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

@media screen and (min-width: 1441px) {
    .box-list-group {
        max-height: calc(100vh - 143px);
        overflow-y: scroll;
        overflow-x: hidden;
    }
}
</style>