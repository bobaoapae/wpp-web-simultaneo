<template>
    <div class="last-msg flex-grow-1 d-flex align-items-center" :class="{unread : isUnread}" v-if="lastMsg">
        <MessageIconStatus :ack="lastMsg.ack" class="icon-status"/>

        <span v-if="isGroup && lastMsg.sender">
            {{lastMsg.sender.name || '+'+lastMsg.sender.id.replace('@c.us', '')}}:
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
    // ptt = audio
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
    .last-msg {
        overflow: hidden;
    }

    .last-msg span {
        color: rgba(0, 0, 0, 0.4);
        font-size: 14px;
    }

    .icon-status {
        margin-right: 3px;
    }

    .unread span {
        color: rgba(0, 0, 0, 0.8) !important;
        font-weight: 500 !important;
    }
</style>