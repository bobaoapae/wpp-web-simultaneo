<template>
   <header class="header">
      <div class="box-photo-profile">
         <img
            :src="self.picture"
            alt="User profile photo"
            class="photo-profile"
            v-if="self.picture"
         />

         <img
            alt="User profile photo"
            class="photo-profile"
            src="@/assets/images/wpp-photo-user.svg"
            v-else
         >
      </div>

      <div class="box-icons">
         <img src="@/assets/images/wpp-icon-status.svg"/>
         <img src="@/assets/images/wpp-icon-message.svg" @click="handleClick"/>
         <img src="@/assets/images/wpp-icon-kebab-menu.svg"/>
      </div>
   </header>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'LeftHeader',
    computed: {
        ...mapState(['self'])
    },
    methods: {
        handleClick () {
            this.$root.$emit('showNewChat', true);
        }
    }
};
</script>

<style scoped>
   .header {
      display: flex;
      background: #EEEEEE;
      padding: 10px 16px;
   }

   .box-icons {
      flex: 1;
      display: flex;
      justify-content: flex-end;
      align-items: center;
   }

   .box-icons img {
      cursor: pointer;
      padding: 8px;
      margin-left: 10px;
   }

   .photo-profile {
      cursor: pointer;
      height: 40px;
      width: 40px;
      border-radius: 50%;
      object-fit: cover;
   }
</style>
