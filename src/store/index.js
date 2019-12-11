import Vue from 'vue';
import Vuex from 'vuex';
import api from '@/api';

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
        },
        ws: {}
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

        SET_MEDIA_IN_MSG(state, payload) {
            state.chats[payload.indexChat].msgs[payload.indexMsg].base64MediaFull = payload.media;
        },

        SET_CHAT(state, payload) {
            state.chats[payload.index] = payload.chat;
        },

        UPDATE_MSG(state, payload) {
            state.chats[payload.indexChat].msgs[payload.indexMsg].ack = payload.msg.ack;
        },

        SET_MODAL(state, payload) {
            state.modal.type = payload.type;
            state.modal.media = payload.media;
            state.modal.show = payload.show;
            state.modal.id = payload.id;
        },

        UPDATE_CHAT(state, payload) {
            state.chats[payload.indexChat].muteExpiration = payload.chat.muteExpiration;
            state.chats[payload.indexChat].name = payload.chat.name;
            state.chats[payload.indexChat].noEarlierMsgs = payload.chat.noEarlierMsgs;
            state.chats[payload.indexChat].pin = payload.chat.pin;
            state.chats[payload.indexChat].t = payload.chat.t;
            state.chats[payload.indexChat].unreadCount = payload.chat.unreadCount;
            state.chats[payload.indexChat].shouldAppearInList = payload.chat.shouldAppearInList;
        },

        SET_WS(state, payload) {
            state.ws = payload;
        },

        SET_PICTURE_CHAT(state, payload) {
            state.chats[payload.chatId].picture = payload.picture;
        },

        ADD_NEW_CHAT(state, payload) {
            state.chats.push(payload)
        },
    },

    actions: {
        setNewEvent(context) {
            context.commit("SET_WS", new WebSocket(`${localStorage.baseURL.replace('http', 'ws')}/api/ws`));

            const ws = context.state.ws;

            ws.onopen = function (e) {
                ws.send(`token, ${sessionStorage.TOKEN}`);
            };
            ws.onclose = function (e) {

                window.location.reload();
            };
            ws.onerror = function (e) {

                window.location.reload();
            };


            ws.onmessage = function (e) {
                const response = e.data.split(/,(.+)/);

                const responseType = response[0];
                const responseData = response[1];

                switch (responseType) {

                    case 'need-qrcode': {
                        console.log('need-qrcode', responseData);
                        context.commit("SET_IMG_QRCODE", responseData);

                        break;
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

                        break;
                    }


                    case 'init': {
                        const r = JSON.parse(responseData);
                        console.log('init', r);

                        context.dispatch("handleChatProperties", {chats: r.chats});
                        context.commit("SET_SELF", r.self);
                        context.commit("SET_IS_LOADING_CHAT", false);
                        context.state.poolContext.forEach(func => func());
                        context.state.poolContext = [];

                        break;
                    }


                    case 'new-chat': {
                        const r = JSON.parse(responseData);
                        console.log('new-chat::', r);

                        let funcao = () => {
                            context.dispatch("newChat", r);
                        };

                        if (context.state.isLoadingChat) {
                            context.state.poolContext.push(funcao);
                        } else {
                            funcao();
                        }

                        break;
                    }

                    case 'chat-update': {
                        const r = JSON.parse(responseData);

                        let funcao = () => {
                            context.dispatch("updateChat", r);
                        };

                        if (context.state.isLoadingChat) {
                            context.state.poolContext.push(funcao);
                        } else {
                            funcao();
                        }

                        break;
                    }

                    case 'new-msg': {
                        const r = JSON.parse(responseData);

                        let funcao = () => {
                            context.dispatch("addNewMsgInChat", r);
                        };

                        if (context.state.isLoadingChat) {
                            context.state.poolContext.push(funcao);
                        } else {
                            funcao();
                        }

                        break;
                    }

                    case 'update-msg': {
                        const r = JSON.parse(responseData);

                        let funcao = () => {
                            context.dispatch("updateMsg", r);
                        };

                        if (context.state.isLoadingChat) {
                            context.state.poolContext.push(funcao);
                        } else {
                            funcao();
                        }

                        break;
                    }

                    case 'chat-picture': {
                        const r = JSON.parse(responseData);

                        context.dispatch("updatePicture", r);
                    }
                }
                return false;
            };
        },

        /*
            CHATS
        */

        newChat(context, payload) {
            context.dispatch("setChatProperties", payload);
            context.commit("ADD_NEW_CHAT", payload);
            context.dispatch("sortChatsByTime");
        },


        getPicture(context, payload) {
            context.state.ws.send(`updatePicture,${payload.chatId}`);
        },

        updatePicture(context, payload) {
            const chatId = context.state.chats.findIndex((element) => {
                return element.id === payload.id;
            });

            context.commit('SET_PICTURE_CHAT', {
                chatId,
                picture: payload.picture
            });
        },

        setChatProperties(context, el) {
            el.picture = "";
            el.quotedMsg = undefined
        },

        handleChatProperties(context, payload) {

            payload.chats.forEach(el => {
                context.dispatch("setChatProperties", el);
            });

            context.commit("SET_CHATS", payload.chats);
        },

        updateChat(context, payload) {
            const indexChat = context.state.chats.findIndex((element) => {
                return element.id === payload.id;
            });

            if (indexChat >= 0) {
                const data = {
                    indexChat,
                    chat: payload
                };

                context.commit('UPDATE_CHAT', data);

            } else {
                if (payload.shouldAppearInList) {
                    context.dispatch("setChatProperties", payload);
                    payload.msgs = [];
                    context.commit("ADD_NEW_CHAT", payload);
                    context.dispatch("sortChatsByTime");
                }

            }


        },

        sortChatsByTime(context) {
            const chats = context.state.chats;

            chats.sort(function (a, b) {
                var n = a.pin || 0
                    , r = b.pin || 0;
                if (n || r)
                    return n !== r ? n > r ? -1 : 1 : a.id._serialized < b.id._serialized ? -1 : 1;
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


        /*
            MESSAGES
        */
        sendMsg(context, payload) {
            context.state.ws.send(`sendMessage,${JSON.stringify(payload)}`);
        },

        seeChat(context, payload) {
            context.state.ws.send(`seeChat,${payload.chatId}`);
        },

        loadEarly(context, payload) {
            context.state.ws.send(`loadEarly,${payload.chatId}`);
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


            context.dispatch("sortChatsByTime");
        },

        updateMsg(context, payload) {
            let chatId;
            if (payload.id.fromMe) {
                chatId = payload.to;
            } else {
                chatId = payload.from;
            }

            const indexChat = context.state.chats.findIndex((element) => {
                return element.id === chatId;
            });

            const indexMsg = context.state.chats[indexChat].msgs.findIndex((element) => {
                return element.id.id === payload.id.id;
            });

            const data = {
                indexChat,
                indexMsg,
                msg: payload
            };

            context.commit('UPDATE_MSG', data);
        },

        addFullMediaInMsg(context, payload) {
            const idChat = payload.idChat;
            const idMsg = payload.idMsg;
            const media = payload.media;

            const indexChat = context.state.chats.findIndex((element) => {
                return element.id === idChat;
            });

            const indexMsg = context.state.chats[indexChat].msgs.findIndex((element) => {
                return element.id === idMsg;
            });

            const data = {
                indexChat,
                indexMsg,
                media
            };

            context.commit('SET_MEDIA_IN_MSG', data);
        },


    },
    modules: {}
});

export default store;