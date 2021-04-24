<template>
    <div id="chat-list">
        <div class="box-input-search">
            <input placeholder="Procurar" style="outline: none;" type="text" v-model.trim="inputData"
                   @keydown.exact.esc="handleEscPress" v-debounce:200ms.lock="handleInput"/>
        </div>

        <div class="box-list-group">
            <RecycleScroller
                class="scroller"
                :items="chatsFiltered"
                :item-size="73"
                key-field="id"
                v-slot="{ item }"
                v-if="!inputFilter"
            >
                <li
                    :class="{ active : item === activeChat }"
                    :key="item.id"
                    class="list-group-item d-flex"
                >
                    <ChatRow :chat="item"/>
                </li>
            </RecycleScroller>
            <ul class="list-group" v-else>
                <li
                    :class="{ active : chat === activeChat }"
                    :key="chat.id"
                    class="list-group-item d-flex"
                    v-for="chat in chatsFiltered"
                >
                    <ChatRow :chat="chat"/>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import ChatRow from './chatRow/ChatRow';

export default {
    name: 'ChatList',
    components: {
        ChatRow
    },
    data () {
        return {
            active_el: null,
            inputFilter: '',
            inputData: ''
        };
    },
    computed: {
        ...mapState(['chats', 'activeChat']),

        chatsFiltered () {
            const chatVisible = this.chats.filter(chat => {
                return chat.shouldAppearInList && !chat.archive;
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
        handleInput () {
            this.inputFilter = this.inputData;
        },

        handleEscPress () {
            this.inputData = '';
            this.inputFilter = '';
        }
    }
};
</script>

<style scoped>
.scroller {
    max-height: calc(100vh - 147px);
}

.active {
    background: #e9ebeb !important;
}

.flip-list-move {
    transition: transform 0.3s !important;
}

.presence-chat-container {
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
    max-height: calc(100vh - 109px);
    overflow-y: scroll;
    overflow-x: hidden;
    transition: transform 0.2s;
}

.box-list-group >>>

.list-group-item {
    padding: 0;
    cursor: pointer;
    border: none;
    transition: background 0.1s;
}

.list-group-item:hover {
    background: #f4f5f5;
}

@media screen and (min-width: 1441px) {
    .box-list-group {
        max-height: calc(100vh - 147px);
        overflow-y: scroll;
        overflow-x: hidden;
    }
}
</style>
