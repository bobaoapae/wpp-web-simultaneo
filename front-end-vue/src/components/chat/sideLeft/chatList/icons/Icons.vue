<template>
    <div id="icons">
        <div id="unreadCount">
            <div v-show="chat.unreadCount">{{chat.unreadCount}}</div>
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
    computed: {

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