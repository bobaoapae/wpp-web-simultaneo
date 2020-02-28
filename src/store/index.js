import Vue from 'vue';
import Vuex from 'vuex';
import uniqueid from 'uniqid';
import visibility from 'vue-visibility-change';
import VuexReset from '@ianwalter/vuex-reset';
import VuexPersistence from 'vuex-persist';
import vCardParse from 'vcard-parser';
import api from '@/api';
import randomColor from 'random-color';
import WebSocketWorker from 'worker-loader!@/webSocketWorker';

const vuexLocal = new VuexPersistence({
    storage: window.sessionStorage,
    reducer: state => ({
        user: state.user
    }),
    supportCircular: true
});

Vue.use(Vuex);

const store = new Vuex.Store({
    plugins: [VuexReset(), vuexLocal.plugin],
    state: {
        user: {},
        token: '',
        isLogged: false,
        isQrCodeLogged: false,
        isLoadingChat: true,
        imgQrCode: '',
        QrCodeStatus: '',
        self: {},
        contacts: [],
        chats: [],
        quickReplys: [],
        pictures: {},
        medias: {},
        timeOutChats: -1,
        activeChat: null,
        poolContext: [],
        modal: {
            type: '',
            media: '',
            show: false,
            id: ''
        },
        wsEvents: {},
        promisesWsEvents: {},
        intervalPong: -1,
        timeoutPresence: -1,
        timeoutIdle: -1,
        audio: null,
        visible: true,
        idle: false,
        wsWorker: null
    },
    mutations: {
        reset: (state) => {
        },

        SET_CURRENT_USER (state, payload) {
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

        SET_IMG_QRCODE (state, payload) {
            state.imgQrCode = payload;
        },

        SET_ACTIVE_CHAT (state, payload) {
            console.log('activeChat: ', payload);
            state.activeChat = payload;
        },

        SET_SELF (state, payload) {
            Object.assign(state.self, payload);
        },

        SET_CONTACTS (state, payload) {
            Vue.set(state, 'contacts', [...payload]);
        },

        SET_QUICK_REPLYS (state, payload) {
            Vue.set(state, 'quickReplys', [...payload]);
        },

        SET_CHATS (state, payload) {
            Vue.set(state, 'chats', [...payload]);
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
                                response += frames[x].response;
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
        }
    },

    actions: {
        setNewEvent (context) {
            context.commit('SET_TOKEN', sessionStorage.TOKEN);
            context.commit('SET_WS_WORKER', new WebSocketWorker());
            const wsWorker = context.state.wsWorker;

            wsWorker.postMessage({ cmd: 'ws-init', data: `${localStorage.baseURL.replace('http', 'ws')}/api/ws` });

            wsWorker.addEventListener('message', (event) => {
                let cmd = event.data.cmd;
                let data = event.data.data;
                switch (cmd) {
                    case 'ws-open': {
                        context.dispatch('sendWsMessage', {
                            event: 'token',
                            payload: sessionStorage.TOKEN
                        }).catch(reason => {
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
                        let payload = data.data;
                        let eventOrTag = data.cmd;
                        switch (eventOrTag) {
                            case 'need-qrcode': {
                                context.commit('SET_IMG_QRCODE', payload);

                                break;
                            }

                            case 'update-estado': {
                                if (payload === 'QR_CODE_SCANNED') {
                                    context.commit('SET_QR_CODE_LOGGED', true);
                                } else if (payload === 'LOADING_STORE') {
                                    context.commit('SET_QR_CODE_LOGGED', true);
                                } else if (payload === 'LOGGED') {
                                    context.commit('SET_QR_CODE_LOGGED', true);
                                } else if (payload === 'WAITING_QR_CODE_SCAN') {
                                    context.commit('SET_QR_CODE_LOGGED', false);
                                    context.commit('SET_IS_LOADING_CHAT', true);
                                }

                                break;
                            }

                            case 'init': {
                                const r = JSON.parse(payload);
                                context.commit('SET_SELF', r.self);

                                let init = performance.now();
                                context.dispatch('getAllChats').then(chats => {
                                    console.log('chats::', chats);
                                    console.log('time get all chats::', performance.now() - init);
                                    context.dispatch('handleSetChats', chats);
                                    context.dispatch('sortChatsByTime');
                                    context.state.poolContext.forEach(func => func());
                                    context.state.poolContext = [];
                                    context.dispatch('initPong');
                                    context.dispatch('initPresenceTimeout');
                                    context.dispatch('appActive');
                                    context.commit('SET_IS_LOADING_CHAT', false);
                                });

                                context.dispatch('getAllContacts').then(contacts => {
                                    context.commit('SET_CONTACTS', contacts);
                                });

                                if (r.isBussiness) {
                                    context.dispatch('getAllQuickReplys').then(quickReplys => {
                                        context.commit('SET_QUICK_REPLYS', quickReplys);
                                    });
                                }

                                break;
                            }

                            case 'new-chat': {
                                const r = JSON.parse(payload);

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
                                const r = JSON.parse(payload);

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
                                const r = JSON.parse(payload);

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
                                const r = JSON.parse(payload);

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
                                const r = JSON.parse(payload);

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
                                const r = JSON.parse(payload);

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
                    tag: uniqueid(),
                    webSocketRequestPayLoad: payload
                };
                if (typeof (payLoadSend.webSocketRequestPayLoad.payload) === 'object') {
                    payLoadSend.webSocketRequestPayLoad.payload = JSON.stringify(payLoadSend.webSocketRequestPayLoad.payload);
                }
                context.commit('ADD_NEW_LISTENNER', { tag: payLoadSend.tag, resolve: resolve, reject: reject });
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
                context.dispatch('findChatFromId', payload).then(el => {
                    if (el && el.contact && el.contact.formattedName) {
                        resolve(el.contact.formattedName);
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

        getAllChats (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'getAllChats' });
        },

        getAllContacts (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'getAllContacts' });
        },

        getAllQuickReplys (context, payload) {
            return context.dispatch('sendWsMessage', { event: 'getAllQuickReplys' });
        },

        closeWs (context) {
            if (context.state.wsWorker) {
                context.state.wsWorker.postMessage({ cmd: 'close' });
            }
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
                context.dispatch('sendWsMessage', { event: 'pong' }).then(result => {
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

        sendPresenceStatus (context, payload) {
            return new Promise((resolve, reject) => {
                context.dispatch('sendWsMessage', { event: `sendPresence${payload.type}` }).then(data => {
                    resolve(data);
                }).catch(reason => reject(reason));
            });
        },

        findCustomProperties (context, payload) {
            return new Promise((resolve, reject) => {
                context.dispatch('sendWsMessage', {
                    event: 'findCustomProperty',
                    payload: { id: payload.id, type: payload.type }
                }).then(data => {
                    resolve(data);
                }).catch(reason => reject(reason));
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
                context.dispatch('setMsgsProperties', el.msgs);
                el.quotedMsg = undefined;
                el.openChatInfo = false;
                el.sendQueue = [];
                el.htmlInput = '';
                el.restoreInput = null;
                if (!el.customProperties) {
                    el.customProperties = {};
                }
                el.__x_msgsIndex = 1;
                el.__x_poolAddMsgs = [];
                el.__x_intervalPool = setInterval(() => {
                    let msgs = el.__x_poolAddMsgs;
                    el.__x_poolAddMsgs = [];
                    if (msgs && msgs.length > 0) {
                        context.dispatch('setMsgsProperties', msgs);
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
                        context.dispatch('sortChatsByTime');
                        let newMsgIn = msgs.find(value => !value.id.fromMe && value.isNewMsg);
                        if (newMsgIn && el.muteExpiration <= 0 && (el !== context.state.activeChat || !context.state.visible)) {
                            context.dispatch('playNewMsgNotification');
                        }
                    }
                }, 150);
                el.addMsg = function (msg) {
                    el.__x_poolAddMsgs.push(msg);
                };
                el.sendMessage = function (payload) {
                    Object.assign(payload, {
                        chatId: this.id
                    });
                    return context.dispatch('sendMsg', payload);
                };
                el.seeChat = function () {
                    return context.dispatch('seeChat', { chatId: this.id });
                };
                el.subscribePresence = function () {
                    return context.dispatch('subscribePresence', { chatId: this.id });
                };
                el.loadEarly = function () {
                    if (this.__x_msgsIndex * 50 < this.msgs.length) {
                        this.__x_msgsIndex++;
                        return Promise.resolve(this.msgsParted);
                    }
                    return context.dispatch('loadEarly', { chatId: this.id });
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
                }
            }
        },

        setMsgsProperties (context, payload) {
            if (!Array.isArray(payload)) {
                setProperties(payload);
            } else {
                payload.forEach(msg => {
                    setProperties(msg);
                });
            }

            function setProperties (msg) {
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
                if (msg.hasQuotedMsg) {
                    setProperties(msg.quotedMsgObject);
                }
                if (msg.isVcard) {
                    msg.vCard = vCardParse.parse(msg.body);
                }
                if (!msg.customProperties) {
                    msg.customProperties = {};
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

        handleSetChats (context, payload) {
            context.dispatch('setChatProperties', payload);
            context.commit('SET_CHATS', payload);
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
                context.dispatch('updateTitle');
            }, 50));
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
            let idSearch = payload.id.fromMe ? payload.to : payload.from;

            const chat = context.state.chats.find((element) => {
                return element.id === idSearch;
            });

            if (chat) {
                const msg = chat.msgs.find((element) => {
                    return element.id.id === payload.id.id;
                });

                if (!msg) {
                    chat.addMsg(payload);
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
                    if (payload.blink !== undefined) {
                        msg.blink = payload.blink;
                    }
                    if (payload.customProperties) {
                        Object.assign(msg.customProperties, payload.customProperties);
                    }
                }
            }
        }

    },
    modules: {}
});

export default store;
