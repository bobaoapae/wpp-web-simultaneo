<template>
    <img :src="activeChat.picture" alt="Photo Profile" @error="handleError" v-if="imgOrigial" />
    <img src="@/assets/images/wpp-photo-user.svg" alt="Photo Profile" v-else-if="imgUser" />
    <img src="@/assets/images/wpp-photo-group.svg" alt="Photo Profile" v-else-if="imgGroup" />
</template>

<script>
import { mapState } from "vuex";

export default {
    name: "ChatActivePhoto",
    data() {
        return {
            imgOrigial: true,
            imgUser: false,
            imgGroup: false
        };
    },
    computed: {
        ...mapState(["activeChat"])
    },
    watch: {
        "activeChat.picture": function() {
            this.resetState();
            //this.handleError();
        }
    },
    methods: {
        handleError() {
            this.imgOrigial = false;

            if (this.activeChat.type === "group") {
                this.imgUser = false;
                this.imgGroup = true;
            } else {
                this.imgUser = true;
                this.imgGroup = false;
            }
        },
        resetState() {
            this.imgOrigial = true;
            this.imgUser = false;
            this.imgGroup = false;
        }
    }
};
</script>

<style>
</style>