<template>
    <div id="conversation-header">
        <div class="box-img">
            <Picture :group="chat.isGroup" :id="chat.id" :key="chat.id"/>
        </div>

        <div @click.prevent="openChatInfo" class="box-info">
            <div :inner-html.prop="nameEmojify | emojify" class="nome"></div>

            <div class="info">
                <PresenceChat :chat="chat"
                              :key="chat.id" v-if="chat.isChat"/>
            </div>
        </div>

        <div class="box-icons">
            <img src="@/assets/images/wpp-icon-search.svg">

            <label for="file">
                <img src="@/assets/images/wpp-icon-clip.svg">
                <input @change="onChange" id="file" multiple ref="file" type="file"/>
            </label>

            <b-dropdown
                lazy
                no-caret
                toggle-class="text-decoration-none p-0"
                variant="link"
                ref="dropdown"
            >
                <template v-slot:button-content>
                    <img src="@/assets/images/wpp-icon-kebab-menu.svg">
                </template>

                <b-dropdown-item @click.stop="handlePinChat" v-if="!chat.pin || chat.pin === 0">Fixar a
                    Conversa
                </b-dropdown-item>
                <b-dropdown-item @click.stop="handleUnPinChat" v-else>Desafixar a Conversa</b-dropdown-item>
                <b-dropdown-item @click.stop="handleClearChat"
                                 v-if="user.canCreateOperator || user.superConfiguracao.operadorPodeExcluirMsg">
                    Limpar Conversa
                </b-dropdown-item>
                <b-dropdown-item @click.stop="handleDeleteChat"
                                 v-if="chat.isChat && user.canCreateOperator || user.superConfiguracao.operadorPodeExcluirMsg">
                    Deletar Conversa
                </b-dropdown-item>
            </b-dropdown>
        </div>

    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import Picture from '@/components/shared/picture/Picture.vue';
import PresenceChat from '@/components/shared/presenceChat/PresenceChat';

export default {
    name: 'ConversationHeader',
    components: {
        Picture,
        PresenceChat
    },
    props: {
        chat: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            files: []
        };
    },
    computed: {
        ...mapState(['user']),

        nameEmojify () {
            if (this.chat.formattedTitle) {
                return this.chat.formattedTitle;
            }
            return '+' + this.chat.id.replace('@c.us', '');
        },

        lastTimeAvailable () {
            return this.timeConverter(this.chat.lastPresenceAvailableTime);
        }
    },
    methods: {
        ...mapActions(['uploadFile']),

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

        onChange (event) {
            if (event.target.files && event.target.files.length > 0) {
                this.files.push(...event.target.files);
                this.$refs.file.value = '';
                this.handleSendMsg();
            }
        },

        handleSendMsg () {
            let files = [...this.files];
            let currentChat = this.chat;
            files.forEach(file => {
                this.uploadFile(file).then(tag => {
                    currentChat.buildAndSendMessage({ fileUUID: tag });
                }).catch(error => {
                    alert(`Upload File Error: ${error}`);
                    console.log('Upload Error::', error);
                });
            });
            this.files = [];
        },

        handlePinChat () {
            this.chat.pinChat();
        },

        handleUnPinChat () {
            this.chat.unPinChat();
        },

        handleDeleteChat () {
            this.chat.deleteChat();
        },

        handleClearChat () {
            this.chat.clearChat();
        },

        openChatInfo () {
            this.chat.openChatInfo = !this.chat.openChatInfo;
        }
    }
};
</script>

<style scoped>
#file {
    display: none;
}

label {
    margin: 0;
    padding: 0;
}

#conversation-header {
    background: #eee;
    display: flex;
    padding: 10px 16px;
    height: 63px;
    max-height: 63px;
    cursor: pointer;
    user-select: none;
}

.box-img {
    padding-right: 15px;
    display: flex;
    align-items: center;
}

.box-img >>> img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.box-img >>> .picture {
    padding: 0;
}

.box-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex-grow: 1;
}

.box-info .nome {
    font-size: 16px;
    color: #000000;
}

.box-info .info {
    font-size: 13px;
    color: rgba(0, 0, 0, 0.6);
}

.box-icons img {
    cursor: pointer;
    padding: 8px;
    margin-left: 10px
}
</style>
