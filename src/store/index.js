import Vue from 'vue';
import Vuex from 'vuex';
import uniqueid from 'uniqid';
import visibility from 'vue-visibility-change';
import VuexReset from '@ianwalter/vuex-reset';
import VuexPersistence from 'vuex-persist';
import vCardParse from 'vcard-parser';
import api from '@/api';
import randomColor from 'random-color';

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
        isLogged: false,
        isQrCodeLogged: false,
        isLoadingChat: true,
        imgQrCode: '',
        QrCodeStatus: '',
        self: null,
        contacts: null,
        chats: null,
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
        ws: null,
        wsEvents: {},
        promisesWsEvents: {},
        intervalPong: -1,
        intervalPresence: -1,
        audio: null
    },

    mutations: {
        reset: (state) => {},

        SET_CURRENT_USER (state, payload) {
            state.user = payload;
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
            state.contacts = payload;
        },

        SET_QUICK_REPLYS (state, payload) {
            state.quickReplys = payload;
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
            if (state.ws) {
                state.ws.close();
            }
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
            if (!state.pictures[payload.type]) {
                state.pictures[payload.type] = [];
            }
            state.pictures[payload.full === true ? 'full' : 'min'][payload.id] = { picture: payload.picture, t: payload.t };
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
        },

        ADD_PROMISE_WS_EVENT (state, payload) {
            if (!state.promisesWsEvents[payload.event]) {
                state.promisesWsEvents[payload.event] = [];
            }
            state.promisesWsEvents[payload.event].push(payload.promise);
        }
    },

    actions: {
        setNewEvent (context) {
            context.commit('SET_WS', new WebSocket(`${localStorage.baseURL.replace('http', 'ws')}/api/ws`));

            const ws = context.state.ws;

            ws.onopen = function (e) {
                context.dispatch('sendWsMessage', { event: 'token', payload: sessionStorage.TOKEN }).catch(reason => {
                    sessionStorage.removeItem('TOKEN');
                    sessionStorage.removeItem('USER');
                    window.location.reload();
                });
            };
            ws.onclose = function (e) {
                console.log('Ws Close', e);
                if (e.code !== 4000) {
                    window.location.reload();
                }
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

                        context.dispatch('handleSetChats', r.chats);
                        context.dispatch('sortChatsByTime');
                        context.commit('SET_SELF', r.self);
                        context.commit('SET_CONTACTS', r.contacts);
                        if (r.quickReplys) {
                            context.commit('SET_QUICK_REPLYS', r.quickReplys);
                        }
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
            let promise = new Promise(async (resolve, reject) => {
                let payLoadSend = {
                    tag: uniqueid(),
                    webSocketRequestPayLoad: payload
                };
                if (typeof (payLoadSend.webSocketRequestPayLoad.payload) === 'object') {
                    payLoadSend.webSocketRequestPayLoad.payload = JSON.stringify(payLoadSend.webSocketRequestPayLoad.payload);
                }
                context.commit('ADD_NEW_LISTENNER', { tag: payLoadSend.tag, resolve: resolve, reject: reject });
                setTimeout(() => reject(new Error('Time-Out')), 60000);
                await context.dispatch('waitResultPreviousWSEvent', payload.event);
                context.commit('ADD_PROMISE_WS_EVENT', { event: payload.event, promise: promise });
                if (context.state.ws.readyState === WebSocket.OPEN) {
                    context.state.ws.send(JSON.stringify(payLoadSend));
                } else {
                    reject(new Error('WebSocket Not Open'));
                }
            });
            return promise;
        },

        waitResultPreviousWSEvent (context, payload) {
            return new Promise(async (resolve, reject) => {
                let promises = context.state.promisesWsEvents[payload];
                if (promises) {
                    let promisesWait = [];
                    for (let x = 0; x < 10 && x < promises.length; x++) {
                        promisesWait.push(promises.shift());
                    }
                    Promise.all(promisesWait).finally(() => {
                        resolve();
                    });
                } else {
                    resolve();
                }
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
            console.log('findFormattedNameFromId');
            return new Promise((resolve, reject) => {
                context.dispatch('findChatFromId', payload).then(el => {
                    if (el && el.contact && el.contact.formattedName) {
                        resolve(el.contact.formattedName);
                    } else {
                        resolve('+' + (payload.id.split('@')[0]));
                    }
                }).catch(reason => { reject(reason); });
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

        closeWs (context) {
            if (context.state.ws) {
                context.state.ws.close(4000);
            }
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
                let type = payload.full === true ? 'full' : 'min';
                if (context.state.pictures[type] && context.state.pictures[type][payload.id] && new Date().getTime() - context.state.pictures[type][payload.id].t <= 10800000) {
                    resolve(context.state.pictures[type][payload.id].picture);
                } else {
                    context.dispatch('sendWsMessage', { event: 'findPicture', payload: { id: payload.id, full: payload.full === true } }).then(data => {
                        if (data !== '') {
                            api.get(`/api/downloadFile/${data}`, { responseType: 'blob' }).then(value => {
                                context.dispatch('convertToBase64', { file: value.data }).then(base64 => {
                                    context.commit('ADD_PICTURE_TO_CACHE', { id: payload.id, picture: base64, t: new Date().getTime(), type: type });
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
                if (context.state.medias[payload.id]) {
                    resolve(context.state.medias[payload.id]);
                } else {
                    context.dispatch('sendWsMessage', { event: 'downloadMedia', payload: payload.id }).then(data => {
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
                resolve([]);
                /* context.dispatch('sendWsMessage', { event: 'findChatCustomProperties', payload: payload.id }).then(data => {
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
                context.dispatch('setMsgsProperties', el.msgs);
                el.quotedMsg = undefined;
                el.openChatInfo = false;
                el.customProperties = {
                    properties: [],
                    loaded: false,
                    loadProperties: function () {
                        this.loaded = false;
                        return context.dispatch('findCustomProperties', { id: el.id }).then(value => {
                            this.properties = value;
                            this.loaded = true;
                        });
                    }
                };
                el.sendQueue = [];
                el.sendMessage = function (payload) {
                    Object.assign(payload, {
                        chatId: this.id
                    });
                    return context.dispatch('sendMsg', payload);
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
                Object.defineProperty(msg, 'isDocument', {
                    get () {
                        return this.type === 'document';
                    }
                });
                Object.defineProperty(msg, 'isAudio', {
                    get () {
                        return this.type === 'ptt';
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
                        return this.isChat && !this.hasQuotedMsg;
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
                    context.dispatch('setMsgsProperties', payload);
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
                    if (!payload.id.fromMe && chat.muteExpiration <= 0 && payload.id.isNewMsg) {
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
