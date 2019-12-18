<template>
   <div class="msg-symbol">
      <img src="@/assets/images/wpp-type-foto.svg" v-if=" type === 'image' ">

      <img src="@/assets/images/wpp-type-document.svg" v-else-if=" type === 'document' ">

      <img src="@/assets/images/wpp-type-video.svg" v-else-if=" type === 'video' ">

      <img src="@/assets/images/wpp-type-ptt-blue.svg" v-else-if=" type === 'ptt' ">

      <img src="@/assets/images/wpp-type-audio.svg" v-else-if=" type === 'audio' ">
   </div>
</template>

<script>
export default {
    name: 'MsgSymbol',
    props: {
        type: {
            required: true,
            type: String
        }
    }
};
</script>

<style scoped>
   .msg-symbol img {
      margin-right: 3px;
   }
</style>
