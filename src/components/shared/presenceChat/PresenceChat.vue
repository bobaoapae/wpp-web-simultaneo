<template>
    <div class="presence-chat" v-b-visible="handleVisible">
        <span class="last-time" v-if="showLastTime && chat.isOffline && chat.hasLastTimeAvailable">{{this.lastTimeAvailable}}</span>
        <span class="online" v-else-if="showOnline && chat.isOnline">online</span>
        <span class="writing" v-else-if="chat.isComposing">escrevendo...</span>
        <span class="recording" v-else-if="chat.isRecording">gravando áudio...</span>
    </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
    name: 'PresenceChat',
    props: {
        chat: {
            type: Object,
            required: true
        },
        showLastTime: {
            type: Boolean,
            required: false,
            default: true
        },
        showOnline: {
            type: Boolean,
            required: false,
            default: true
        }
    },
    data () {
        return {
            presenceVisible: false
        };
    },
    computed: {
        ...mapState(['visible', 'idle']),

        lastTimeAvailable () {
            return this.timeConverter(this.chat.lastPresenceAvailableTime);
        },

        active () {
            return this.visible && !this.idle;
        }
    },
    watch: {
        'active': function (val) {
            if (val && this.presenceVisible) {
                this.chat.subscribePresence();
            }
        }
    },
    methods: {
        timeConverter (unixTimeStamp) {
            let a = new Date(unixTimeStamp * 1000);
            let year = a.getFullYear();
            let mes = a.getMonth();
            let date = a.getDate();
            let hour = a.getHours();
            let min = a.getMinutes();
            let time;

            mes++;

            let completeDate = `
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

            const inicioFrase = 'visto por último ';
            if (hojeDia === date && hojeMes === mes) {
                return inicioFrase + 'hoje às ' + time;
            } else if (hojeDia - date === 1 && hojeMes === mes) {
                return inicioFrase + 'ontem às ' + time;
            }
            return inicioFrase + 'em ' + completeDate;
        },

        handleVisible (visible) {
            this.presenceVisible = visible;
            if (this.presenceVisible) {
                this.chat.subscribePresence();
            }
        }
    }
};
</script>

<style scoped>

</style>
