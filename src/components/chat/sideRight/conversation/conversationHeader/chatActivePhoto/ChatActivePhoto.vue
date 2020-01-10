<template>
    <transition mode="out-in" name="component-fade">
        <img key="user" src="@/assets/images/wpp-photo-user.svg" v-if="imgUser && picture === '' "/>

        <img key="group" src="@/assets/images/wpp-photo-group.svg" v-else-if="imgGroup && picture === '' "/>

        <img key="original" :src="picture" v-else/>
    </transition>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
    name: 'ChatActivePhoto',
    data () {
        return {
            imgUser: false,
            imgGroup: false,
            picture: ''
        };
    },
    computed: {
        ...mapState(['activeChat'])
    },
    watch: {
        'activeChat': function () {
            this.handleChatVisible();
        }
    },
    created () {
        this.handleChatVisible();
    },
    methods: {
        ...mapActions(['findPictureFromId']),

        handleChatVisible () {
            this.reset();

            this.findPictureFromId({ id: this.activeChat.id }).then(value => {
                this.picture = value;
            });
        },

        reset () {
            this.picture = '';
            if (this.activeChat.kind === 'group') {
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

<style>
</style>
