<template>
   <img :src="activeChat.picture" @error="handleError" alt="Photo Profile" v-if="imgOrigial"/>
   <img alt="Photo Profile" src="@/assets/images/wpp-photo-user.svg" v-else-if="imgUser"/>
   <img alt="Photo Profile" src="@/assets/images/wpp-photo-group.svg" v-else-if="imgGroup"/>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'ChatActivePhoto',
    data () {
        return {
            imgOrigial: true,
            imgUser: false,
            imgGroup: false
        };
    },
    computed: {
        ...mapState(['activeChat'])
    },
    watch: {
        'activeChat.picture': function () {
            this.resetState();
            // this.handleError();
        }
    },
    methods: {
        handleError () {
            this.imgOrigial = false;

            if (this.activeChat.kind === 'group') {
                this.imgUser = false;
                this.imgGroup = true;
            } else {
                this.imgUser = true;
                this.imgGroup = false;
            }
        },
        resetState () {
            this.imgOrigial = true;
            this.imgUser = false;
            this.imgGroup = false;
        }
    }
};
</script>

<style>
</style>
