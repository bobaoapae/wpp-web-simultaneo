<template>
    <div class="messages-private" >
        <div v-for="item in msgs" :key="item.id.id">
            <MessageOut :msg="item" v-if="item.id.fromMe"/>
            <MessageIn :msg="item" v-else />
        </div>
    </div>
</template>

<script>
    import MessageOut from "@/components/shared/messageOut/MessageOut.vue";
    import MessageIn from "@/components/shared/messageIn/MessageIn.vue";
    import api from '@/api.js'

    export default {
        name: "MessagesPrivate",
        components: {
            MessageOut,
            MessageIn
        },
        props: {
            msgs: {
                type: Array,
                required: true
            }
        },
        methods: {

        },
        created() {

        }
    };
</script>

<style scoped>


</style>