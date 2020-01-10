<template>
    <div class="contact" @click="handleClick">
        <Picture :id="contact.id"/>

        <div class="info">
            <div class="name">
                <div>
                    <span>{{contact.formattedName}}</span>
                </div>
            </div>

            <div class="stats">
                <div>
                    <span></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapMutations, mapState } from 'vuex';
import Picture from './picture/Picture';
export default {
    name: 'Contact',
    components: { Picture },
    props: {
        contact: {
            type: Object,
            required: true
        }
    },
    computed: {
        ...mapState(['chats'])
    },
    methods: {
        ...mapMutations(['SET_ACTIVE_CHAT']),
        ...mapActions(['findChatFromId']),

        handleClick () {
            this.findChatFromId({ id: this.contact.id }).then(chat => {
                this.SET_ACTIVE_CHAT(chat);
            });

            this.$root.$emit('showNewChat', false);
        }
    }
};
</script>

<style scoped>
.contact {
    background-color: #fff;
    cursor: pointer;
    display: flex;
    flex-direction: row;
    height: 72px;
    pointer-events: all;
    position: relative;
    flex:1;
    transition: background-color 0.2s;
}

.contact:hover {
    background-color: #f2f2f2;
}

.info {
    padding-right: 15px;
    border-top: 1px solid #f2f2f2;

    flex-grow: 1;
    flex-basis: 0;
    min-width: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
}

    .name {
        text-align: left;
        align-items: center;
        line-height: normal;
        display: flex;
    }

    .name div {
        color: #000;
        display: flex;
        flex-grow: 1;
        font-weight: 400;
        font-size: 17px;
        line-height: 21px;
        overflow: hidden;
    }

    .name div span {
        display: inherit;
        white-space: inherit;
        text-overflow: inherit;
        overflow: inherit;
        flex-grow: 1;
        overflow: hidden;
        position: relative;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
</style>
