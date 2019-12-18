<template>
   <div class="msg-type">
      <span v-if=" type === 'image' ">Foto</span>

      <span v-else-if=" type === 'video' ">Video</span>

      <span v-else-if=" type === 'ptt' ">Audio</span>

      <span v-else-if=" type === 'audio' ">Audio</span>
   </div>
</template>

<script>
export default {
    name: 'MsgType',
    props: {
        type: {
            required: true
        }
    }
};
</script>

<style scoped>
   .msg-type span {
      color: rgba(0, 0, 0, 0.6);
      font-size: 13.2px;
   }
</style>
