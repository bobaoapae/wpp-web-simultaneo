<template>
    <div class="col-3 col-md-3 col-lg-3 col-xs-2 p-0 chat-info">
        <div class="header">
            <span>Dados do {{isChat ? 'Contato' :'Grupo'}}</span>
        </div>
        <div class="box-wrapper">
            <div class="chat-profile">
                <div class="box-img">
                    <ChatActivePhoto/>
                </div>
                <div class="chat-desc">
                    <span class="chat-title">{{activeChat.formattedTitle}}</span>
                    <div class="chat-sub-title">
                        <div v-if="activeChat.isChat">
                            <span v-if="activeChat.isOffline && activeChat.hasLastTimeAvailable">{{this.lastTimeAvailable}}</span>
                            <span v-else-if="activeChat.isOnline">online</span>
                            <span v-else-if="activeChat.isComposing">escrevendo...</span>
                            <span v-else-if="activeChat.isRecording">gravando áudio...</span>
                        </div>
                        <div v-else>
                            <span>Criado em {{createdTime}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="box-wrapper">
            <div class="box-chat-custom-properties">
                <span class="title">Anotações</span>
                <ul v-if="activeChat.customProperties.loaded">
                    <li v-for="(value, index) in activeChat.customProperties.properties" :key="value.key">
                        <div class="col-12 chat-custom-properties">
                            <input class="col-5 p-0" type="text" v-model="value.key">
                            <input class="col-5 p-0" type="text" v-model="value.value">
                            <button class="col-2 p-0" @click="deleteRow(index)"></button>
                        </div>
                    </li>
                </ul>
                <div class="loading-properties" v-else>
                    <LoadginSpinner/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import ChatActivePhoto from '../conversation/conversationHeader/chatActivePhoto/ChatActivePhoto';
import { mapState } from 'vuex';
import LoadginSpinner from '../../../shared/loadingSpinner/LoadingSpinner';

export default {
    name: 'ChatInfo',
    components: { LoadginSpinner, ChatActivePhoto },
    watch: {
        'activeChat': function () {
            this.loadProperties();
        }
    },
    mounted () {
        this.loadProperties();
    },
    computed: {
        ...mapState(['activeChat']),

        lastTimeAvailable () {
            return this.timeConverterPresence(this.activeChat.lastPresenceAvailableTime);
        },

        createdTime () {
            return this.timeConverterCreated(this.activeChat.id.split('@')[0].split('-')[1]);
        }
    },
    methods: {
        loadProperties () {
            this.activeChat.customProperties.loadProperties();
        },

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

    @keyframes animation {
        0%, 30% {
            transform: translateY(-50px);
            opacity: 0;
        }
        100% {
            transform: translateY(0);
            opacity: 1;
        }
    }

    .header{
        background: #eee;
        padding: 10px 16px;
        height: 63px;
        max-height: 63px;
    }

    .box-wrapper{
        padding-top: 5px;
        padding-left: 30px;
        padding-right: 30px;
        padding-bottom: 20px;
        background-color: white;
        margin-bottom: 10px;
        animation: animation 1s cubic-bezier(.1,.82,.25,1);
        box-shadow: 0 1px 3px rgba(0,0,0,.08);
    }

    .chat-profile{
        height: 40%;
        background: white;
    }

    .chat-info{
        height: 100%;
        background: #eee;
        color: #4a4a4a;
        text-rendering: optimizeLegibility;
        font-feature-settings: "kern";

    }

    .chat-title{
        font-size: 19px;
        line-height: 28px;
    }

    .chat-sub-title{
        font-size: 14px;
        line-height: 20px;
        color: rgba(0,0,0,.45);
    }

    .box-chat-custom-properties ul{
        margin: 0;
        padding: 0;
    }

    .box-chat-custom-properties li{
        list-style: none;
    }

    .chat-custom-properties input{
        border-style: none;
    }

    .chat-custom-properties{
        padding: 0;
        margin: 0;
    }

    .loading-properties{
        max-width: 50px;
        width: 50px;
        margin: auto;
    }

    .title{
        color: #009688;
        font-size: 14px;
        line-height: normal;
    }

    .box-img {
        padding-top: 15px;
        height: 212px;
        width: 212px;
        margin: auto;
    }

    .box-img img {
        display: block;
        margin: 0 auto;
        height: 100%;
        border-radius: 50%;
    }
</style>
