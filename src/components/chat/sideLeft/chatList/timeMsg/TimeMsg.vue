<template>
   <div :class="{unread : isUnread}" id="timeMsg">
      {{time}}
   </div>
</template>

<script>
export default {
  name: 'TimeMsg',
  props: {
    chat: {
      type: Object,
      required: true
    }
  },
  computed: {
    time () {
      const t = this.chat.msgs.length;
      const lastMsg = this.chat.msgs[t - 1];

      if (lastMsg === undefined) {
        return '';
      }
      return this.timeConverter(lastMsg.t);
    },
    isUnread () {
      return this.chat.unreadCount > 0;
    }
  },
  methods: {
    timeConverter (unixTimeStamp) {
      var a = new Date(unixTimeStamp * 1000);
      var year = a.getFullYear();
      var mes = a.getMonth();
      var date = a.getDate();
      var hour = a.getHours();
      var min = a.getMinutes();
      var time;

      mes++;

      var completeDate = `
                    ${date >= 10 ? date : '0' + date}/${mes >= 10 ? mes : '0' + mes}/${year}
                `;

      if (min < 10) {
        min = '0' + min;
      }

      if (hour < 10) {
        hour = '0' + hour;
      }

      time = hour + ':' + min;

      const hoje = new Date();
      const hojeDia = hoje.getDate();
      const hojeMes = hoje.getMonth() + 1;

      if (hojeDia === date && hojeMes === mes) {
        return time;
      } else if (hojeDia - date === 1 && hojeMes === mes) {
        return 'Ontem';
      } else {
        return completeDate;
      }
    }
  }
};
</script>

<style scoped>
   #timeMsg {
      font-size: 12px;
      color: rgba(0, 0, 0, 0.4);
   }

   .unread {
      color: #333333 !important;
   }
</style>
