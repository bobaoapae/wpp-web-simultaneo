<template>
    <div class="message-out">
        <div class="message-out-container">
            <!-- Mensagem Encaminhada -->
            <ForwardedIndicator v-if="msg.isForwarded"/>

            <MessageText :msg="msg" v-if=" isChat "/>
            <MessagePhoto :msg="msg" v-else-if="isImage"/>
            <MessageSticker :msg="msg" v-else-if="isSticker"/>
            <MessageVideo :msg="msg" v-else-if="isVideo"/>
            <MessageDocument :msg="msg" v-else-if="isDocument"/>
            <MessageAudio :msg="msg" v-else-if="isAudio" />
        </div>
    </div>
</template>

<script>
    import MessageText from "@/components/shared/messageText/MessageText.vue";
    import MessagePhoto from "@/components/shared/messagePhoto/MessagePhoto.vue";
    import MessageSticker from "@/components/shared/messageSticker/MessageSticker";
    import MessageVideo from '@/components/shared/messageVideo/VideoMessage.vue';
    import MessageDocument from "@/components/shared/messageDocument/MessageDocument";
    import ForwardedIndicator from "@/components/shared/forwardedIndicator/ForwardedIndicator";
    import MessageAudio from "@/components/shared/messageAudio/MessageAudio";

    export default {
        name: "MessageOut",
        components: {
            MessageAudio,
            ForwardedIndicator,
            MessageSticker,
            MessageText,
            MessagePhoto,
            MessageVideo,
            MessageDocument
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
                return this.msg.type === 'sticker'
            },
            isVideo() {
                return this.msg.type === 'video';
            },
            isDocument() {
                return this.msg.type === 'document';
            },
            isAudio() {
                return this.msg.type === 'ptt'
            },
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