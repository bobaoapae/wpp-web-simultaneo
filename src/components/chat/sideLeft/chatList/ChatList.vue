<template>
    <div id="chat-list">
        <div class="box-input-search">
            <input placeholder="Procurar" style="outline: none;" type="text"
                   @keydown.exact.esc="handleEscPress" @input="handleInput"/>
        </div>

        <div class="chat-filter-container">
            <div class="chat-filter">
                <ul>
                    <li :class="{'selected': showOnlyMyChats}" @click="handleClickFilterMyChats">Minhas
                        ({{ myChatsUnread }})
                    </li>
                    <li :class="{'selected': !showOnlyMyChats}" @click="handleClickFilterAllChats">Todas
                        ({{ allChatsUnread }})
                    </li>
                </ul>
            </div>
            <div class="chat-filter-icon">
                <img width="12" src="@/assets/images/filter-icon.svg"/>
                <span>Filtros</span>
            </div>
        </div>

        <div class="box-list-group">
            <RecycleScroller
                :key="recycleScrollerKey"
                class="scroller"
                :items="chatsFiltered"
                :item-size="73"
                key-field="id"
                v-slot="{ item }"
            >
                <li
                    :class="{ active : item === activeChat }"
                    :key="item.id"
                    class="list-group-item d-flex"
                >
                    <ChatRow :chat="item"/>
                </li>
            </RecycleScroller>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import ChatRow from './chatRow/ChatRow.vue';

export default {
    name: 'ChatList',
    components: {
        ChatRow
    },
    data () {
        return {
            active_el: null,
            inputFilter: '',
            showOnlyMyChats: false
        };
    },
    async mounted () {
        await this.updateMyChats();
    },
    computed: {
        ...mapState(['chats', 'activeChat', 'user', 'myChats']),

        chatsFiltered () {
            let chats = this.showOnlyMyChats ? this.myChats : this.chats;
            let chatVisible = chats.filter(chat => {
                return chat.shouldAppearInList && !chat.archive;
            });

            if (this.inputFilter) {
                chatVisible = chatVisible.filter(chat => {
                    return chat.formattedTitle.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(this.inputFilter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) ||
                        chat.id.replace('@c.us', '').includes(this.inputFilter.toLowerCase());
                });
            }

            return chatVisible;
        },

        myChatsUnread () {
            return this.myChats.filter(value => value.unreadCount !== 0).length;
        },

        allChatsUnread () {
            return this.chats.filter(value => value.unreadCount !== 0).length;
        },

        recycleScrollerKey () {
            return this.showOnlyMyChats + this.inputFilter;
        }
    },
    methods: {
        ...mapActions(['getChatsWithProperty', 'updateMyChats']),

        handleInput (val) {
            this.inputFilter = val;
        },

        handleEscPress () {
            this.inputFilter = '';
        },

        handleClickFilterMyChats () {
            this.showOnlyMyChats = true;
        },

        handleClickFilterAllChats () {
            this.showOnlyMyChats = false;
        }
    }
};
</script>

<style scoped>
.scroller {
    max-height: calc(100vh - 193px);
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
        max-height: calc(100vh - 234px);
        overflow-y: scroll;
        overflow-x: hidden;
    }
}

.chat-filter-container {
    margin-top: 0.2rem;
    margin-bottom: 0.2rem;
    border-top: 1px solid #f2f2f2 !important;
    border-bottom: 1px solid #f2f2f2 !important;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-evenly;
    align-items: flex-start;
}

.chat-filter {
    display: flex;
    margin-left: 0.4rem;
    margin-top: 0.4rem;
    padding-top: 1rem;
    margin-bottom: 0.4rem;
    border-radius: 4px;
    justify-content: left;
}

.chat-filter ul {
    list-style-type: none;
    align-content: center;
    user-select: none;
    padding: 0.3rem 0;
}

.chat-filter ul li {
    display: inline;
    color: #fff;
    background-color: #7BC4BA;
    padding: 0.8rem 2rem;
    border-radius: 7px;
    margin: 0.4rem 1rem;
}

.chat-filter ul li:hover {
    cursor: pointer;
}

.chat-filter ul li.selected {
    background-color: #5A9E95;
}

.chat-filter-icon {
    display: flex;
    padding-top: 1rem;
    align-items: center;
    color: #757575;
}

.chat-filter-icon span {
    margin-left: 0.3rem;
}
</style>
