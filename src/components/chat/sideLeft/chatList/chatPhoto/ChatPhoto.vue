<template>
    <div class="box-photo-chat" v-b-visible.once="handlePicture">
        <transition name="component-fade" mode="out-in">
            <img key="user" src="@/assets/images/wpp-photo-user.svg" v-if="isChat && !chat.picture"/>

            <img key="group" src="@/assets/images/wpp-photo-group.svg" v-else-if="isGroup && !chat.picture"/>

            <img key="original" :src="chat.picture" v-else/>
        </transition>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'

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

        watch: {
            "chat.picture": function (val) {
                if (val === "") {

                    if (this.chat.kind === "group") {
                        this.imgGroup = true;
                        this.imgUser = false;
                    } else {
                        this.imgGroup = false;
                        this.imgUser = true;
                    }

                }
            }
        },
        computed: {
            isGroup() {
                return this.chat.kind === "group";
            },

            isChat() {
                return this.chat.kind === "chat";
            }
        },
        methods: {
            ...mapActions(['getPicture']),

            handlePicture() {
                this.getPicture({
                    chatId: this.chat.id
                })
            },


        }
    };
</script>

<style scoped>
    .component-fade-enter-active, .component-fade-leave-active {
        transition: opacity 0.08s ease;
    }

    .component-fade-enter, .component-fade-leave-to {
        opacity: 0;
    }


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