<template>
   <div id="chat">
      <div class="my-container">
         <div class="box-chat container-fluid">
            <div class="row">
               <SideLeft/>
               <SideRight/>
            </div>
         </div>
      </div>

      <ModalMedia/>
   </div>
</template>

<script>
import { mapActions } from 'vuex';
import SideLeft from '@/components/chat/sideLeft/SideLeft.vue';
import SideRight from '@/components/chat/sideRight/SideRight.vue';
import ModalMedia from './ModalMedia';

export default {
    name: 'Chat',
    components: {
        ModalMedia,
        SideLeft,
        SideRight
    },
    data () {
        return {};
    },
    created () {
    // this.getChats();
    },
    methods: {
        ...mapActions(['setNewMsgEvent', 'getChats'])
    }
};
</script>

<style scoped>
   #chat {
      height: 100%;
      background: linear-gradient(#009688 127px, #d7dbd8 0%);
      display: flex;
      justify-content: center;
      align-items: center;
      min-width: 648px;
   }

   .my-container {
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
   }

   .box-chat {
      height: 100%;
      background: #fff;
      flex: 1;
      box-shadow: 0 1px 1px 0 rgba(0, 0, 0, 0.06), 0 2px 5px 0 rgba(0, 0, 0, 0.2);
   }

   .row {
      height: 100%;
   }

   @media screen and (min-width: 648px) {
      #chat {
         overflow-x: hidden;
      }
   }

   @media screen and (min-width: 1441px) {
      .my-container {
         width: 1396px;
         height: calc(100% - 38px);
         margin: 0 auto;
      }
   }
</style>
