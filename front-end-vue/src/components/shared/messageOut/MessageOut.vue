<template>
    <div class="message-out">
        <div class="message-out-container">
            <MessageText :msg="msg" v-if=" isChat "/>
            <MessagePhoto :msg="msg" v-else-if="isImage"/>
            <MessageSticker :msg="msg" v-else-if="isSticker"/>
        </div>
    </div>
</template>

<script>
    import MessageText from "@/components/shared/messageText/MessageText.vue";
    import MessagePhoto from "@/components/shared/messagePhoto/MessagePhoto.vue";
    import MessageSticker from "../messageSticker/MessageSticker";

    export default {
        name: "MessageOut",
        components: {
            MessageSticker,
            MessageText,
            MessagePhoto
        },
        props: {
            msg: {
                type: Object,
                required: true
            }
        },
        computed: {
            isChat() {
                return this.msg.type === "chat";
            },
            isImage() {
                return this.msg.type === "image";
            },
            isSticker() {
                console.log(this.msg.type);
                return this.msg.type === 'sticker'
            }
        }
    };
</script>

<style scoped>
    .message-out {
        padding: 0 9%;
        margin-bottom: 8px;
        display: flex;
        justify-content: flex-end;
    }

    .message-out-container {
        box-shadow: 0 1px 0.5px rgba(0, 0, 0, .13);
        position: relative;
        background-color: #DCF8C6;
        border-radius: 7.5px;
    }
</style>