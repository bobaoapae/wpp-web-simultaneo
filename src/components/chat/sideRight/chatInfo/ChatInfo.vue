<template>
    <div class="col-3 col-md-3 col-lg-3 col-xs-2 p-0 chat-info">
        <div class="header">
            <img @click="handleClose" class="mr-3 close-info" src="@/assets/images/wpp-icon-close-modal.svg"/>
            <span>Dados do {{activeChat.isChat ? 'Contato' :'Grupo'}}</span>
        </div>
        <div class="box-wrapper">
            <div class="box-content chat-profile">
                <div class="box-img">
                    <Picture :full="true" :group="activeChat.isGroup" :id="activeChat.id" :key="activeChat.id"/>
                </div>
                <div class="chat-desc">
                    <span class="chat-title">{{ activeChat.formattedTitle }}</span>
                    <div class="chat-sub-title">
                        <PresenceChat :chat="activeChat"
                                      :key="activeChat.id" v-if="activeChat.isChat"/>
                        <div v-else>
                            <span>Criado em {{ createdTime }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="box-wrapper" v-if="activeChat.customProperties && activeChat.customProperties.currentOperator"
             :key="activeChat.id">
            <div class="box-content box-current-user">
                <span class="box-title">Operator Atribuido</span>
                <span class="value">{{ currentOperator }}</span>
            </div>
        </div>
        <div class="box-wrapper">
            <div class="box-content custom-properties">
                <span class="box-title">Anotações</span>
                <template v-if="customProperties">
                    <div :key="value.key" v-for="(value, name) in activeChat.customProperties">
                        <div class="custom-property"
                             v-if="name !== 'currentOperator' && name !== 'lastUserSendMessage'">
                            <span class="col-5 p-0 mr-2" type="text">{{ name }}:</span>
                            <span class="col-5 p-0" type="text">{{ value }}</span>
                            <span @click="deleteProperty(name)" id="delete-property"><img
                                src="@/assets/images/wpp-icon-close-answer.svg"></span>
                        </div>
                        <hr>
                    </div>
                </template>
                <div class="loading-properties" v-else>
                    <LoadingSpinner/>
                </div>
                <b-button class="btn btn-success" @click="addProperty">Adicionar Nova Anotação</b-button>
            </div>
        </div>
        <div class="box-wrapper" v-if="activeChat.isGroup && participants">
            <div class="box-content group-participants">
                <span class="box-title">{{ participants.length }} Participantes</span>
                <ParticipantInfo :key="participant.id" :id="participant.id" :isAdmin="participant.isAdmin"
                                 v-for="participant in participants"/>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import api from '@/api';
import LoadingSpinner from '@/components/shared/loadingSpinner/LoadingSpinner';
import Picture from '@/components/shared/picture/Picture.vue';
import PresenceChat from '@/components/shared/presenceChat/PresenceChat';
import ParticipantInfo from '@/components/chat/sideRight/chatInfo/ParticipantInfo';

export default {
    name: 'ChatInfo',
    components: { ParticipantInfo, Picture, LoadingSpinner, PresenceChat },
    mounted () {
        //TODO close with esc
        /*this.$root.$on('keyDown', (evt) => {
            if (this.activeChat && this.activeChat.openChatInfo) {
                if (evt.key === 'Escape') {
                    this.handleClose();
                }
            }
        });*/
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
    asyncComputed: {
        currentOperator: {
            async get () {
                let result = await api.get(`/api/users/${this.activeChat.customProperties.currentOperator}`);
                return result.data.nome;
            }
        },
        customProperties: {
            async get () {
                let result = await this.getChatProperties({ chatId: this.activeChat.id });
                for await (let property of result) {
                    await this.changeCustomPropertyChat(property);
                }
                return !!result;
            },
            default () {
                return [];
            }
        },
        participants: {
            async get () {
                let result = await this.activeChat.getParticipants();
                return result;
            }
        }
    },
    methods: {
        ...mapActions(['addAnnotation', 'getChatProperties', 'changeCustomPropertyChat', 'deleteChatProperty', 'findFormattedNameFromId']),
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
        },

        handleClose () {
            this.activeChat.openChatInfo = false;
        },

        async addProperty () {
            let result = await this.$swal({
                title: 'Adicionar Nova Anotação',
                html:
                    `
                    <div class="box-create-annotation" style="display: flex;flex-direction: column">
                        <label for="swal-input1">Nome</label><input id="swal-input1" class="swal2-input">
                        <label for="swal-input2">Conteudo</label><textarea id="swal-input2" class="swal2-input" style="height: 20vh"></textarea>
                    </div>`,
                preConfirm: () => {
                    return {
                        name: document.getElementById('swal-input1').value,
                        value: document.getElementById('swal-input2').value
                    };
                },
                showCancelButton: true,
                confirmButtonText: 'Adicionar',
                cancelButtonText: 'Cancelar',
                icon: 'info',
                focusConfirm: false,
                heightAuto: false
            });
            if (result.value) {
                await this.addAnnotation({ chat: this.activeChat, name: result.value.name, value: result.value.value });
            }
        },

        async deleteProperty (propertyName) {
            let result = await this.$swal({
                title: `Deseja excluir a anotação ${propertyName} ?`,
                showCancelButton: true,
                confirmButtonText: 'Sim',
                cancelButtonText: 'Não',
                icon: 'question',
                focusConfirm: false,
                heightAuto: false
            });
            if (result.value) {
                await this.deleteChatProperty({ chatId: this.activeChat.id, name: propertyName });
            }
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

.header {
    background: #eee;
    padding: 10px 16px;
    height: 63px;
    max-height: 63px;
}

.box-wrapper {
    padding: 5px 30px 20px;
    background-color: white;
    margin-bottom: 10px;
    animation: animation 1s cubic-bezier(.1, .82, .25, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, .08);
    display: flex;
    justify-content: center;
}

.box-content {
    background: white;
    display: flex;
    flex-direction: column;
    width: 100%;
}

.chat-info {
    height: 100%;
    background: #eee;
    color: #4a4a4a;
    text-rendering: optimizeLegibility;
    font-feature-settings: "kern";
}

.box-img {
    padding-top: 15px;
    height: 212px;
    width: 212px;
    margin: auto;
}

.box-img ::v-deep(img) {
    display: block;
    margin: 0 auto;
    height: 100%;
    width: 100%;
    border-radius: 50%;
}

.chat-title {
    font-size: 19px;
    line-height: 28px;
}

.chat-sub-title {
    font-size: 14px;
    line-height: 20px;
    color: rgba(0, 0, 0, .45);
}

.custom-properties ul {
    margin: 0;
    padding: 0;
}

.custom-properties li {
    list-style: none;
}

.custom-properties input {
    border-style: none;
}

.custom-property {
    display: flex;
}

.delete-property {
    color: red;
}

hr {
    width: 100%;
    text-align: center;
    margin: 0;
}

.loading-properties {
    max-width: 50px;
    width: 50px;
    margin: auto;
}

.box-title {
    color: #009688;
    font-size: 14px;
    line-height: normal;
}

.close-info {
    filter: opacity(0.6);
    cursor: pointer;
}
</style>
