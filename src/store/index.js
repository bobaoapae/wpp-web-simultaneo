import Vue from 'vue';
import Vuex from 'vuex';
import uniqueid from 'uniqid';
import visibility from 'vue-visibility-change';

Vue.use(Vuex);

const store = new Vuex.Store({
    state: {
        isLogged: false,
        isQrCodeLogged: false,
        isLoadingChat: true,
        imgQrCode: '',
        QrCodeStatus: '',
        self: null,
        contacts: null,
        chats: null,
        pictures: [],
        medias: [],
        timeOutChats: -1,
        activeChat: null,
        poolContext: [],
        modal: {
            type: '',
            media: '',
            show: false,
            id: ''
        },
        ws: {},
        wsEvents: {},
        intervalPong: -1,
        intervalPresence: -1,
        audio: null
    },

    mutations: {
        SET_IS_LOGGED (state, payload) {
            state.isLogged = payload;
        },

        SET_QR_CODE_LOGGED (state, payload) {
            state.isQrCodeLogged = payload;
        },

        SET_IS_LOADING_CHAT (state, payload) {
            state.isLoadingChat = payload;
        },

        SET_IMG_QRCODE (state, payload) {
            state.imgQrCode = payload;
        },

        // chat que esta sendo visualizado
        SET_ACTIVE_CHAT (state, payload) {
            console.log('activeChat: ', payload);
            state.activeChat = payload;
        },

        // define as informações do wpp logado
        SET_SELF (state, payload) {
            state.self = payload;
        },

        SET_CONTACTS (state, payload) {
            state.contacts = payload.contacts;
        },

        // define a lista com todos os chats
        SET_CHATS (state, payload) {
            state.chats = payload;
        },

        SET_MODAL (state, payload) {
            state.modal.type = payload.type;
            state.modal.media = payload.media;
            state.modal.show = payload.show;
            state.modal.id = payload.id;
        },

        UPDATE_CHAT (state, payload) {
            state.chats[payload.indexChat].muteExpiration = payload.chat.muteExpiration;
            state.chats[payload.indexChat].name = payload.chat.name;
            state.chats[payload.indexChat].noEarlierMsgs = payload.chat.noEarlierMsgs;
            state.chats[payload.indexChat].pin = payload.chat.pin;
            state.chats[payload.indexChat].t = payload.chat.t;
            state.chats[payload.indexChat].unreadCount = payload.chat.unreadCount;
            state.chats[payload.indexChat].shouldAppearInList = payload.chat.shouldAppearInList;
        },

        SET_WS (state, payload) {
            state.ws = payload;
        },

        ADD_NEW_CHAT (state, payload) {
            state.chats.push(payload);
        },

        REMOVE_CHAT (state, payload) {
            state.chats = state.chats.filter(e => e.id !== payload.id);
        },

        ADD_NEW_LISTENNER (state, payload) {
            state.wsEvents[payload.tag] = {
                resolve: (e) => {
                    payload.resolve(e);
                    delete state.wsEvents[payload.tag];
                },
                reject: (e) => {
                    payload.reject(e);
                    delete state.wsEvents[payload.tag];
                }
            };
        },

        NEW_MSG_WS (state, payload) {
            if (state.wsEvents[payload.tag]) {
                let webSocketResponse = JSON.parse(payload.data);
                if (webSocketResponse.status === 200 || webSocketResponse.status === 201) {
                    state.wsEvents[payload.tag].resolve(webSocketResponse.response);
                } else {
                    state.wsEvents[payload.tag].reject(webSocketResponse);
                }
            }
        },

        SET_TIMEOUT_CHATS (state, payload) {
            if (state.timeOutChats !== -1) {
                clearTimeout(state.timeOutChats);
            }
            state.timeOutChats = payload;
        },

        ADD_PICTURE_TO_CACHE (state, payload) {
            state.pictures[payload.id] = payload.picture;
        },

        ADD_MEDIA_TO_CACHE (state, payload) {
            state.medias[payload.id] = payload.data;
        },

        INTERVAL_PONG (state, payload) {
            if (state.intervalPong !== -1) {
                clearInterval(state.intervalPong);
            }
            state.intervalPong = payload;
        },

        INTERVAL_PRESENCE (state, payload) {
            if (state.intervalPresence !== -1) {
                clearInterval(state.intervalPresence);
            }
            state.intervalPresence = payload;
        },

        SET_AUDIO (state, payload) {
            state.audio = payload;
        }
    },

    actions: {
        setNewEvent (context) {
            context.commit('SET_WS', new WebSocket(`${localStorage.baseURL.replace('http', 'ws')}/api/ws`));

            const ws = context.state.ws;

            ws.onopen = function (e) {
                context.dispatch('sendWsMessage', { event: 'token', payload: sessionStorage.TOKEN }).catch(reason => {
                    sessionStorage.removeItem('TOKEN');
                    window.location.reload();
                });
            };
            ws.onclose = function (e) {
                console.log('Ws Close', e);
                window.location.reload();
            };
            ws.onerror = function (e) {
                console.log('Ws Error', e);
                window.location.reload();
            };

            ws.onmessage = function (e) {
                const response = e.data.split(/,(.+)/);

                const responseType = response[0];
                const responseData = response[1];
                switch (responseType) {
                    case 'need-qrcode': {
                        context.commit('SET_IMG_QRCODE', responseData);

                        break;
                    }

                    case 'update-estado': {
                        if (responseData === 'QR_CODE_SCANNED') {
                            context.commit('SET_QR_CODE_LOGGED', true);
                        } else if (responseData === 'LOADING_STORE') {
                            context.commit('SET_QR_CODE_LOGGED', true);
                        } else if (responseData === 'LOGGED') {
                            context.commit('SET_QR_CODE_LOGGED', true);
                        } else if (responseData === 'WAITING_QR_CODE_SCAN') {
                            context.commit('SET_QR_CODE_LOGGED', false);
                            context.commit('SET_IS_LOADING_CHAT', true);
                        }

                        break;
                    }

                    case 'init': {
                        const r = JSON.parse(responseData);
                        console.log('init', r);

                        context.dispatch('handleChatProperties', { chats: r.chats });
                        context.dispatch('sortChatsByTime');
                        context.commit('SET_SELF', r.self);
                        context.commit('SET_CONTACTS', { contacts: r.contacts });
                        context.commit('SET_IS_LOADING_CHAT', false);
                        context.state.poolContext.forEach(func => func());
                        context.state.poolContext = [];
                        context.dispatch('initPong');
                        context.dispatch('initPresenceInterval');

                        break;
                    }

                    case 'new-chat': {
                        const r = JSON.parse(responseData);

                        let funcao = () => {
                            context.dispatch('newChat', r);
                        };

                        if (context.state.isLoadingChat) {
                            context.state.poolContext.push(funcao);
                        } else {
                            funcao();
                        }

                        break;
                    }

                    case 'update-chat': {
                        const r = JSON.parse(responseData);

                        let funcao = () => {
                            context.dispatch('updateChat', r);
                        };

                        if (context.state.isLoadingChat) {
                            context.state.poolContext.push(funcao);
                        } else {
                            funcao();
                        }

                        break;
                    }

                    case 'remove-chat': {
                        const r = JSON.parse(responseData);

                        let funcao = () => {
                            context.commit('REMOVE_CHAT', r);
                        };

                        if (context.state.isLoadingChat) {
                            context.state.poolContext.push(funcao);
                        } else {
                            funcao();
                        }

                        break;
                    }

                    case 'remove-msg': {
                        const r = JSON.parse(responseData);

                        let funcao = () => {
                            context.dispatch('removeMsgFromChat', r);
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
                            context.dispatch('addNewMsgInChat', r);
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
                            context.dispatch('updateMsg', r);
                        };

                        if (context.state.isLoadingChat) {
                            context.state.poolContext.push(funcao);
                        } else {
                            funcao();
                        }

                        break;
                    }

                    default: {
                        context.commit('NEW_MSG_WS', { tag: responseType, data: responseData });
                    }
                }
                return false;
            };
        },

        sendWsMessage (context, payload) {
            return new Promise((resolve, reject) => {
                let payLoadSend = {
                    tag: uniqueid(),
                    webSocketRequestPayLoad: payload
                };
                if (typeof (payLoadSend.webSocketRequestPayLoad.payload) === 'object') {
                    payLoadSend.webSocketRequestPayLoad.payload = JSON.stringify(payLoadSend.webSocketRequestPayLoad.payload);
                }
                context.commit('ADD_NEW_LISTENNER', { tag: payLoadSend.tag, resolve: resolve, reject: reject });
                context.state.ws.send(JSON.stringify(payLoadSend));
            });
        },

        updateTitle (context) {
            let chatsUnread = context.state.chats.filter(e => e.unreadCount > 0).length;
            if (chatsUnread > 0) {
                document.title = `(${chatsUnread}) WhatsApp`;
            } else {
                document.title = 'WhatsApp';
            }
        },

        findFormattedNameFromId (context, payload) {
            const el = context.state.contacts.find(el => el.id === payload.id);

            if (el && el.formattedName) {
                return el.formattedName;
            }
            return '+' + (payload.id.split('@')[0]);
        },

        findChatFromId (context, payload) {
            return new Promise((resolve, reject) => {
                const chat = context.state.chats.find(chat => chat.id === payload.id);

                if (!chat) {
                    context.dispatch('sendWsMessage', { event: 'findChat', payload: payload.id }).then(chat => {
                        context.dispatch('newChat', chat);
                        resolve(chat);
                    }).catch(reason => reject(reason));
                } else {
                    resolve(chat);
                }
            });
        },

        initPong (context) {
            context.commit('INTERVAL_PONG', setInterval(() => {
                context.dispatch('checkDelayToServer').then(value => console.log('delay::', value, 'ms'));
            }, 10000));
        },

        initPresenceInterval (context) {
            if (visibility.hidden()) {
                context.dispatch('sendPresenceStatus', { type: 'Unavailable' });
            } else {
                context.dispatch('sendPresenceStatus', { type: 'Available' });
            }
            visibility.change((evt, hidden) => {
                if (hidden) {
                    context.commit('INTERVAL_PRESENCE', setInterval(() => {
                        context.dispatch('sendPresenceStatus', { type: 'Unavailable' });
                    }, 5000));
                } else {
                    context.dispatch('sendPresenceStatus', { type: 'Available' });
                    context.commit('INTERVAL_PRESENCE', setInterval(() => {
                        context.dispatch('sendPresenceStatus', { type: 'Available' });
                    }, 5000));
                }
            });
        },

        checkDelayToServer (context) {
            return new Promise((resolve, reject) => {
                let time = new Date().getTime();
                context.dispatch('sendWsMessage', { event: 'pong' }).then(result => {
                    resolve(new Date().getTime() - time);
                }).catch(reason => reject(reason));
            });
        },

        findPictureFromId (context, payload) {
            return new Promise((resolve, reject) => {
                if (context.state.pictures[payload.id]) {
                    resolve(context.state.pictures[payload.id]);
                } else {
                    context.dispatch('sendWsMessage', { event: 'findPicture', payload: payload.id }).then(picture => {
                        context.commit('ADD_PICTURE_TO_CACHE', { id: payload.id, picture: picture });
                        resolve(picture);
                    }).catch(reason => reject(reason));
                }
            });
        },

        downloadMedia (context, payload) {
            return new Promise((resolve, reject) => {
                if (context.state.medias[payload.id]) {
                    resolve(context.state.medias[payload.id]);
                } else {
                    context.dispatch('sendWsMessage', { event: 'downloadMedia', payload: payload.id }).then(data => {
                        context.commit('ADD_MEDIA_TO_CACHE', { id: payload.id, data: data });
                        resolve(data);
                    }).catch(reason => reject(reason));
                }
            });
        },

        sendPresenceStatus (context, payload) {
            return new Promise((resolve, reject) => {
                context.dispatch('sendWsMessage', { event: `sendPresence${payload.type}` }).then(data => {
                    resolve(data);
                }).catch(reason => reject(reason));
            });
        },

        findCustomProperties (context, payload) {
            return new Promise((resolve, reject) => {
                setTimeout(() => { resolve([{ key: 'teste' + payload.id, value: 'valor' }, { key: 'teste2', value: 'valor2' }]); }, 2000);
                /* context.dispatch('sendWsMessage', { event: 'findCustomProperties', payload: payload.id }).then(data => {
                    resolve(data);
                }).catch(reason => reject(reason)); */
            });
        },

        /*
              CHATS
          */

        newChat (context, payload) {
            const chat = context.state.chats.find((element) => {
                return element.id === payload.id;
            });
            if (!chat) {
                context.dispatch('setChatProperties', payload);
                context.commit('ADD_NEW_CHAT', payload);
                context.dispatch('sortChatsByTime');
            }
        },

        setChatProperties (context, el) {
            if (!Array.isArray(el)) {
                setProperties(el);
            } else {
                el.forEach(el => {
                    setProperties(el);
                });
            }
            function setProperties (el) {
                el.quotedMsg = undefined;
                el.msgsGrouped = {};
                el.openChatInfo = false;
                el.customProperties = {
                    properties: [],
                    loaded: false
                };
                el.customProperties.loadProperties = function () {
                    this.loaded = false;
                    return context.dispatch('findCustomProperties', { id: el.id }).then(value => {
                        this.properties = value;
                        this.loaded = true;
                    });
                };
                Object.defineProperty(el, 'lastMsg', {
                    get () {
                        let array = this.msgs.filter(e => e.type !== 'e2e_notification' && e.type !== 'gp2').sort((a, b) => {
                            if (a.t < b.t) {
                                return -1;
                            }
                            if (a.t > b.t) {
                                return 1;
                            }
                            return 0;
                        }).slice(-1);
                        if (array.length > 0) {
                            return array[0];
                        }
                        return undefined;
                    },
                    set (v) {
                    }
                });
            }
        },

        handleChatProperties (context, payload) {
            context.dispatch('setChatProperties', payload.chats);

            context.commit('SET_CHATS', payload.chats);
            context.dispatch('updateTitle');
        },

        updateChat (context, payload) {
            const chat = context.state.chats.find((element) => {
                return element.id === payload.id;
            });

            if (chat) {
                delete payload.msgs;
                let sortChats = chat.pin !== payload.pin;
                Object.assign(chat, payload);
                context.dispatch('updateTitle');
                if (sortChats) {
                    context.dispatch('sortChatsByTime');
                }
            }
        },

        sortChatsByTime (context) {
            context.commit('SET_TIMEOUT_CHATS', setTimeout(() => {
                const chats = context.state.chats;

                chats.sort(function (a, b) {
                    let n = a.pin || 0;
                    let r = b.pin || 0;
                    if (n || r) { return n !== r ? n > r ? -1 : 1 : a.id._serialized < b.id._serialized ? -1 : 1; }

                    if (a.lastMsg === undefined && b.lastMsg === undefined) {
                        return 0;
                    }
                    if (a.lastMsg !== undefined && b.lastMsg === undefined) {
                        return -1;
                    }
                    if (a.lastMsg === undefined && b.lastMsg !== undefined) {
                        return 1;
                    }
                    if (a.lastMsg.t < b.lastMsg.t) {
                        return 1;
                    }
                    if (a.lastMsg.t > b.lastMsg.t) {
                        return -1;
                    }
                    return 0;
                });

                context.commit('SET_CHATS', chats);
                context.dispatch('updateTitle');
                context.dispatch('groupMsgsByDate');
            }, 100));
        },

        groupMsgsByDate (context) {
            let chats = context.state.chats;
            chats.forEach((chat) => {
                let msgsGrouped = {};
                chat.msgs.forEach((msg) => {
                    let a = new Date(msg.t * 1000);
                    let year = a.getFullYear();
                    let mes = a.getMonth() + 1;
                    let date = a.getDate();
                    let hoje = new Date();
                    let hojeDia = hoje.getDate();
                    let hojeMes = hoje.getMonth() + 1;

                    let fraseDia = `${year}-${mes}-${date}`;
                    if (hojeDia === date && hojeMes === mes) {
                        fraseDia = 'hoje';
                    } else if (hojeDia - date === 1 && hojeMes === mes) {
                        fraseDia = 'ontem';
                    }
                    if (!msgsGrouped[fraseDia]) {
                        msgsGrouped[fraseDia] = { firstMsg: msg, msgs: [] };
                    }
                    msgsGrouped[fraseDia].msgs.push(msg);
                });
                chat.msgsGrouped = msgsGrouped;
            });
        },

        playNewMsgNotification (context, payload) {
            if (!context.state.audio) {
                context.commit('SET_AUDIO', new Audio(require('@/assets/audio/web_whatsapp.mp3')));
            }
            context.state.audio.play();
        },

        /*
              MESSAGES
          */
        deleteMsg (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'deleteMessage', payload: payload });
        },

        sendMsg (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'sendMessage', payload: payload });
        },

        seeChat (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'seeChat', payload: payload.chatId });
        },

        subscribePresence (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'subscribePresence', payload: payload.chatId });
        },

        loadEarly (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'loadEarly', payload: payload.chatId });
        },

        markPlayed (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'markPlayed', payload: payload.msgId });
        },

        addNewMsgInChat (context, payload) {
            const chat = context.state.chats.find((element) => {
                if (payload.id.fromMe) {
                    return element.id === payload.to;
                }
                return element.id === payload.from;
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
                    context.dispatch('sortChatsByTime');
                    if ((!payload.id.fromMe && chat.muteExpiration <= 0) && (chat.lastMsg.t < payload.t || chat.lastMsg.id === payload.id)) {
                        context.dispatch('playNewMsgNotification');
                    }
                }
            }
        },

        removeMsgFromChat (context, payload) {
            const chat = context.state.chats.find((element) => {
                if (payload.id.fromMe) {
                    return element.id === payload.to;
                }
                return element.id === payload.from;
            });

            if (chat) {
                chat.msgs = chat.msgs.filter(e => e.id.id !== payload.id.id);
                context.dispatch('sortChatsByTime');
            }
        },

        updateMsg (context, payload) {
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
                    return element.id.id === payload.id.id || element.id.id === payload.oldId.id;
                });

                if (msg) {
                    msg.ack = payload.ack;
                    msg.type = payload.type;
                    msg.id = payload.id;
                }
            }
        },

        addFullMediaInMsg (context, payload) {
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
        }

    },
    modules: {}
});

export default store;
