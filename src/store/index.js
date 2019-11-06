import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api';
import pako from 'pako';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        isLogged: false,
        isQrCodeLogged: false,
        isLoadingChat: true,
        imgQrCode: '',
        QrCodeStatus: '',
        self: null,
        chats: null,
        activeChat: null,
        poolContext: [],
        modal: {
            type: '',
            media: '',
            show: false,
            id: ''
        }
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
        },

        SET_IMAGE_IN_MSG(state, payload) {
            state.chats[payload.indexChat].msgs[payload.indexMsg].base64MediaFull = payload.imagem;
        },

        SET_CHAT(state, payload) {
            state.chats[payload.index] = payload.chat;
        },

        SET_MSG(state, payload) {
            state.chats[payload.indexChat].msgs[payload.indexMsg].ack = payload.msg.ack;
        },

        SET_UNREADCOUNT(state, payload) {
            state.chats[payload.indexChat].unreadCount = payload.msg.unreadCount;
        },

        SET_MODAL(state, payload) {
            state.modal.type = payload.type;
            state.modal.media = payload.media;
            state.modal.show = payload.show;
            state.modal.id = payload.id;
        }

    },

    actions: {
        setNewEvent(context) {
            const ws = new WebSocket(`${localStorage.baseURL.replace('http', 'ws')}/api/ws?token=${sessionStorage.TOKEN}`);
            ws.onclose = function (e) {
                window.location.reload();
            };
            ws.onerror = function (e) {
                window.location.reload();
            };


            ws.onmessage = function (e) {
                const response = e.data.split(/,(.+)/);
                //console.log(response);

                const responseType = response[0];
                const responseData = response[1];

                switch (responseType) {

                    case 'init': {
                        const r = JSON.parse(pako.inflate(atob(responseData), {to: 'string'}));
                        console.log('init', r);

                        context.commit("SET_CHATS", r.chats);
                        context.commit("SET_SELF", r.self);
                        context.commit("SET_IS_LOADING_CHAT", false);
                        context.state.poolContext.forEach(func => func());
                        context.state.poolContext = [];

                        break
                    }


                    case 'update-estado': {
                        console.log('update-estado', responseData);

                        if (responseData === 'QR_CODE_SCANNED') {
                            context.commit("SET_QR_CODE_LOGGED", true);
                        } else if (responseData === 'LOADING_STORE') {
                            context.commit("SET_QR_CODE_LOGGED", true);
                        } else if (responseData === 'LOGGED') {
                            context.commit("SET_QR_CODE_LOGGED", true);
                        } else if (responseData === 'WAITING_QR_CODE_SCAN') {
                            context.commit("SET_QR_CODE_LOGGED", false);
                            context.commit('SET_IS_LOADING_CHAT', true);
                        }

                        break
                    }

                    case 'chat-update': {

                        break
                    }

                    case 'update-msg': {
                        const r = JSON.parse(responseData);
                        console.log('update-msg', r);

                        let funcao = () => {
                            context.dispatch("updateMsg", r);
                        };

                        if (context.state.isLoadingChat) {
                            context.state.poolContext.push(funcao);
                        } else {
                            funcao();
                        }

                        break
                    }

                    case 'need-qrcode': {
                        console.log('need-qrcode', responseData);
                        context.commit("SET_IMG_QRCODE", responseData);

                        break
                    }

                    case 'new-msg': {
                        const r = JSON.parse(responseData);
                        console.log('new-msg', r);

                        let funcao = () => {
                            context.dispatch("addNewMsgInChat", r);
                        };

                        if (context.state.isLoadingChat) {
                            context.state.poolContext.push(funcao);
                        } else {
                            funcao();
                        }

                        break
                    }
                }
            };


            /*
            let event = new EventSource(
                `${localStorage.baseURL}/api/whatsApp/events?token=${sessionStorage.TOKEN}`,
            );

            event.addEventListener('update-estado', e => {
                console.log('update-estado', e);

                if (e.data === 'QR_CODE_SCANNED') {
                    context.commit("SET_QR_CODE_LOGGED", true);
                } else if (e.data === 'LOADING_STORE') {
                    context.commit("SET_QR_CODE_LOGGED", true);
                } else if (e.data === 'LOGGED') {
                    context.commit("SET_QR_CODE_LOGGED", true);
                } else if (e.data === 'WAITING_QR_CODE_SCAN') {
                    context.commit("SET_QR_CODE_LOGGED", false);
                    context.commit('SET_IS_LOADING_CHAT', true);
                }
            });

            event.addEventListener('chat-update', e => {
                const r = JSON.parse(e.data);
                console.log('chat-update', r);
            });

            event.addEventListener('update-msg', e => {
                const r = JSON.parse(e.data);
                console.log('update-msg', r);

                let funcao = () => {
                    context.dispatch("updateMsg", r);
                };

                if (context.state.isLoadingChat) {
                    context.state.poolContext.push(funcao);
                } else {
                    funcao();
                }
            });

            event.addEventListener('need-qrcode', e => {
                // e.data = base64 qrcode
                console.log('need-qrcode', e);
                context.commit("SET_IMG_QRCODE", e.data);
            });

            event.addEventListener('new-msg', e => {
                const r = JSON.parse(e.data);
                console.log('new-msg', r);

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
                const r = JSON.parse(pako.inflate(atob(e.data), {to: 'string'}));
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

            */

        },
        getChats(context) {
            const TOKEN = sessionStorage.TOKEN;
            api.get(`/api/chats?token=${TOKEN}`)
                .then((r) => {
                    const data = r.data;

                    context.commit('SET_CHATS', data);
                    context.dispatch("sortChatsByTime");
                    context.commit('SET_IS_LOADING_CHAT', false);
                });

        },
        addNewMsgInChat(context, payload) {

            // pegar o indice do chat
            const indiceChat = context.state.chats.findIndex((element) => {
                // SE a mensagem foi enviado por mim
                if (payload.id.fromMe) {
                    return element.id === payload.to;
                } else {
                    return element.id === payload.from;
                }
            });

            // fazer uma copia do chat
            const chatSorted = context.state.chats[indiceChat];

            // colocar nova mensagem na copia do chat
            chatSorted.msgs.push(payload);

            // ordenar as mensagens da copia do chat
            chatSorted.msgs.sort(function (a, b) {
                if (a.t > b.t) {
                    return 1;
                }
                if (a.t < b.t) {
                    return -1;
                }
                return 0;
            });


            // colocar o chat de volta no state
            context.commit("SET_CHAT", {
                index: indiceChat,
                chat: chatSorted
            });


            // definir msgs nao lidas
            const data = {
                indexChat: indiceChat,
                msg: payload
            };

            context.commit('SET_UNREADCOUNT', data);
            context.dispatch("sortChatsByTime");
        },
        updateMsg(context, payload) {
            // pegar o indice do chat
            const indexChat = context.state.chats.findIndex((element) => {
                // SE a mensagem foi enviado por mim
                if (payload.id.fromMe) {
                    return element.id === payload.to;
                } else {
                    return element.id === payload.from;
                }
            });

            const indexMsg = context.state.chats[indexChat].msgs.findIndex((element) => {
                return element.id.id === payload.id.id;
            });

            const data = {
                indexChat,
                indexMsg,
                msg: payload
            };

            context.commit('SET_MSG', data);
            context.commit('SET_UNREADCOUNT', data);
        },
        sortChatsByTime(context) {
            //console.log('ORDENANDO CHATS...');
            const chats = context.state.chats;

            chats.sort(function (a, b) {
                if (a.msgs[a.msgs.length - 1] === undefined || b.msgs[b.msgs.length - 1] === undefined) {
                    return 0;
                }
                if (a.msgs[a.msgs.length - 1].t < b.msgs[b.msgs.length - 1].t) {
                    return 1;
                }
                if (a.msgs[a.msgs.length - 1].t > b.msgs[b.msgs.length - 1].t) {
                    return -1;
                }
                return 0;
            });
            context.commit('SET_CHATS', chats);
        },
        addFullMediaInMsg(context, payload) {
            const idChat = payload.idChat;
            const idMsg = payload.idMsg;
            const imagem = payload.imagem;

            const indexChat = context.state.chats.findIndex((element) => {
                //console.log('idChat:', idChat);
                //console.log('element.id:', element.id);
                return element.id === idChat;
            });

            const indexMsg = context.state.chats[indexChat].msgs.findIndex((element) => {
                return element.id === idMsg;
            });


            const data = {
                indexChat,
                indexMsg,
                imagem
            };

            context.commit('SET_IMAGE_IN_MSG', data);
        }
    },
    modules: {}
});

export default store;