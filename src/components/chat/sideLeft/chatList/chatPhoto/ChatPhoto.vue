<template>
   <div class="box-photo-chat" v-b-visible.once="handleChatVisible">
      <transition mode="out-in" name="component-fade">
         <img key="user" src="@/assets/images/wpp-photo-user.svg" v-if="isChat && !picture"/>

         <img key="group" src="@/assets/images/wpp-photo-group.svg" v-else-if="isGroup && !picture"/>

         <img key="original" :src="picture" v-else/>
      </transition>
   </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {

    name: 'ChatPhoto',
    data () {
        return {
            picture: ''
        };
    },
    props: {
        chat: {
            type: Object,
            required: true
        }
    },
    computed: {
        isGroup () {
            return this.chat.kind === 'group';
        },

        isChat () {
            return this.chat.kind === 'chat';
        }
    },
    methods: {
        ...mapActions(['subscribePresence', 'findPictureFromId']),

        handleChatVisible (visible) {
            if (visible) {
                this.subscribePresence({ chatId: this.chat.id });

                this.findPictureFromId({ id: this.chat.id }).then(value => {
                    this.picture = value;
                });
            }
        }

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
