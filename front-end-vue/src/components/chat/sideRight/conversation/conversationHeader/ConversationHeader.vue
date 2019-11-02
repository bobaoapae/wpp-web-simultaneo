<template>
    <div id="conversation-header">
        <div class="box-img">
            <ChatActivePhoto />
        </div>

        <div class="box-info">
            <div class="nome">
                {{activeChat.contact.name || "+"+activeChat.id.replace('@c.us','')}}
            </div>

            <div class="info">
            
            </div>
        </div>

        <div class="box-icons">
            <img src="@/assets/images/wpp-icon-search.svg">
            <img src="@/assets/images/wpp-icon-clip.svg">
            <img src="@/assets/images/wpp-icon-kebab-menu.svg">
        </div>
        
    </div>
</template>

<script>
import {mapState} from 'vuex'

import ChatActivePhoto from './chatActivePhoto/ChatActivePhoto.vue'

export default {
    name: "ConversationHeader",
    components: {
        ChatActivePhoto
    },
    computed: {
        ...mapState(['activeChat'])
    },
    created() {
        console.log('activeChat', this.activeChat);
    }
};
</script>

<style scoped>
#conversation-header {
    background: #eee;
    display: flex;
    padding: 10px 16px;
}

.box-img {
    padding-right: 15px;
    display: flex;
    align-items: center;
}

.box-img img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.box-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
}

.box-info .nome {
    font-size: 16px;
    color: #000000;
}

.box-info .info {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.6);
}

.box-icons img {
    cursor: pointer;
    padding: 8px;
    margin-left: 10px
}
</style>