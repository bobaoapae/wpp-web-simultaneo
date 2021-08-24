import { reactive } from 'vue';
import { createStore } from 'vuex';
import { v4 as uuid } from 'uuid';
import visibility from 'vue-visibility-change';
import vCardParse from 'vcard-parser';
import api from '@/api';
import randomColor from 'random-color';
import WebSocketWorker from '@/ws-worker/worker.js?worker';
import throttledQueue from 'throttled-queue';
import pako from 'pako';

const store = createStore({
    state () {
        return {
            user: {},
            token: '',
            isLogged: false,
            isQrCodeLogged: false,
            isLoadingChat: true,
            imgQrCode: '',
            QrCodeStatus: '',
            self: {},
            contacts: [],
            findChats: {},
            findChatsByNumber: {},
            findContacts: {},
            findContactsByNumber: {},
            chats: [],
            myChats: [],
            quickReplies: [],
            pictures: {},
            medias: {},
            timeOutChats: -1,
            activeChat: null,
            selectMsgs: { show: false, msgs: [] },
            selectChats: { show: false, chats: [] },
            poolContext: [],
            modal: {
                type: '',
                media: '',
                show: false,
                id: ''
            },
            modalDeleteMsg: {
                show: false,
                msg: null
            },
            showNewChat: false,
            wsEvents: {},
            promisesWsEvents: {},
            intervalPong: -1,
            timeoutPresence: -1,
            timeoutIdle: -1,
            audio: null,
            visible: true,
            idle: false,
            wsWorker: null,
            driverState: ''
        };
    },
    mutations: {
        RESET_WPP (state) {
            state.self = {};
            state.contacts = [];
            state.chats = [];
            state.myChats = [];
            state.quickReplies = [];
            state.pictures = {};
            state.medias = {};
            state.activeChat = null;
            state.modal.show = false;
            state.poolContext = [];
            for (let key in state.wsEvents) {
                let event = state.wsEvents[key];
                event.reject(new Error('WhatsApp Re-logged'));
            }
            state.wsEvents = {};
            for (let key in state.findChats) {
                let event = state.findChats[key];
                event.reject(new Error('WhatsApp Re-logged'));
            }
            state.findChats = {};
        },

        SET_CURRENT_USER (state, payload) {
            Object.defineProperty(payload, 'superConfiguracao', {
                get () {
                    if (this.permissao.permissao === 'ROLE_OPERATOR') {
                        return this.usuarioPai.configuracao;
                    }
                    return this.configuracao;
                }
            });
            Object.defineProperty(payload, 'isOperator', {
                get () {
                    return this.permissao && this.permissao.permissao === 'ROLE_OPERATOR';
                }
            });
            Object.defineProperty(payload, 'isUser', {
                get () {
                    return this.permissao && this.permissao.permissao === 'ROLE_USER';
                }
            });
            Object.defineProperty(payload, 'isAdmin', {
                get () {
                    return this.permissao && this.permissao.permissao === 'ROLE_ADMIN';
                }
            });
            Object.defineProperty(payload, 'isSuperAdmin', {
                get () {
                    return this.permissao && this.permissao.permissao === 'ROLE_SUPER_ADMIN';
                }
            });
            Object.defineProperty(payload, 'canCreateOperator', {
                get () {
                    return !this.isOperator;
                }
            });
            state.user = payload;
        },

        SET_TOKEN (state, payload) {
            state.token = payload;
        },

        SET_IS_LOGGED (state, payload) {
            state.isLogged = payload;
        },

        SET_QR_CODE_LOGGED (state, payload) {
            state.isQrCodeLogged = payload;
        },

        SET_IS_LOADING_CHAT (state, payload) {
            state.isLoadingChat = payload;
        },

        SET_DRIVER_STATE (state, payload) {
            state.driverState = payload;
        },

        SET_IMG_QRCODE (state, payload) {
            state.imgQrCode = payload;
        },

        SET_ACTIVE_CHAT (state, payload) {
            console.log('activeChat: ', payload);
            state.activeChat = payload;
            state.selectMsgs.show = false;
        },

        SET_SELECT_MSGS (state, payload) {
            state.selectMsgs.show = payload.show;
            state.selectMsgs.msgs = [];
        },

        TOGGLE_SELECT_MSG (state, payload) {
            if (state.selectMsgs.msgs.includes(payload.msg)) {
                state.selectMsgs.msgs = state.selectMsgs.msgs.filter(e => e !== payload.msg);
            } else {
                state.selectMsgs.msgs.push(payload.msg);
            }
        },

        SET_SELECT_CHATS (state, payload) {
            state.selectChats.show = payload.show;
            state.selectChats.chats = [];
        },

        TOGGLE_SELECT_CHAT (state, payload) {
            if (state.selectChats.chats.includes(payload.chat)) {
                state.selectChats.chats = state.selectChats.chats.filter(e => e !== payload.chat);
            } else {
                state.selectChats.chats.push(payload.chat);
            }
        },

        TOGGLE_MODAL_DELETE_MSG (state, payload) {
            state.modalDeleteMsg.show = payload.show;
            state.modalDeleteMsg.msg = payload.msg;
        },

        SET_SHOW_NEW_CHAT (state, payload) {
            state.showNewChat = payload;
        },

        SET_SELF (state, payload) {
            Object.assign(state.self, payload);
        },

        SET_CONTACTS (state, payload) {
            state.contacts = payload;
        },

        SET_QUICK_REPLIES (state, payload) {
            state.quickReplies = payload;
        },

        SET_CHATS (state, payload) {
            state.chats = payload;
        },

        SET_MY_CHATS (state, payload) {
            state.myChats = payload;
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

        SET_WS_WORKER (state, payload) {
            if (state.wsWorker) {
                state.wsWorker.terminate();
            }
            state.wsWorker = payload;
        },

        ADD_NEW_CHAT (state, payload) {
            state.chats.push(payload);
        },

        ADD_NEW_CONTACT (state, payload) {
            state.contacts.push(payload);
        },

        REMOVE_CHAT (state, payload) {
            state.chats = state.chats.filter(e => e.id !== payload.id);
            if (state.activeChat && state.activeChat.id === payload.id) {
                state.activeChat = null;
            }
        },

        ADD_NEW_LISTENER (state, payload) {
            state.wsEvents[payload.tag] = {
                resolve: (e) => {
                    payload.resolve(e);
                    delete state.wsEvents[payload.tag];
                },
                reject: (e) => {
                    payload.reject(e);
                    delete state.wsEvents[payload.tag];
                },
                frames: []
            };
        },

        NEW_MSG_WS (state, payload) {
            let wsEvent = state.wsEvents[payload.tag];
            if (wsEvent) {
                let webSocketResponse = JSON.parse(payload.data);
                if (webSocketResponse.status === 200 || webSocketResponse.status === 201) {
                    if (webSocketResponse.frameId) {
                        wsEvent.frames.push(webSocketResponse);
                        if (wsEvent.frames.length === webSocketResponse.qtdFrames) {
                            let frames = wsEvent.frames.sort((a, b) => a.frameId - b.frameId);
                            let response = '';
                            for (let x = 0; x < frames.length; x++) {
                                let data = frames[x].response;
                                response += data;
                            }
                            try {
                                response = JSON.parse(response);
                            } catch (e) {
                                console.log(e);
                            }
                            wsEvent.resolve(response);
                        }
                    } else {
                        wsEvent.resolve(webSocketResponse.response);
                    }
                } else {
                    console.error(webSocketResponse);
                    wsEvent.reject(webSocketResponse);
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
            if (!state.pictures[payload.type]) {
                state.pictures[payload.type] = [];
            }
            state.pictures[payload.full === true ? 'full' : 'min'][payload.id] = {
                picture: payload.picture,
                t: payload.t
            };
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

        TIMEOUT_PRESENCE (state, payload) {
            if (state.timeoutPresence !== -1) {
                clearTimeout(state.timeoutPresence);
            }
            state.timeoutPresence = payload;
        },

        TIMEOUT_IDLE (state, payload) {
            if (state.timeoutIdle !== -1) {
                clearTimeout(state.timeoutIdle);
            }
            state.timeoutIdle = payload;
        },

        SET_AUDIO (state, payload) {
            state.audio = payload;
        },

        ADD_PROMISE_WS_EVENT (state, payload) {
            if (!state.promisesWsEvents[payload.event]) {
                state.promisesWsEvents[payload.event] = [];
            }
            state.promisesWsEvents[payload.event].push(payload.promise);
        },

        SET_VISIBLE (state, payload) {
            state.visible = payload;
        },

        SET_IDLE (state, payload) {
            state.idle = payload;
        },

        ADD_FIND_CHAT (state, payload) {
            state.findChats[payload.id] = payload;
            payload.promise.finally(() => {
                delete state.findChats[payload.id];
            });
        },

        ADD_FIND_CHAT_BY_NUMBER (state, payload) {
            state.findChatsByNumber[payload.id] = payload;
            payload.promise.finally(() => {
                delete state.findChatsByNumber[payload.id];
            });
        },

        ADD_FIND_CONTACT (state, payload) {
            state.findContacts[payload.id] = payload;
            payload.promise.finally(() => {
                delete state.findContacts[payload.id];
            });
        }
    },

    actions: {
        setNewEvent (context) {
            context.commit('RESET_WPP');
            context.commit('SET_TOKEN', sessionStorage.TOKEN);
            context.commit('SET_WS_WORKER', WebSocketWorker());
            const wsWorker = context.state.wsWorker;

            wsWorker.postMessage({ cmd: 'ws-init', data: `${localStorage.baseURL.replace('http', 'ws')}/api/ws` });

            wsWorker.addEventListener('message', async (event) => {
                let cmd = event.data.cmd;
                let data = event.data.data;
                switch (cmd) {
                    case 'ws-open': {
                        context.dispatch('sendWsMessage', {
                            event: 'token',
                            payload: sessionStorage.TOKEN
                        }).catch(reason => {
                            console.error(reason);
                            sessionStorage.removeItem('TOKEN');
                            sessionStorage.removeItem('USER');
                            window.location.reload();
                        });
                        break;
                    }
                    case 'ws-close': {
                        console.log('wsClose::', data);
                        if (data !== 4000) {
                            window.location.reload();
                        }
                        break;
                    }
                    case 'ws-error': {
                        console.log('wsError::', data);
                        window.location.reload();
                        break;
                    }
                    case 'ws-message': {
                        let compressData = atob(data.data);
                        compressData = compressData.split('').map(function (e) {
                            return e.charCodeAt(0);
                        });
                        let payload = new TextDecoder('utf-8').decode(pako.inflate(new Uint8Array(compressData)));
                        let eventOrTag = data.cmd;
                        switch (eventOrTag) {
                            case 'need-qrcode': {
                                context.commit('SET_IMG_QRCODE', payload);

                                break;
                            }

                            case 'update-state': {
                                context.commit('SET_DRIVER_STATE', payload);
                                if (payload === 'QR_CODE_SCANNED') {
                                    context.commit('SET_QR_CODE_LOGGED', true);
                                } else if (payload === 'WAITING_SYNC' || payload === 'LOADING_STORE') {
                                    context.commit('SET_IS_LOADING_CHAT', true);
                                    context.commit('SET_QR_CODE_LOGGED', true);
                                } else if (payload === 'LOGGED') {
                                    context.commit('SET_QR_CODE_LOGGED', true);

                                    let selfInfo = await context.dispatch('getSelfInfo');
                                    context.commit('RESET_WPP');
                                    context.commit('SET_SELF', selfInfo.self);

                                    let init = performance.now();
                                    context.dispatch('getAllChats').then(async chats => {
                                        console.log('chats::', chats);
                                        await context.dispatch('handleSetChats', chats);
                                        await context.dispatch('sortChatsByTime');
                                        console.log('time get all chats::', performance.now() - init);
                                        for await (let func of context.state.poolContext) {
                                            func();
                                        }
                                        context.state.poolContext = [];
                                        await context.dispatch('initPong');
                                        await context.dispatch('initPresenceTimeout');
                                        await context.dispatch('appActive');
                                        context.commit('SET_IS_LOADING_CHAT', false);
                                    });

                                    context.dispatch('getAllContacts').then(contacts => {
                                        console.log('contacts::', contacts);
                                        context.commit('SET_CONTACTS', contacts);
                                    });

                                    if (selfInfo.isBusiness) {
                                        context.dispatch('getAllQuickReplies').then(quickReplies => {
                                            context.commit('SET_QUICK_REPLIES', quickReplies);
                                        });
                                    }
                                } else if (payload === 'WAITING_QR_CODE_SCAN' || payload === 'LOADING' || payload === 'WAITING_LOAD') {
                                    context.commit('SET_QR_CODE_LOGGED', false);
                                    context.commit('SET_IS_LOADING_CHAT', true);
                                    if (payload === 'WAITING_LOAD' || payload === 'LOADING') {
                                        context.commit('SET_IMG_QRCODE', '');
                                    }
                                }

                                break;
                            }

                            case 'new-chat': {
                                const r = JSON.parse(payload);

                                let funcao = async () => {
                                    await context.dispatch('newChat', r);
                                };

                                if (context.state.isLoadingChat) {
                                    context.state.poolContext.push(funcao);
                                } else {
                                    await funcao();
                                }

                                break;
                            }

                            case 'update-chat': {
                                const r = JSON.parse(payload);

                                let funcao = async () => {
                                    await context.dispatch('updateChat', r);
                                };

                                if (context.state.isLoadingChat) {
                                    context.state.poolContext.push(funcao);
                                } else {
                                    await funcao();
                                }

                                break;
                            }

                            case 'remove-chat': {
                                const r = JSON.parse(payload);

                                let funcao = async () => {
                                    context.commit('REMOVE_CHAT', r);
                                };

                                if (context.state.isLoadingChat) {
                                    context.state.poolContext.push(funcao);
                                } else {
                                    await funcao();
                                }

                                break;
                            }

                            case 'remove-msg': {
                                const r = JSON.parse(payload);

                                let funcao = async () => {
                                    if (Array.isArray(r)) {
                                        for (const msg of r) {
                                            await context.dispatch('removeMsgFromChat', msg);
                                        }
                                    } else {
                                        await context.dispatch('removeMsgFromChat', r);
                                    }
                                };

                                if (context.state.isLoadingChat) {
                                    context.state.poolContext.push(funcao);
                                } else {
                                    await funcao();
                                }

                                break;
                            }

                            case 'new-msg': {
                                const r = JSON.parse(payload);

                                let funcao = async () => {
                                    if (Array.isArray(r)) {
                                        for (const msg of r) {
                                            await context.dispatch('addNewMsgInChat', msg);
                                        }
                                    } else {
                                        await context.dispatch('addNewMsgInChat', r);
                                    }
                                };

                                if (context.state.isLoadingChat) {
                                    context.state.poolContext.push(funcao);
                                } else {
                                    await funcao();
                                }

                                break;
                            }

                            case 'update-msg': {
                                const r = JSON.parse(payload);

                                let funcao = async () => {
                                    if (Array.isArray(r)) {
                                        for (const msg of r) {
                                            await context.dispatch('updateMsg', msg);
                                        }
                                    } else {
                                        await context.dispatch('updateMsg', r);
                                    }
                                };

                                if (context.state.isLoadingChat) {
                                    context.state.poolContext.push(funcao);
                                } else {
                                    await funcao();
                                }

                                break;
                            }

                            case 'change-property-chat': {
                                const r = JSON.parse(payload);

                                let funcao = async () => {
                                    await context.dispatch('changeCustomPropertyChat', r);
                                };

                                if (context.state.isLoadingChat) {
                                    context.state.poolContext.push(funcao);
                                } else {
                                    await funcao();
                                }

                                break;
                            }

                            case 'remove-property-chat': {
                                const r = JSON.parse(payload);

                                let funcao = async () => {
                                    await context.dispatch('removeCustomPropertyChat', r);
                                };

                                if (context.state.isLoadingChat) {
                                    context.state.poolContext.push(funcao);
                                } else {
                                    await funcao();
                                }

                                break;
                            }

                            default: {
                                context.commit('NEW_MSG_WS', { tag: eventOrTag, data: payload });
                            }
                        }
                        break;
                    }
                }
            });
        },

        sendWsMessage (context, payload) {
            return new Promise((resolve, reject) => {
                let payLoadSend = {
                    tag: uuid(),
                    webSocketRequestPayLoad: payload
                };
                if (typeof (payLoadSend.webSocketRequestPayLoad.payload) === 'object') {
                    payLoadSend.webSocketRequestPayLoad.payload = JSON.stringify(payLoadSend.webSocketRequestPayLoad.payload);
                }
                context.commit('ADD_NEW_LISTENER', { tag: payLoadSend.tag, resolve: resolve, reject: reject });
                setTimeout(() => reject(new Error('Timeout::' + payload.event)), 60000);
                context.state.wsWorker.postMessage({
                    cmd: 'ws-send',
                    data: payLoadSend
                });
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
            return new Promise((resolve, reject) => {
                context.dispatch('findContactFromId', payload).then(el => {
                    if (el && el.formattedName) {
                        resolve(el.formattedName);
                    } else {
                        resolve('+' + (payload.id.split('@')[0]));
                    }
                }).catch(reason => {
                    reject(reason);
                });
            });
        },

        findChatFromId (context, payload) {
            return new Promise((resolve, reject) => {
                const chat = context.state.chats.find(chat => chat.id === payload.id);
                let findChat = context.state.findChats[payload.id];
                if (!chat) {
                    if (!findChat) {
                        findChat = new Promise((resolve1, reject1) => {
                            context.dispatch('sendWsMessage', { event: 'findChat', payload: payload.id }).then(chat => {
                                context.dispatch('newChat', chat).then((chat) => {
                                    resolve1(chat);
                                });
                            }).catch(reason => reject1(reason));
                        });
                        context.commit('ADD_FIND_CHAT', { id: payload.id, promise: findChat });
                    } else {
                        console.log('findChat cache::', findChat);
                        findChat = findChat.promise;
                    }
                    findChat.then(value => resolve(value)).catch(reason => reject(reason));
                } else {
                    resolve(chat);
                }
            });
        },

        findChatFromNumber (context, payload) {
            return new Promise((resolve, reject) => {
                const chat = context.state.chats.find(chat => chat.contact && chat.contact.id && chat.contact.id.user === payload.number);
                let findChat = context.state.findChatsByNumber[payload.number];
                if (!chat) {
                    if (!findChat) {
                        findChat = new Promise((resolve1, reject1) => {
                            context.dispatch('sendWsMessage', { event: 'findChatByNumber', payload: payload.number }).then(chat => {
                                context.dispatch('newChat', chat).then((chat) => {
                                    resolve1(chat);
                                });
                            }).catch(reason => reject1(reason));
                        });
                        context.commit('ADD_FIND_CHAT_BY_NUMBER', { number: payload.number, promise: findChat });
                    } else {
                        findChat = findChat.promise;
                    }
                    findChat.then(value => resolve(value)).catch(reason => reject(reason));
                } else {
                    resolve(chat);
                }
            });
        },

        findContactFromId (context, payload) {
            return new Promise((resolve, reject) => {
                const contact = context.state.contacts.find(contact => contact.id === payload.id);
                let findContact = context.state.findContacts[payload.id];
                if (!contact) {
                    if (!findContact) {
                        findContact = new Promise((resolve1, reject1) => {
                            context.dispatch('sendWsMessage', { event: 'findContact', payload: payload.id }).then(chat => {
                                context.dispatch('newContact', chat).then((contact) => {
                                    resolve1(contact);
                                });
                            }).catch(reason => reject1(reason));
                        });
                        context.commit('ADD_FIND_CONTACT', { id: payload.id, promise: findContact });
                    } else {
                        findContact = findContact.promise;
                    }
                    findContact.then(value => resolve(value)).catch(reason => reject(reason));
                } else {
                    resolve(contact);
                }
            });
        },

        getSelfInfo (context) {
            return context.dispatch('sendWsMessage', { event: 'getSelfInfo' });
        },

        getGroupParticipants (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'getGroupParticipants', payload: payload.chatId });
        },

        getAllChats (context) {
            return context.dispatch('sendWsMessage', { event: 'getAllChats' });
        },

        getAllContacts (context) {
            return context.dispatch('sendWsMessage', { event: 'getAllContacts' });
        },

        getAllQuickReplies (context) {
            return context.dispatch('sendWsMessage', { event: 'getAllQuickReplies' });
        },

        logout (context) {
            return context.dispatch('sendWsMessage', {
                event: 'logout'
            }).then(() => {
                localStorage.clear();
                sessionStorage.clear();
                window.location.refresh();
            });
        },

        closeWs (context) {
            if (context.state.wsWorker) {
                context.state.wsWorker.postMessage({ cmd: 'close' });
            }
        },

        fetchUser (context) {
            return api.get('/api/users/self').then(user => {
                context.commit('SET_CURRENT_USER', user.data);
            });
        },

        getCurrentOperator (context, payload) {
            return api.get(`/api/properties/chat/${payload.chatId}/currentOperator`).then(value => {
                return value.data;
            }).catch(reason => {
                if (reason.response.status !== 404) {
                    throw reason;
                } else {
                    return null;
                }
            });
        },

        async setCurrentOperator (context, payload) {
            if (payload.chat.customProperties.currentOperator) {
                let property = await context.dispatch('getCurrentOperator', { chatId: payload.chat.id });
                property.value = context.state.user.uuid;
                return context.dispatch('updateChatProperty', property);
            }
            const property = {
                whatsAppId: payload.chat.id,
                key: 'currentOperator',
                value: context.state.user.uuid
            };
            return context.dispatch('addChatProperty', property);
        },

        async addAnnotation (context, payload) {
            let property = await context.dispatch('getChatProperty', { chatId: payload.chat.id, name: payload.name });
            if (property) {
                property.value = payload.value;
                return context.dispatch('updateChatProperty', property);
            }
            property = {
                whatsAppId: payload.chat.id,
                key: payload.name,
                value: payload.value
            };
            return context.dispatch('addChatProperty', property);
        },

        updateChatProperty (context, payload) {
            return api.put('/api/properties/chat', payload);
        },

        addChatProperty (context, payload) {
            return api.post('/api/properties/chat', payload);
        },

        deleteChatProperty (context, payload) {
            return api.delete(`/api/properties/chat/${payload.chatId}/${payload.name}`);
        },

        getChatProperty (context, payload) {
            return api.get(`/api/properties/chat/${payload.chatId}/${payload.name}`).then(value => {
                return value.data;
            }).catch(reason => {
                if (reason.response.status !== 404) {
                    throw reason;
                } else {
                    return null;
                }
            });
        },

        getChatProperties (context, payload) {
            return api.get(`/api/properties/chat/${payload.chatId}`).then(value => {
                return value.data;
            }).catch(reason => {
                if (reason.response.status !== 404) {
                    throw reason;
                } else {
                    return null;
                }
            });
        },

        getChatsWithProperty (context, payload) {
            return api.get(`/api/properties/chat/filter/${payload.key}/${payload.value}`).then(value => {
                return value.data;
            });
        },

        async updateMyChats (context) {
            let chatIds = await context.dispatch('getChatsWithProperty', { key: 'currentOperator', value: context.state.user.uuid });
            let myChats = context.state.chats.filter(chat => {
                return chatIds.includes(chat.id);
            });
            await context.commit('SET_MY_CHATS', myChats);
        },

        initPong (context) {
            context.commit('INTERVAL_PONG', setInterval(() => {
                context.dispatch('checkDelayToServer');
            }, 10000));
        },

        appActive (context) {
            if (context.state.idle && context.state.visible) {
                context.dispatch('sendPresenceStatus', { type: 'Available' });
            }
            context.commit('SET_IDLE', false);
            context.commit('TIMEOUT_IDLE', setTimeout(() => {
                context.commit('SET_IDLE', true);
                setTimeout(() => {
                    context.dispatch('sendPresenceStatus', { type: 'Unavailable' });
                }, 20000);
            }, 10000));
        },

        initPresenceTimeout (context) {
            context.commit('SET_VISIBLE', !visibility.hidden());
            if (!context.state.visible) {
                context.dispatch('sendPresenceStatus', { type: 'Unavailable' });
            } else {
                context.dispatch('sendPresenceStatus', { type: 'Available' });
            }
            visibility.change((evt, hidden) => {
                context.commit('SET_VISIBLE', !hidden);
                if (hidden) {
                    context.commit('TIMEOUT_PRESENCE', setTimeout(() => {
                        context.dispatch('sendPresenceStatus', { type: 'Unavailable' });
                    }, 10000));
                } else {
                    context.dispatch('sendPresenceStatus', { type: 'Available' });
                }
            });
        },

        checkDelayToServer (context) {
            return new Promise((resolve, reject) => {
                let time = new Date().getTime();
                context.dispatch('sendWsMessage', { event: 'pong' }).then(() => {
                    resolve(new Date().getTime() - time);
                }).catch(reason => reject(reason));
            });
        },

        findPictureFromId (context, payload) {
            return new Promise((resolve, reject) => {
                let type = payload.full === true ? 'full' : 'min';
                if (context.state.pictures[type] && context.state.pictures[type][payload.id] && new Date().getTime() - context.state.pictures[type][payload.id].t <= 10800000) {
                    resolve(context.state.pictures[type][payload.id].picture);
                } else {
                    context.dispatch('sendWsMessage', {
                        event: 'findPicture',
                        payload: { id: payload.id, full: payload.full === true }
                    }).then(data => {
                        if (data !== '') {
                            api.get(`/api/downloadFile/${data}`, { responseType: 'blob' }).then(value => {
                                context.dispatch('convertToBase64', { file: value.data }).then(base64 => {
                                    context.commit('ADD_PICTURE_TO_CACHE', {
                                        id: payload.id,
                                        picture: base64,
                                        t: new Date().getTime(),
                                        type: type
                                    });
                                    resolve(base64);
                                });
                            });
                        } else {
                            resolve('');
                        }
                    }).catch(reason => reject(reason));
                }
            });
        },

        downloadMedia (context, payload) {
            return new Promise((resolve, reject) => {
                if (payload.base64 !== false) {
                    if (context.state.medias[payload.id]) {
                        resolve(context.state.medias[payload.id]);
                    } else {
                        context.dispatch('sendWsMessage', {
                            event: 'downloadMedia',
                            payload: payload.id
                        }).then(data => {
                            api.get(`/api/downloadFile/${data}`, { responseType: 'blob' }).then(async value => {
                                let result = {
                                    fileName: value.headers.filename,
                                    base64: await context.dispatch('convertToBase64', { file: value.data })
                                };
                                context.commit('ADD_MEDIA_TO_CACHE', { id: payload.id, data: result });
                                resolve(result);
                            });
                        }).catch(reason => reject(reason));
                    }
                } else {
                    context.dispatch('sendWsMessage', { event: 'downloadMedia', payload: payload.id }).then(data => {
                        resolve(`${localStorage.baseURL}/api/downloadFile/${data}?token=${context.state.token}`);
                    }).catch(reason => reject(reason));
                }
            });
        },

        convertToBase64 (context, payload) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.readAsDataURL(payload.file);
                reader.onload = () => resolve(reader.result);
                reader.onerror = error => reject(error);
            });
        },

        uploadFile (context, payload) {
            return new Promise((resolve, reject) => {
                let size = payload.size / 1024 / 1024;
                if (size >= 70) {
                    reject(new Error('Tamanho máximo do envio não pode ser maior que 70Mb'));
                } else {
                    let formData = new FormData();
                    formData.append('file', payload);
                    return api.post('/api/uploadFile',
                        formData,
                        {
                            headers: {
                                'Content-Type': 'multipart/form-data'
                            }
                        }
                    ).then(result => {
                        resolve(result.data);
                    }).catch(reason => {
                        reject(reason);
                    });
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

        getGroupInviteInfo (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'getGroupInviteInfo', payload: payload.link });
        },

        /*
              CHATS
          */

        async newChat (context, payload) {
            let chat = context.state.chats.find((element) => {
                return element.id === payload.id;
            });
            if (!chat) {
                chat = payload;
                await context.dispatch('setChatProperties', payload);
                await context.commit('ADD_NEW_CHAT', payload);
                await context.dispatch('sortChatsByTime');
            }

            return chat;
        },

        async newContact (context, payload) {
            let contact = context.state.contacts.find((element) => {
                return element.id === payload.id;
            });

            if (!contact) {
                contact = payload;
                await context.commit('ADD_NEW_CONTACT', payload);
            }

            return contact;
        },

        async setChatProperties (context, payload) {
            payload = reactive(payload);
            if (!Array.isArray(payload)) {
                await setProperties(payload);
            } else {
                for await (let chat of payload) {
                    await setProperties(chat);
                }
            }

            async function setProperties (el) {
                await context.dispatch('setMsgsProperties', el.msgs);
                el.quotedMsg = undefined;
                el.openChatInfo = false;
                el.sendQueue = [];
                el.htmlInput = '';
                el.restoreInput = null;
                el.customProperties = {};
                el.loadingEarly = false;
                el.__x_msgsIndex = 1;
                el.__x_poolAddMsgs = [];
                el.__x_intervalPool = 0;
                el.__x_intervalPoolCreate = () => setInterval(async () => {
                    let msgs = [];
                    while (el.__x_poolAddMsgs.length) {
                        msgs.push(el.__x_poolAddMsgs.pop());
                    }
                    if (msgs && msgs.length > 0) {
                        await context.dispatch('setMsgsProperties', msgs);
                        el.msgs.push(...msgs);
                        el.msgs.sort(function (a, b) {
                            if (a.t > b.t) {
                                return 1;
                            }
                            if (a.t < b.t) {
                                return -1;
                            }
                            return 0;
                        });
                        await context.dispatch('sortChatsByTime');
                        let newMsgIn = msgs.find(value => !value.id.fromMe && value.isNewMsg);
                        if (newMsgIn && el.muteExpiration === 0 && (el !== context.state.activeChat || !context.state.visible)) {
                            await context.dispatch('playNewMsgNotification');
                        }
                    }
                }, 150);
                el.contact = async function () {
                    if (this.__x_contact) {
                        return this.__x_contact;
                    }
                    this.__x_contact = await context.dispatch('findContactFromId', { id: el.id });
                    return this.__x_contact;
                };
                el.addMsg = function (msg) {
                    if (el.__x_intervalPool === 0) {
                        el.__x_intervalPoolCreate();
                    }
                    el.__x_poolAddMsgs.push(msg);
                };
                el.clearInputMessage = function () {
                    el.message = '';
                    el.restoreInput = null;
                    el.quotedMsg = undefined;
                    el.htmlInput = '';
                    el.emojiVisible = false;
                };
                el.buildAndSendMessage = function (payload) {
                    if (!payload) {
                        payload = {};
                    }
                    if (this.message && !payload.text) {
                        payload.text = this.message;
                    }
                    if (this.quotedMsg) {
                        payload.quotedMsg = el.quotedMsg.id._serialized;
                    }
                    this.clearInputMessage();
                    return this.sendMessage(payload);
                };
                el.sendMessage = function (payload) {
                    Object.assign(payload, {
                        chatId: this.id
                    });
                    return context.dispatch('sendMsg', payload);
                };
                el.forwardMessages = function (payload) {
                    let payloadSend = { idsChats: [], idsMsgs: [] };
                    payload.chats.forEach(value => {
                        payloadSend.idsChats.push(value.id);
                    });
                    payload.msgs.forEach(value => {
                        payloadSend.idsMsgs.push(value.id._serialized);
                    });
                    return context.dispatch('forwardMsgs', payloadSend);
                };
                el.seeChat = function () {
                    return context.dispatch('seeChat', { chatId: this.id });
                };
                el.pinChat = function () {
                    return context.dispatch('pinChat', { chatId: this.id });
                };
                el.unPinChat = function () {
                    return context.dispatch('unPinChat', { chatId: this.id });
                };
                el.markRead = function () {
                    return context.dispatch('markRead', { chatId: this.id });
                };
                el.markUnRead = function () {
                    return context.dispatch('markUnRead', { chatId: this.id });
                };
                el.deleteChat = function () {
                    return context.dispatch('deleteChat', { chatId: this.id });
                };
                el.markRecording = function () {
                    return context.dispatch('markRecording', { chatId: this.id });
                };
                el.markComposing = function () {
                    return context.dispatch('markComposing', { chatId: this.id });
                };
                el.markPaused = function () {
                    return context.dispatch('markPaused', { chatId: this.id });
                };
                el.clearChat = function (keepFavorites) {
                    return context.dispatch('clearChat', { chatId: this.id, keepFavorites: keepFavorites === true });
                };
                el.subscribePresence = function () {
                    if (!this.presenceSubscribed) {
                        return context.dispatch('subscribePresence', { chatId: this.id }).then(() => {
                            this.presenceSubscribed = true;
                        });
                    }
                };
                el.loadEarly = function () {
                    if (this.__x_msgsIndex * 50 < this.msgs.length) {
                        this.__x_msgsIndex++;
                        return Promise.resolve(this.msgsParted);
                    }
                    if (!this.throttle) {
                        this.throttle = throttledQueue(1, 3000);
                    }
                    return new Promise((resolve, reject) => {
                        this.throttle(async () => {
                            try {
                                await context.dispatch('loadEarly', { chatId: this.id });
                                setTimeout(resolve, 3000);
                            } catch (e) {
                                reject(e);
                            }
                        });
                    });
                };
                Object.defineProperty(el, 'lastMsg', {
                    get () {
                        let array = this.msgs.filter(e => e.type && e.type !== 'e2e_notification' && e.type !== 'gp2' && e.type !== 'notification_template').sort((a, b) => {
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
                    }
                });
                Object.defineProperty(el, 'msgsParted', {
                    get () {
                        let msgs = [];
                        for (let x = 0; x < this.__x_msgsIndex * 50 && x < this.msgs.length; x++) {
                            msgs.push(this.msgs[this.msgs.length - 1 - x]);
                        }
                        return msgs.reverse();
                    }
                });
                Object.defineProperty(el, 'isChat', {
                    get () {
                        return this.kind === 'chat';
                    }
                });
                Object.defineProperty(el, 'isGroup', {
                    get () {
                        return this.kind === 'group';
                    }
                });
                Object.defineProperty(el, 'isOffline', {
                    get () {
                        return this.presenceType === 'unavailable' || this.presenceType === '';
                    }
                });
                Object.defineProperty(el, 'isOnline', {
                    get () {
                        return this.presenceType === 'available';
                    }
                });
                Object.defineProperty(el, 'isComposing', {
                    get () {
                        return this.presenceType === 'composing';
                    }
                });
                Object.defineProperty(el, 'isRecording', {
                    get () {
                        return this.presenceType === 'recording';
                    }
                });
                Object.defineProperty(el, 'hasLastTimeAvailable', {
                    get () {
                        return this.lastPresenceAvailableTime && this.lastPresenceAvailableTime > 0;
                    }
                });
                Object.defineProperty(el, 'isUnread', {
                    get () {
                        return this.unreadCount > 0;
                    }
                });
                if (el.isGroup) {
                    el.colors = {};
                    el.getColor = function (id) {
                        if (this.colors[id]) {
                            return this.colors[id];
                        }
                        this.colors[id] = randomColor().hexString();
                        return this.colors[id];
                    };
                    el.getParticipants = function () {
                        return context.dispatch('getGroupParticipants', { chatId: this.id });
                    };
                }
            }
        },

        async setMsgsProperties (context, payload) {
            payload = reactive(payload);
            if (!Array.isArray(payload)) {
                await setProperties(payload);
            } else {
                for await (let msg of payload) {
                    await setProperties(msg);
                }
            }

            async function setProperties (msg) {
                Object.defineProperty(msg, 'isChat', {
                    get () {
                        return this.type === 'chat';
                    }
                });
                Object.defineProperty(msg, 'isImage', {
                    get () {
                        return this.type === 'image';
                    }
                });
                Object.defineProperty(msg, 'isSticker', {
                    get () {
                        return this.type === 'sticker';
                    }
                });
                Object.defineProperty(msg, 'isVideo', {
                    get () {
                        return this.type === 'video';
                    }
                });
                Object.defineProperty(msg, 'isGif', {
                    get () {
                        return this.type === 'video' && this.gifAttribution >= 1;
                    }
                });
                Object.defineProperty(msg, 'isDocument', {
                    get () {
                        return this.type === 'document';
                    }
                });
                Object.defineProperty(msg, 'isAudio', {
                    get () {
                        return this.type === 'audio';
                    }
                });
                Object.defineProperty(msg, 'isPtt', {
                    get () {
                        return this.type === 'ptt';
                    }
                });
                Object.defineProperty(msg, 'isRevoked', {
                    get () {
                        return this.type === 'revoked';
                    }
                });
                Object.defineProperty(msg, 'isLocation', {
                    get () {
                        return this.type === 'location';
                    }
                });
                Object.defineProperty(msg, 'isVcard', {
                    get () {
                        return this.type === 'vcard';
                    }
                });
                Object.defineProperty(msg, 'hasQuotedMsg', {
                    get () {
                        return !!this.quotedMsg;
                    }
                });
                Object.defineProperty(msg, 'isSameColor', {
                    get () {
                        return this.hasCaption || (this.isChat && !this.hasQuotedMsg);
                    }
                });
                Object.defineProperty(msg, 'hasCaption', {
                    get () {
                        return !!this.caption;
                    }
                });
                Object.defineProperty(msg, 'fomattedDate', {
                    get () {
                        let date = new Date(this.t * 1000);
                        let year = date.getFullYear();
                        let month = date.getMonth() + 1;
                        let day = date.getDate();
                        let dayOfWeek = date.getDay();
                        let today = new Date();
                        let todayDay = today.getDate();
                        let todayMonth = today.getMonth() + 1;
                        let dayOfWeekStr = '';
                        switch (dayOfWeek) {
                            case 0:
                                dayOfWeekStr = 'Domingo';
                                break;
                            case 1:
                                dayOfWeekStr = 'Segunda-Feira';
                                break;
                            case 2:
                                dayOfWeekStr = 'Terça-Feira';
                                break;
                            case 3:
                                dayOfWeekStr = 'Quarta-Feira';
                                break;
                            case 4:
                                dayOfWeekStr = 'Quinta-Feira';
                                break;
                            case 5:
                                dayOfWeekStr = 'Sexta-Feira';
                                break;
                            case 6:
                                dayOfWeekStr = 'Sábado';
                                break;
                        }

                        let text = `${day < 10 ? '0' : ''}${day}/${month < 10 ? '0' : ''}${month}/${year}`;
                        if (todayDay === day && todayMonth === month) {
                            text = 'hoje';
                        } else if (todayDay - day === 1 && todayMonth === month) {
                            text = 'ontem';
                        } else if (today.getTime() - date.getTime() <= 432000000) {
                            return dayOfWeekStr;
                        }
                        return text;
                    }
                });
                msg.senderObj = async function () {
                    if (this.__x_senderObj) {
                        return this.__x_senderObj;
                    }
                    this.__x_senderObj = await context.dispatch('findContactFromId', { id: this.author ? this.author : this.from });
                    return this.__x_senderObj;
                };
                if (msg.hasQuotedMsg) {
                    await setProperties(msg.quotedMsgObject);
                }
                if (msg.isVcard) {
                    msg.vCard = vCardParse.parse(msg.body);
                }
                msg.delete = function () {
                    let payload = {
                        msgId: this.id._serialized,
                        fromAll: false
                    };
                    return context.dispatch('deleteMsg', payload);
                };
                msg.revoke = function () {
                    let payload = {
                        msgId: this.id._serialized,
                        fromAll: true
                    };
                    return context.dispatch('deleteMsg', payload);
                };
                if (msg.isAudio || msg.isPtt) {
                    msg.markPlayed = function () {
                        let payload = {
                            msgId: this.id._serialized
                        };
                        return context.dispatch('markPlayed', payload);
                    };
                }
                msg.blink = false;
            }
        },

        async handleSetChats (context, payload) {
            await context.dispatch('setChatProperties', payload);
            await context.commit('SET_CHATS', payload);
            await context.dispatch('updateTitle');
        },

        async updateChat (context, payload) {
            const chat = context.state.chats.find((element) => {
                return element.id === payload.id;
            });

            if (chat) {
                delete payload.msgs;
                let sortChats = chat.pin !== payload.pin;
                if (!payload.pin) {
                    payload.pin = 0;
                }
                Object.assign(chat, payload);
                await context.dispatch('updateTitle');
                if (sortChats) {
                    await context.dispatch('sortChatsByTime');
                }
            }
        },

        sortChatsByTime (context) {
            context.commit('SET_TIMEOUT_CHATS', setTimeout(async () => {
                const chats = context.state.chats;

                chats.sort(function (a, b) {
                    let n = a.pin || 0;
                    let r = b.pin || 0;
                    if (n || r) {
                        return n !== r ? n > r ? -1 : 1 : a.id._serialized < b.id._serialized ? -1 : 1;
                    }

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
                await context.dispatch('updateTitle');
            }, 50));
        },

        playNewMsgNotification (context) {
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

        forwardMsgs (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'forwardMessage', payload: payload });
        },

        seeChat (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'seeChat', payload: payload.chatId });
        },

        pinChat (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'pinChat', payload: payload.chatId });
        },

        unPinChat (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'unPinChat', payload: payload.chatId });
        },

        markRead (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'markRead', payload: payload.chatId });
        },

        markUnRead (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'markUnRead', payload: payload.chatId });
        },

        deleteChat (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'deleteChat', payload: payload.chatId });
        },

        markRecording (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'markRecording', payload: payload.chatId });
        },

        markComposing (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'markComposing', payload: payload.chatId });
        },

        markPaused (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'markPaused', payload: payload.chatId });
        },

        clearChat (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'clearChat', payload: payload });
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

        findChatFromMsg (context, payload) {
            let idSearch = payload.id.fromMe ? payload.to : payload.from;

            return context.state.chats.find((element) => {
                return element.id === idSearch;
            });
        },

        async addNewMsgInChat (context, payload) {
            let chat = await context.dispatch('findChatFromMsg', payload);

            if (chat) {
                const msg = chat.msgs.find((element) => {
                    return element.id.id === payload.id.id;
                });

                if (!msg) {
                    chat.addMsg(payload);
                }
            }
        },

        async removeMsgFromChat (context, payload) {
            let chat = await context.dispatch('findChatFromMsg', payload);

            if (chat) {
                chat.msgs = chat.msgs.filter(e => e.id.id !== payload.id.id);
                await context.dispatch('sortChatsByTime');
            }
        },

        async findOriginalMsg (context, payload) {
            let chat = await context.dispatch('findChatFromMsg', payload);

            if (chat) {
                return chat.msgs.find((element) => {
                    return element.id.id === payload.id.id || element.id.id === payload.oldId.id;
                });
            }
        },

        async updateMsg (context, payload) {
            let msg = await context.dispatch('findOriginalMsg', payload);

            if (msg) {
                msg.ack = payload.ack;
                msg.type = payload.type;
                msg.id = payload.id;
                msg.canBeRevoke = payload.canBeRevoke;
            }
        },

        async blinkMsg (context, payload) {
            let msg = await context.dispatch('findOriginalMsg', payload);
            if (msg) {
                msg.blink = true;
                setTimeout(() => {
                    msg.blink = false;
                }, 1500);
            }
        },

        async changeCustomPropertyChat (context, payload) {
            let chatId = payload.whatsAppId;
            let chat = await context.dispatch('findChatFromId', { id: chatId });
            if (chat) {
                chat.customProperties = Object.assign({}, chat.customProperties, {
                    [payload.key]: payload.value
                });
                if (payload.key === 'currentOperator') {
                    await context.dispatch('updateMyChats');
                }
            }
        },

        async removeCustomPropertyChat (context, payload) {
            let chatId = payload.whatsAppId;
            let chat = await context.dispatch('findChatFromId', { id: chatId });
            if (chat) {
                delete chat.customProperties[payload.key];
            }
        }

    },
    modules: {}
});

export default store;
