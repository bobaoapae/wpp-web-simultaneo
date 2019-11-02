import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        isLogged: false,
        isQrCodeLogged: false,
        isLoadingChat: true,
        imgQrCode: '',
        QrCodeStatus: '',
        self: null,
        chats: null,
        activeChat: null,
        poolContext: []
    },

    mutations: {
        SET_IS_LOGGED(state, payload) {
            state.isLogged = payload;
        },

        SET_QR_CODE_LOGGED(state, payload) {
            state.isQrCodeLogged = payload;
        },

        SET_IS_LOADING_CHAT(state, payload) {
            state.isLoadingChat = payload;
        },

        SET_IMG_QRCODE(state, payload) {
            state.imgQrCode = payload;
        },

        SET_QRCODE_STATUS(state, payload) {
            state.QrCodeStatus = payload
        },

        // chat que esta sendo visualizado
        SET_ACTIVE_CHAT(state, payload) {
            state.activeChat = payload;
        },

        // define as informações do wpp logado
        SET_SELF(state, payload) {
            state.self = payload;
        },

        // define a lista com todos os chats
        SET_CHATS(state, payload) {
            state.chats = payload;
        },

        // recebe a nova mensagem e colocada no array de msgs do seu chat
        PUSH_MSG_IN_CHAT(state, payload) {
            state.chats[payload.index].msgs.push(payload.newMsg)
        }
    },

    actions: {
        setNewEvent(context) {
            let event = new EventSource(
                `${localStorage.baseURL}/api/whatsApp/events?token=${localStorage.TOKEN}`,
            );

            event.addEventListener('update-estado', e => {
                console.log('update-estado', e);
                context.commit("SET_QRCODE_STATUS", e.data);

                if (e.data === 'LOGGED') {
                    context.commit("SET_QR_CODE_LOGGED", true);
                } else {
                    context.commit("SET_QR_CODE_LOGGED", false);
                }
            });

            event.addEventListener('need-qrcode', e => {
                console.log('need-qrcode', e);
                context.commit("SET_IMG_QRCODE", e.data);
            });

            event.addEventListener('new-msg', e => {
                const r = JSON.parse(e.data);
                //console.log('new-msg', r);

                let funcao = () => {
                    context.dispatch("addNewMsgInChat", r);
                };

                if (context.state.isLoadingChat) {
                    context.state.poolContext.push(funcao);
                } else {
                    funcao();
                }
            });

            event.addEventListener('init', e => {
                const r = JSON.parse(e.data);
                console.log('init', r);

                context.commit("SET_CHATS", r.chats);
                context.commit("SET_SELF", r.self);
                context.commit("SET_IS_LOADING_CHAT", false);
                context.state.poolContext.forEach(func => func());
                context.state.poolContext = [];
            });

            event.addEventListener('low-batery', e => {
                console.log('low-batery', e);
            });

            event.addEventListener('new-msg-v3', e => {
                console.log('new-msg-v3', e);
            });
        },
        getChats(context) {
            const TOKEN = localStorage.TOKEN;
            api.get(`/api/chats?token=${TOKEN}`)
                .then((r) => {
                    const data = r.data;

                    context.commit('SET_CHATS', data);
                    context.dispatch("sortChatsByTime");
                    context.commit('SET_IS_LOADING_CHAT', false);
                });

        },
        addNewMsgInChat(context, payload) {
            const indice = context.state.chats.findIndex((element) => {
                // SE a mensagem foi enviado por mim
                if (payload.id.fromMe) {
                    return element.id === payload.to;
                } else {
                    return element.id === payload.from;
                }
            });

            context.commit("PUSH_MSG_IN_CHAT", {
                index: indice,
                newMsg: payload
            });

            context.dispatch("sortChatsByTime");
        },
        sortChatsByTime(context) {
            //console.log('ORDENANDO CHATS...');
            const chats = context.state.chats;

            chats.sort(function (a, b) {
                if (a.msgs[a.msgs.length - 1].t < b.msgs[b.msgs.length - 1].t) {
                    return 1;
                }
                if (a.msgs[a.msgs.length - 1].t > b.msgs[b.msgs.length - 1].t) {
                    return -1;
                }
                return 0;
            });
            context.commit('SET_CHATS', chats);
        }
    },
    modules: {}
})