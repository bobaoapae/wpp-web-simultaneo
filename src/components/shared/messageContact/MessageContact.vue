<template>
    <div class="contact-container">
        <div class="contact">
            <Picture :id="vCardChatId"/>
            <div v-html="filters.emojify(msg.vCard.fn[0].value)" class="contact-name"></div>
            <MessageTime :msg="msg"/>
        </div>
        <hr/>
        <div class="buttons">
            <button @click="handleClick" class="btn btn-link">Enviar mensagem</button>
        </div>
    </div>
</template>

<script>
import filters from '@/filters';

import Picture from '../picture/Picture';
import MessageTime from '../messageTime/MessageTime';
import { mapActions, mapMutations } from 'vuex';

export default {
    name: 'MessageContact',
    components: {
        Picture,
        MessageTime
    },
    props: {
        msg: {
            type: Object,
            required: true
        }
    },
    computed: {
        vCardChatId () {
            for (let tel in this.msg.vCard.tel) {
                if (this.msg.vCard.tel[tel].meta && this.msg.vCard.tel[tel].meta.waid) {
                    return this.msg.vCard.tel[tel].meta.waid[0] + '@c.us';
                }
            }
            return '';
        }
    },
    data () {
        return {
            filters
        };
    },
    methods: {
        ...mapMutations(['SET_ACTIVE_CHAT']),
        ...mapActions(['findChatFromId']),

        handleClick () {
            this.findChatFromId({ id: this.vCardChatId }).then(chat => {
                this.SET_ACTIVE_CHAT(chat);
            });
        }
    }
};
</script>

<style scoped>
.contact {
    align-items: center;
    display: flex;
    height: 60px;
    position: relative;
    margin-left: 6px;
    margin-right: 8px;
    box-sizing: border-box;
    width: 336px;
}

.contact-name {
    color: #303030;
    font-size: 14px;
    font-weight: 600;
    line-height: 22px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.buttons {
    display: flex;
    width: 100%;
    justify-content: space-evenly;
}

.buttons button {
    flex-grow: 1;
    font-size: 14px;
    line-height: 20px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    text-decoration: none;
}

hr {
    width: 95%;
    text-align: center;
    margin-top: 0;
    margin-bottom: 1rem;
}
</style>
