<template>
    <div id="icons">
        <div id="unreadCount">
            <div v-if="countUnread">{{countUnread}}</div>
        </div>
    </div>
</template>

<script>
export default {
    name: "Icons",
    props: {
        chat: {
            type: Object,
            required: true
        }
    },
    data() {
        return {

        }
    },
    watch: {
        // 'chat.msgs': function () {
        //     console.log('mudou');
        //     this.qtdMsgs = this.countUnread();
        //     console.log(this.qtdMsgs)
        // }
    },
    computed: {
        countUnread() {
            ///console.log('CALCULANDO QUANDIDADE DE MSG NAO LIDA...')
            const chatsNaoLido = this.chat.msgs.filter((element) => {
                //console.log("element", element);
                //console.log(element.body ,element.ack);
                //return element.ack === -1 && element.id.fromMe === false
            });

            return chatsNaoLido.length;
        }
    }
};
</script>

<style scoped>
#unreadCount div {
    background: #09D261;
    color: #FFF;
    height: 20px;
    width: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 50%;
    font-size: 12px;
}
</style>