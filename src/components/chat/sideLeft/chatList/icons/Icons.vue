<template>
   <div class="icons">
      <div class="mute" v-show="chat.muteExpiration > 0">
         <img src="@/assets/images/wpp-icon-mute.svg">
      </div>

      <div class="pin" v-show="chat.pin > 0">
         <img src="@/assets/images/wpp-icon-pin.svg">
      </div>

      <div class="unreadCount" v-show="chat.unreadCount">
         <span>{{chat.unreadCount}}</span>
      </div>
   </div>
</template>

<script>
export default {
  name: 'Icons',
  props: {
    chat: {
      type: Object,
      required: true
    }
  },
  data () {
    return {};
  },
  computed: {}
};
</script>

<style scoped>
   .icons {
      display: flex;
      align-items: center;
   }

   .mute {
      display: flex;
      align-items: center;
      margin-left: 3px;
   }

   .pin {
      display: flex;
      align-items: center;
      margin-left: 3px;
   }

   .unreadCount {
      display: flex;
      align-items: center;
      justify-content: center;

      margin-left: 3px;
      min-width: 18px;
      min-height: 18px;
      padding: 0 5px;

      border-radius: 12px;
      background: #09D261;
      color: #FFF;
      font-size: 12px;
      font-weight: 500;
   }
</style>
