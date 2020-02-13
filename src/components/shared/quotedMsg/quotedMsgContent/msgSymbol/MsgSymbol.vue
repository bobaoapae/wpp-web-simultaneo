<template>
   <div class="msg-symbol">
      <img src="@/assets/images/wpp-type-foto.svg" v-if="msg.isImage">

      <img src="@/assets/images/wpp-type-document.svg" v-else-if="msg.isDocument">

      <img src="@/assets/images/wpp-type-video.svg" v-else-if="msg.isVideo">

      <img src="@/assets/images/wpp-type-ptt-gray.svg" v-else-if="msg.isPtt && msg.id.fromMe">
      <img src="@/assets/images/wpp-type-ptt-blue.svg" v-else-if="msg.isPtt && msg.ack === 3">
      <img src="@/assets/images/wpp-type-ptt-green.svg" v-else-if="msg.isPtt">

      <img src="@/assets/images/wpp-type-audio.svg" v-else-if="msg.isAudio">
   </div>
</template>

<script>
export default {
    name: 'MsgSymbol',
    props: {
        msg: {
            required: true,
            type: Object
        }
    }
};
</script>

<style scoped>
   .msg-symbol img {
      margin-right: 3px;
   }
</style>
