<template>
   <div class="message-info">
      <div  class="message-info-container">
          <span>{{formattedDate | uppercase}}</span>
      </div>
   </div>
</template>

<script>
export default {
    name: 'MessageDateFormatted',
    props: {
        formattedDate: {
            type: String,
            required: true
        }
    }
};
</script>

<style scoped>
   .message-info {
      padding: 0 9%;
      margin-bottom: 8px;
      display: flex;
      justify-content: center;
   }

   .message-info-container {
      background-color: rgba(225, 245, 254, .92);
      border-radius: 7.5px;
      box-shadow: 0 1px 0.5px rgba(0, 0, 0, .13);
      padding: 5px 12px 6px;
      text-align: center;
      text-shadow: 0 1px 0 hsla(0, 0%, 100%, .4);

      box-sizing: border-box;
      color: rgba(74, 74, 74, .88);
      display: inline-block;
      flex: none;
      font-size: 12.5px;
      line-height: 21px;
   }
</style>
