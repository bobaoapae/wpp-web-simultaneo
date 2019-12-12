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
            console.log("activeChat: ", payload);
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

        ADD_NEW_CHAT(state, payload) {
            state.chats.push(payload)
        },
    },

    actions: {
        setNewEvent(context) {
            context.commit("SET_WS", new WebSocket(`${localStorage.baseURL.replace('http', 'ws')}/api/ws`));

            const ws = context.state.ws;

            ws.onopen = function (e) {
                ws.send(`token,${sessionStorage.TOKEN}`);
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

                        break;
                    }

                    case 'token': {
                        if (responseData === 'invalido') {
                            sessionStorage.removeItem("TOKEN");
                            window.location.reload();
                        }
                        break;
                    }

                    case 'ping': {
                        console.log("delay::", (new Date().getTime() - responseData), "ms");
                        break;
                    }
                }
                return false;
            };
        },

        /*
            CHATS
        */

        newChat(context, payload) {
            const chat = context.state.chats.find((element) => {
                return element.id === payload.id;
            });
            if (!chat) {
                context.dispatch("setChatProperties", payload);
                context.commit("ADD_NEW_CHAT", payload);
                context.dispatch("sortChatsByTime");
            }
        },

        getPicture(context, payload) {
            context.state.ws.send(`updatePicture,${payload.chatId}`);
        },

        updatePicture(context, payload) {
            const chat = context.state.chats.find((element) => {
                return element.id === payload.id;
            });

            if (chat) {
                chat.picture = payload.picture;
            }
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
            const chat = context.state.chats.find((element) => {
                return element.id === payload.id;
            });

            if (chat) {
                Object.assign(chat, payload);
            }
        },

        sortChatsByTime(context) {
            const chats = context.state.chats;

            chats.sort(function (a, b) {
                var n = a.pin || 0
                    , r = b.pin || 0;
                if (n || r)
                    return n !== r ? n > r ? -1 : 1 : a.id._serialized < b.id._serialized ? -1 : 1;

                let aMsgsFiltered = a.msgs.filter(e => e.type !== 'e2e_notification');
                let bMsgsFiltered = b.msgs.filter(e => e.type !== 'e2e_notification');
                if (aMsgsFiltered[aMsgsFiltered.length - 1] === undefined && bMsgsFiltered[bMsgsFiltered.length - 1] === undefined) {
                    return 0;
                }
                if (aMsgsFiltered[aMsgsFiltered.length - 1] !== undefined && bMsgsFiltered[bMsgsFiltered.length - 1] === undefined) {
                    return -1;
                }
                if (aMsgsFiltered[aMsgsFiltered.length - 1] === undefined && bMsgsFiltered[bMsgsFiltered.length - 1] !== undefined) {
                    return 1;
                }
                if (aMsgsFiltered[aMsgsFiltered.length - 1].t < bMsgsFiltered[bMsgsFiltered.length - 1].t) {
                    return 1;
                }
                if (aMsgsFiltered[aMsgsFiltered.length - 1].t > bMsgsFiltered[bMsgsFiltered.length - 1].t) {
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

            const chat = context.state.chats.find((element) => {
                if (payload.id.fromMe) {
                    return element.id === payload.to;
                } else {
                    return element.id === payload.from;
                }
            });

            if (chat) {
                const msg = chat.msgs.find((element) => {
                    return element.id.id === payload.id.id;
                });

                if (!msg) {
                    chat.msgs.push(payload);

                    chat.msgs.sort(function (a, b) {
                        if (a.t > b.t) {
                            return 1;
                        }
                        if (a.t < b.t) {
                            return -1;
                        }
                        return 0;
                    });

                    context.dispatch("sortChatsByTime");
                }
            }
        },

        updateMsg(context, payload) {
            let chatId;
            if (payload.id.fromMe) {
                chatId = payload.to;
            } else {
                chatId = payload.from;
            }

            const chat = context.state.chats.find((element) => {
                return element.id === chatId;
            });

            if (chat) {
                const msg = chat.msgs.find((element) => {
                    return element.id.id === payload.id.id;
                });

                if (msg) {
                    msg.ack = payload.ack;
                }
            }
        },

        addFullMediaInMsg(context, payload) {
            const idChat = payload.idChat;
            const idMsg = payload.idMsg;
            const media = payload.media;

            const chat = context.state.chats.find((element) => {
                return element.id === idChat;
            });

            if (chat) {
                const msg = chat.msgs.find((element) => {
                    return element.id === idMsg;
                });

                if (msg) {
                    msg.base64MediaFull = media;
                }
            }

        },


    },
    modules: {}
});

export default store;