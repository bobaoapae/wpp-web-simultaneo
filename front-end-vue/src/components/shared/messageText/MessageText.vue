<template>
    <div class="text-container">

        <div class="message-text">
            <span>{{msg.body}}</span>
        </div>

        <MessageTime :msg="msg"/>

    </div>
</template>

<script>
    import MessageIconStatus from "../messageIconStatus/MessageIconStatus";
    import MessageTime from "../messageTime/MessageTime";

    export default {
        name: "MessageText",
        components: {
            MessageTime,
            MessageIconStatus
        },
        props: {
            msg: {
                type: Object,
                required: true
            }
        }
    };
</script>

<style scoped>
    .text-container {
        min-width: 100px;
        max-width: 500px;
    }

    .message-text {
        padding: 6px 7px 8px 9px;
    }

    .message-text span {
        margin-right: 55px;
        white-space: pre-wrap;
        word-wrap: break-word;
    }
</style>