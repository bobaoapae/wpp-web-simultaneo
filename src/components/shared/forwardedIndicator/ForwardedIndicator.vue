<template>
   <div class="forwarded-indicator">
        <span class="icon">
            <img src="@/assets/images/wpp-icon-forwarded.svg">
        </span>

      <span class="message">Encaminhada</span>
   </div>
</template>

<script>
export default {
    name: 'ForwardedIndicator'
};
</script>

<style scoped>
   .icon {
      margin-left: 3px;
   }

   .message {
      font-size: 12.5px;
      color: rgba(0, 0, 0, 0.45);
      font-style: italic;
      margin: 0 3px;
   }
</style>
