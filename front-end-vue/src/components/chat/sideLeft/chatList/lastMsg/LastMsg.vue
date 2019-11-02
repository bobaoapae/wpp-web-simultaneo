<template>
    <div id="last-msg" class="flex-grow-1" :class="{unread : isUnread}">
        <MessageIconStatus :ack="lastMsg.ack"/>

        <span v-if="isGroup && lastMsg.sender">
            {{lastMsg.sender.name || lastMsg.sender.id}}:
        </span>

        <MessageBody :lastMsg="lastMsg"/>
    </div>
</template>

<script>
    // TODOS
    // chat
    // image
    // audio
    // sticker
    // video
    // ptt = documento
    // document
    // revoked = Mensagem apagada
    // e2e_notification = O código de segurança de ... mudou.

    // GRUPO
    // gp2 = ... saiu do grupo

    // USUARIO
    // call_log = log de chamada


    //vcard
    //notification_template
    //broadcast_notification

    import MessageBody from './messageBody/MessageBody.vue';
    import MessageIconStatus from "@/components/shared/messageIconStatus/MessageIconStatus.vue";

    export default {
        name: "LastMsg",
        components: {
            MessageIconStatus,
            MessageBody,
        },
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
        created() {

        },
        watch: {

        },
        computed: {
            isUnread() {
                return this.chat.unreadCount > 0;
            },
            isGroup() {
                return this.chat.type === 'group';
            },
            lastMsg() {
                const msgsFiltered = this.chat.msgs.filter((element) => {
                    return element.ack !== undefined;
                });

                return msgsFiltered[msgsFiltered.length - 1];
            }
        },
        methods: {

        }
    };
</script>

<style scoped>
    #last-msg {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    #last-msg span {
        color: rgba(0, 0, 0, 0.4);
        font-size: 14px;
    }

    .unread span {
        color: rgba(0, 0, 0, 0.8) !important;
        font-weight: 500 !important;
    }
</style>