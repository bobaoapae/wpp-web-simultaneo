<template>
    <div class="input-search">
        <div class="input-search-container">
            <button>
                <div>
                    <span class="" data-icon="search">
                        <svg height="24" id="Layer_1" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M15.009 13.805h-.636l-.22-.219a5.184 5.184 0 0 0 1.256-3.386 5.207 5.207 0 1 0-5.207 5.208 5.183 5.183 0 0 0 3.385-1.255l.221.22v.635l4.004 3.999 1.194-1.195-3.997-4.007zm-4.808 0a3.605 3.605 0 1 1 0-7.21 3.605 3.605 0 0 1 0 7.21z"
                                fill="#263238"
                                fill-opacity=".3">

                            </path>
                        </svg>
                    </span>
                </div>
            </button>

            <div class="input-label" v-show="!filter">Buscar contatos</div>

            <label for="search">
                <input v-model="filter" id="search" title="Buscar contatos" type="search">
            </label>
        </div>
    </div>
    <div class="list-contact">
        <div class="list-contact-container">
            <ul>
                <RecycleScroller
                    class="scroller"
                    :items="contactsFiltered"
                    :item-size="73"
                    key-field="id"
                    v-slot="{ item }"
                >
                    <li :key="item.id">
                        <Contact :contact="item" @chatClick="handleChatClick"/>
                    </li>
                </RecycleScroller>
            </ul>
        </div>
    </div>
</template>

<script>
import { mapState } from 'vuex';
import Contact from './contact/Contact';
import { sort } from 'fast-sort';

export default {
    name: 'ListContact',
    components: { Contact },
    data () {
        return {
            filter: ''
        };
    },
    emits: ['chatClick'],
    computed: {
        ...mapState(['contacts']),

        contactsFiltered () {
            let contacts = this.contacts.filter(value => value.isMyContact);

            if (this.filter !== '') {
                contacts = contacts.filter(contact => {
                    return contact.formattedName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(this.filter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) ||
                        contact.id.replace('@c.us', '').includes(this.filter);
                });
            }

            return sort(contacts).asc(contact => contact.formattedName);
        }
    },
    methods: {
        handleChatClick (chat) {
            this.$emit('chatClick', chat);
        }
    }
};
</script>

<style scoped>
.input-search-container {
    height: 49px;
    box-sizing: border-box;
    flex: none;
    position: relative;
}

label {
    left: 12px;
    padding-left: 65px;
    padding-right: 32px;
    right: 14px;
    background-color: #fff;
    border-radius: 18px;
    align-items: center;
    box-sizing: border-box;
    display: flex;
    height: 35px;
    position: absolute;
    top: 7px;
}

input {
    border: none;
    padding: 0;
    font-size: 15px;
    font-weight: 400;
    line-height: 20px;
    min-height: 20px;
    outline: none;
    -webkit-user-select: text;
    -moz-user-select: text;
    -ms-user-select: text;
    user-select: text;
    width: 100%;
    z-index: 1;
}

button {
    left: 24px;
    height: 24px;
    position: absolute;
    top: 11px;
    width: 24px;
    z-index: 100;
    outline: none;
    border: 0;
    padding: 0;
    background: none;
    cursor: pointer;
    font-family: Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif;
    margin: 0;
}

.input-label {
    left: 77px;
    right: 24px;
    color: #999;
    font-size: 14px;
    height: 20px;
    line-height: 20px;
    overflow: hidden;
    pointer-events: none;
    position: absolute;
    text-overflow: ellipsis;
    top: 15px;
    transition: opacity .14s linear;
    white-space: nowrap;
    z-index: 100;
}

.list-contact-container {
    overflow: hidden;
}

.scroller {
    max-height: calc(100vh - 157px);
}

ul {
    background-color: #f7f7f7;
    max-height: calc(100vh - 157px);
    overflow-y: scroll;
    overflow-x: hidden;
    margin: 0;
    padding: 0;
    list-style: none;
}

li {
    height: 72px;
    display: flex;
    align-items: center;
}

@media (min-width: 1441px) {
    ul {
        max-height: calc(100vh - 195px);
    }

    .scroller {
        max-height: calc(100vh - 195px);
    }
}
</style>
