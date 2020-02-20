<template>
   <div id="conversation-header">
      <div class="box-img">
         <Picture :id="activeChat.id" :key="activeChat.id" :group="activeChat.isGroup"/>
      </div>

      <div class="box-info" @click.prevent="openChatInfo">
         <div class="nome" :inner-html.prop="nameEmojify | emojify"></div>

         <div class="info">
             <PresenceChat :chat="activeChat"
                           v-if="activeChat.isChat" :key="activeChat.id"/>
         </div>
      </div>

      <div class="box-icons">
         <img src="@/assets/images/wpp-icon-search.svg">

         <label for="file">
            <img src="@/assets/images/wpp-icon-clip.svg">
            <input @change="onChange" id="file" type="file" ref="file" multiple/>
         </label>

         <img src="@/assets/images/wpp-icon-kebab-menu.svg">
      </div>

   </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';
import Picture from '@/components/shared/picture/Picture.vue';
import PresenceChat from '@/components/shared/presenceChat/PresenceChat';

export default {
    name: 'ConversationHeader',
    components: {
        Picture,
        PresenceChat
    },
    data () {
        return {
            file: ''
        };
    },
    computed: {
        ...mapState(['activeChat']),

        nameEmojify () {
            if (this.activeChat.formattedTitle) {
                return this.activeChat.formattedTitle;
            }
            return '+' + this.activeChat.id.replace('@c.us', '');
        },

        lastTimeAvailable () {
            return this.timeConverter(this.activeChat.lastPresenceAvailableTime);
        }
    },
    methods: {
        ...mapActions(['convertToBase64']),

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
            event.target.files.forEach(async file => {
                let base64 = await this.convertToBase64({ file: file });
                return this.handleSendMsg({ media: base64, fileName: file.name });
            });
        },

        handleSendMsg (msg) {
            if (this.activeChat.quotedMsg) {
                msg.quotedMsg = this.activeChat.quotedMsg.id._serialized;
            }

            this.activeChat.quotedMsg = undefined;

            return this.activeChat.sendMessage(msg);
        },

        openChatInfo () {
            this.activeChat.openChatInfo = !this.activeChat.openChatInfo;
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
