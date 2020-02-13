<template>
   <div class="msg-type">
      <span v-if="msg.isImage">Foto</span>

      <span v-else-if="msg.isVideo">Video</span>

      <span v-else-if="msg.isAudio || msg.isPtt">Audio</span>
   </div>
</template>

<script>
export default {
    name: 'MsgType',
    props: {
        msg: {
            type: Object,
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
