<template>
    <span class="time">
        <span class="time-text">{{timeConverted}}</span>
        <MessageIconStatus :ack="msg.ack" v-if="msg.id.fromMe && msg.type !== 'revoked' "/>
    </span>
</template>

<script>
import MessageIconStatus from '../messageIconStatus/MessageIconStatus';

export default {
    name: 'MessageTime',
    components: {
        MessageIconStatus
    },
    props: {
        msg: {
            type: Object,
            required: true
        }
    },
    computed: {
        timeConverted () {
            return this.timeConverter(this.msg.t);
        }
    },
    methods: {
        timeConverter (unixTimeStamp) {
            let a = new Date(unixTimeStamp * 1000);
            let hour = a.getHours();
            let min = a.getMinutes();
            let time;
            if (min < 10) {
                min = '0' + min;
            }
            if (hour < 10) {
                hour = '0' + hour;
            }
            time = hour + ':' + min;
            return time;
        }
    }
};
</script>

<style scoped>
   .time {
      font-size: 11px;
      color: rgba(0, 0, 0, 0.45);
      position: absolute;
      right: 7px;
      bottom: 7px;
   }
</style>
