<template>
    <div class="message-in">
        <div class="message-in-container">
            <!-- Identificador de mensagens no grupo -->
            <div class="identify-msg-group p-2" v-if="activeChat.type === 'group'">
                <div v-if="msg.sender.name">
                    {{msg.sender.name}}
                </div>

                <div class="d-flex justify-content-between" v-else>
                    <span class="number">+{{msg.sender.id.replace('@c.us','')}}</span>
                    <span class="name">~{{msg.sender.pushname}}</span>
                </div>
            </div>

            <!-- Mensagem Encaminhada -->
            <ForwardedIndicator v-if="msg.isForwarded"/>

            <MessageText :msg="msg" v-if="isChat"/>
            <MessagePhoto :msg="msg" v-else-if="isImage"/>
            <MessageSticker :msg="msg" v-else-if="isSticker"/>
            <MessageVideo :msg="msg" v-else-if="isVideo"/>
            <MessageDocument :msg="msg" v-else-if="isDocument"/>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import MessageText from "@/components/shared/messageText/MessageText.vue";
    import MessagePhoto from "@/components/shared/messagePhoto/MessagePhoto.vue";
    import MessageSticker from "@/components/shared/messageSticker/MessageSticker.vue";
    import MessageVideo from '@/components/shared/messageVideo/VideoMessage.vue';
    import MessageDocument from "@/components/shared/messageDocument/MessageDocument";
    import ForwardedIndicator from "../forwardedIndicator/ForwardedIndicator";

    export default {
        name: "MessageIn",
        components: {
            ForwardedIndicator,
            MessageText,
            MessagePhoto,
            MessageSticker,
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
            ...mapState(['activeChat']),
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
            }
        }
    };
</script>

<style scoped>
    .identify-msg-group {
        font-size: 12px;
        font-weight: 500;
    }

    .name {
        color: rgba(0,0,0,.4) !important;
        margin-left: 8px;
    }

    .message-in {
        padding: 0 9%;
        margin-bottom: 8px;
        display: flex;
        justify-content: flex-start;
    }

    .message-in-container {
        box-shadow: 0 1px 0.5px rgba(0, 0, 0, .13);
        position: relative;
        background-color: #fff;
        border-radius: 7.5px;
    }
</style>