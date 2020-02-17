<template>
  <div id="chat-list">
    <div class="box-input-search">
      <input style="outline: none;" placeholder="Procurar" type="text" v-model="inputFilter"/>
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
              <div v-if="chat.isChat && (chat.isComposing || chat.isRecording)" class="presenceInfo">
                <span v-if="chat.isComposing">digitando...</span>
                <span v-if="chat.isRecording">gravando áudio...</span>
              </div>
              <LastMsg v-if="!chat.isChat || (!chat.isComposing && !chat.isRecording)" :chat="chat"/>
              <Icons v-if="!chat.isChat || (!chat.isComposing && !chat.isRecording)" :chat="chat"/>
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
            active_el: null,
            inputFilter: ''
        };
    },
    computed: {
        ...mapState(['chats']),

        chatsFiltered () {
            const chatVisible = this.chats.filter(chat => {
                return chat.shouldAppearInList;
            });

            if (this.inputFilter === '') {
                return chatVisible;
            }

            return chatVisible.filter(chat => {
                return chat.formattedTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(this.inputFilter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) ||
                    chat.id.replace('@c.us', '').includes(this.inputFilter.toLowerCase());
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
      max-height: calc(100vh - 147px);
      overflow-y: scroll;
      overflow-x: hidden;
    }
  }
</style>
