<template>
    <div class="col-3 col-md-3 col-lg-3 col-xs-2 p-0 chat-info">
        <div class="header">
            <span>Dados do {{isChat ? 'Contato' :'Grupo'}}</span>
        </div>
        <div class="chat-profile">
            <div class="box-img">
                <ChatActivePhoto/>
            </div>
            <div class="chat-desc">
                <span class="chat-title">{{activeChat.formattedTitle}}</span>
                <div class="chat-subTitle">
                    <div v-if="isChat">
                        <span v-if="isOffline && hasLastTimeAvailable">{{this.lastTimeAvailable}}</span>
                        <span v-else-if="isOnline">online</span>
                        <span v-else-if="isComposing">escrevendo...</span>
                        <span v-else-if="isRecording">gravando áudio...</span>
                    </div>
                    <div v-else>
                        <span>Criado em {{createdTime}}</span>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ChatActivePhoto from '../conversation/conversationHeader/chatActivePhoto/ChatActivePhoto';
import { mapState } from 'vuex';

export default {
    name: 'ChatInfo',
    components: { ChatActivePhoto },
    computed: {
        ...mapState(['activeChat']),

        isChat () {
            return this.activeChat.kind === 'chat';
        },

        isOffline () {
            return this.activeChat.presenceType === 'unavailable' || this.activeChat.presenceType === '';
        },

        isOnline () {
            return this.activeChat.presenceType === 'available';
        },

        isComposing () {
            return this.activeChat.presenceType === 'composing';
        },

        isRecording () {
            return this.activeChat.presenceType === 'recording';
        },

        hasLastTimeAvailable () {
            return this.activeChat.lastPresenceAvailableTime && this.activeChat.lastPresenceAvailableTime > 0;
        },

        lastTimeAvailable () {
            return this.timeConverterPresence(this.activeChat.lastPresenceAvailableTime);
        },

        createdTime () {
            return this.timeConverterCreated(this.activeChat.id.split('@')[0].split('-')[1]);
        }
    },
    methods: {
        timeConverterPresence (unixTimeStamp) {
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

        timeConverterCreated (unixTimeStamp) {
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

            return completeDate + ' ' + time;
        }
    }
};

</script>

<style scoped>
    .header{
        background: #eee;
        padding: 10px 16px;
        height: 63px;
        max-height: 63px;
    }

    .chat-profile{
        height: 40%;
        background: white;
    }

    .chat-info{
        height: 100%;
        background: #eee;
    }

    .chat-title{
        font-size: 19px;
        line-height: 28px;
    }

    .chat-subTitle{
        font-size: 14px;
        line-height: 20px;
        color: rgba(0,0,0,.45);
    }

    .chat-desc{
        margin: 30px;
    }

    .box-img {
        padding-top: 15px;
        height: 65%;
    }

    .box-img img {
        display: block;
        margin: 0 auto;
        height: 100%;
        border-radius: 50%;
    }
</style>
