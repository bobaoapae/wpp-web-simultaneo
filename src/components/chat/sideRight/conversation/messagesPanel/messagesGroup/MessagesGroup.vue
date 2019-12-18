<template>
   <div class="messages-group">
      <div :key="item.id.id" v-for="item in msgs">
         <MessageInfo :msg="item" v-if="isNotification(item.type)"/>
         <MessageOut :msg="item" v-else-if="item.id.fromMe"/>
         <MessageIn :msg="item" v-else/>
      </div>
   </div>
</template>

<script>
import MessageOut from '@/components/shared/messageOut/MessageOut.vue';
import MessageIn from '@/components/shared/messageIn/MessageIn.vue';
import MessageInfo from '@/components/shared/messageInfo/MessageInfo.vue';

export default {
  name: 'MessagesGroup',
  components: {
    MessageOut,
    MessageIn,
    MessageInfo
  },
  props: {
    msgs: {
      type: Array,
      required: true
    }
  },
  methods: {
    isNotification (type) {
      if (type === 'gp2') {
        return true;
      } else if (type === 'e2e_notification') {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style scoped>

</style>
