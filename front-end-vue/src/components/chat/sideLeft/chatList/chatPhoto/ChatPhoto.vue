<template>
    <div class="box-photo-chat">
        <img :src="chat.picture" @error="handleError" v-if="imgOriginal" />

        <img src="@/assets/images/wpp-photo-group.svg" v-else-if="imgGroup" />

        <img src="@/assets/images/wpp-photo-user.svg" v-else-if="imgUser" />
    </div>
</template>

<script>

export default {
    name: "ChatPhoto",
    data() {
        return {
            imgOriginal: true,
            imgGroup: false,
            imgUser: false
        };
    },
    props: {
        chat: {
            type: Object,
            required: true
        }
    },
    methods: {
        handleError() {
            this.imgOriginal = false;
            if (this.chat.id.length > 20) {
                this.imgGroup = true;
                this.imgUser = false;
            } else {
                this.imgGroup = false;
                this.imgUser = true;
            }
        }
    }
};
</script>

<style scoped>
.box-photo-chat {
    padding: 0 13px 0 15px;
    height: 73px;
    display: flex;
    align-items: center;
}

.box-photo-chat img {
    height: 50px;
    width: 50px;
    border-radius: 50%;
}
</style>