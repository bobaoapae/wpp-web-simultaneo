<template>
   <div class="quoted-media">
      <img :src=" 'data:image/png;base64,'+body " v-if="body">
   </div>
</template>

<script>
export default {
    name: 'QuotedMedia',
    props: {
        body: {
            required: true
        }
    }
};
</script>

<style scoped>
   img {
      width: 58px;
      height: 58px;
      object-fit: cover;
      border-top-right-radius: 5px;
      border-bottom-right-radius: 5px;
   }
</style>
