<template>
   <div class="col-4 col-md-4 col-lg-4 col-xs-3 p-0" id="side-left">
      <LeftHeader/>

      <ChatList/>
   </div>
</template>

<script>
import LeftHeader from './leftHeader/LeftHeader.vue';
import ChatList from './chatList/ChatList.vue';

export default {
    name: 'SideLeft',
    components: {
        LeftHeader,
        ChatList
    }
};
</script>

<style scoped>
   #side-left {
      height: 100%;
      /* padding: 0; */
      background: red;
      display: flex;
      flex-direction: column;
   }

</style>
