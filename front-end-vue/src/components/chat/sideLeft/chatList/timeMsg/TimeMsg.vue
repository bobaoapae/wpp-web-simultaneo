<template>
    <div id="timeMsg" :class="{unread : isUnread}">
        {{time}}
    </div>
</template>

<script>
    export default {
        name: "TimeMsg",
        props: {
            chat: {
                type: Object,
                required: true
            }
        },
        computed: {
            time() {
                const t = this.chat.msgs.length;
                const lastMsgTime = this.chat.msgs[t - 1].t;
                return this.timeConverter(lastMsgTime);


            },
            isUnread() {
                return this.chat.unreadCount > 0;
            }
        },
        methods: {
            timeConverter(UNIX_timestamp) {
                var a = new Date(UNIX_timestamp * 1000);
                var year = a.getFullYear();
                var mes = a.getMonth();
                var date = a.getDate();
                var hour = a.getHours();
                var min = a.getMinutes();
                var time;

                mes++;

                var complete_date = `
                    ${date >= 10 ? date : "0" + date}/${mes >= 10 ? mes : "0" + mes}/${year}
                `;

                if (min < 10) {
                    min = '0' + min;
                }

                if (hour < 10) {
                    hour = '0' + hour
                }

                time = hour + ":" + min;

                const hoje = new Date();
                const hoje_dia = hoje.getDate();
                const hoje_mes = hoje.getMonth() +1;

                if (hoje_dia === date && hoje_mes === mes) {
                    return time;
                } else if (hoje_dia - date === 1 && hoje_mes === mes) {
                    return "Ontem";
                } else {
                    return complete_date;
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