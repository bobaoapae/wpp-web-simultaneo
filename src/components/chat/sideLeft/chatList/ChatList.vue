<template>
  <div id="chat-list">
    <div class="box-input-search">
      <input disabled placeholder="Procurar ou começar uma nova conversa" type="text"/>
    </div>

    <div class="box-list-group">
      <transition-group class="list-group" name="flip-list" tag="ul">
        <li
          :class="{ active : active_el === chat.id }"
          :key="chat.id"
          @click="handleClick(chat)"
          class="list-group-item d-flex"
          v-for="chat in chatsFiltered"
        >
          <ChatPhoto :chat="chat"/>

          <div class="box-info-chat">
            <div class="d-flex">
              <NameChat :chat="chat"/>
              <TimeMsg :chat="chat"/>
            </div>

            <div class="d-flex">
              <div v-if="showPresenceInfo(chat)" class="presenceInfo">
                <span v-if="isComposing(chat)">digitando...</span>
                <span v-if="isRecording(chat)">gravando áudio...</span>
              </div>
              <LastMsg v-if="!showPresenceInfo(chat)" :chat="chat"/>
              <Icons v-if="!showPresenceInfo(chat)" :chat="chat"/>
            </div>
          </div>
        </li>
      </transition-group>
    </div>
  </div>
</template>

<script>
import ChatPhoto from './chatPhoto/ChatPhoto.vue';
import TimeMsg from './timeMsg/TimeMsg.vue';
import LastMsg from './lastMsg/LastMsg.vue';
import Icons from './icons/Icons.vue';
import NameChat from './nameChat/NameChat.vue';

import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    name: 'ChatList',
    components: {
        ChatPhoto,
        TimeMsg,
        LastMsg,
        Icons,
        NameChat
    },
    data () {
        return {
            active_el: null
        };
    },
    computed: {
        ...mapState(['chats']),

        chatsFiltered () {
            return this.chats.filter(chat => {
                return chat.shouldAppearInList;
            });
        }
    },
    methods: {
        ...mapMutations(['SET_ACTIVE_CHAT']),
        ...mapActions(['seeChat']),

        handleClick (chat) {
            // seta o chat que sera visto
            this.SET_ACTIVE_CHAT(chat);
            // seta a cor do li do chat clicado
            this.active_el = chat.id;

            if (chat.unreadCount > 0) {
                this.visualizarMsgs(chat.id);
            }
        },

        visualizarMsgs (id) {
            this.seeChat({ chatId: id });
        },

        showPresenceInfo (chat) {
            return this.isChat(chat) && (this.isComposing(chat) || this.isRecording(chat));
        },

        isChat (chat) {
            return chat.kind === 'chat';
        },

        isOffline (chat) {
            return chat.presenceType === 'unavailable';
        },

        isOnline (chat) {
            return chat.presenceType === 'available';
        },

        isComposing (chat) {
            return chat.presenceType === 'composing';
        },

        isRecording (chat) {
            return chat.presenceType === 'recording';
        }
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

  .presenceInfo {
    color: #07bc4c;
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
