<template>
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
    computed: {
        ...mapState(['contacts']),

        contactsFiltered () {
            let contacts = this.contacts;

            if (this.filter !== '') {
                contacts = contacts.filter(contact => {
                    return contact.formattedName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').includes(this.filter.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '')) ||
                        contact.id.replace('@c.us', '').includes(this.filter);
                });
            }

            return sort(contacts).asc(contact => contact.formattedName);
        }
    },
    mounted () {
        this.$root.$on('searchNewChat', data => {
            this.filter = data;
        });
    },
    methods: {
        handleChatClick (chat) {
            this.$emit('chatClick', chat);
        }
    }
};
</script>

<style scoped>
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
