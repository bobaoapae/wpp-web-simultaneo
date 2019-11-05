<template>
    <div class="messages-group">
        <div v-for="item in msgs" :key="item.id.id">
            <MessageOut :msg="item" v-if="item.id.fromMe"/>
            <MessageIn :msg="item" v-else />
        </div>
    </div>
</template>

<script>
    import MessageOut from "@/components/shared/messageOut/MessageOut.vue";
    import MessageIn from "@/components/shared/messageIn/MessageIn.vue";

    export default {
        name: "MessagesGroup",
        components: {
            MessageOut,
            MessageIn
        },
        props: {
            msgs: {
                type: Array,
                required: true
            }
        }
    };
</script>

<style scoped>


</style>