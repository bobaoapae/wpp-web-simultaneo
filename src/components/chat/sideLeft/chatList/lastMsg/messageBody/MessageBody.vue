<template>
    <span v-html="msgBody" v-if="lastMsg.isChat"></span>

    <span v-else-if="lastMsg.isImage">
        <img src="@/assets/images/wpp-type-foto.svg">
        Foto
    </span>

    <span v-else-if="lastMsg.isSticker">
        <img src="@/assets/images/wpp-type-sticker.svg">
        Figurinha
    </span>

    <span v-else-if="lastMsg.isGif">
        <img src="@/assets/images/wpp-type-gif.svg">
        GIF
    </span>

    <span v-else-if="lastMsg.isVideo">
        <img src="@/assets/images/wpp-type-video.svg">
        Video
    </span>

    <span v-else-if="lastMsg.isDocument">
        <img src="@/assets/images/wpp-type-document.svg">
        {{lastMsg.filename}}
    </span>

    <span v-else-if="lastMsg.isPtt">
        <img src="@/assets/images/wpp-type-ptt-blue.svg" v-if="lastMsg.ack === 4">
        <img src="@/assets/images/wpp-type-ptt-gray.svg" v-else-if="lastMsg.id.fromMe">
        <img src="@/assets/images/wpp-type-ptt-green.svg" v-else>
        {{duration}}
    </span>

    <span v-else-if="lastMsg.isAudio">
        <img src="@/assets/images/wpp-type-audio.svg">
        Áudio
    </span>

    <span v-else-if="lastMsg.isVcard">
        <img src="@/assets/images/wpp-type-vcard.svg">
        <span v-html="filters.emojify(lastMsg.vCard.fn[0].value)"></span>
    </span>

    <span v-else-if="lastMsg.isLocation">
        <img src="@/assets/images/wpp-type-location.svg">
        Localização
    </span>

    <span class="msgRevoked" v-else-if="lastMsg.isRevoked">
        <span data-icon="recalled-in">
            <svg height="19" id="Layer_1" viewBox="0 0 17 19" width="17" xmlns="http://www.w3.org/2000/svg">
                <path
                    d="M12.629 12.463a5.17 5.17 0 0 0-7.208-7.209l7.208 7.209zm-1.23 1.229L4.191 6.484a5.17 5.17 0 0 0 7.208 7.208zM8.41 2.564a6.91 6.91 0 1 1 0 13.82 6.91 6.91 0 0 1 0-13.82z"
                    fill="#9BA3A7">
                </path>
            </svg>
        </span>

        <span v-if="lastMsg.id.fromMe">Você apagou essa mensagem</span>
        <span v-else>Essa mensagem foi apagada</span>
    </span>
</template>

<script>
import filters from '@/filters';
import { asyncComputed } from '@/AsyncComputed';
import { useStore } from 'vuex';

export default {
    name: 'MessageBody',
    props: {
        lastMsg: {
            type: Object,
            required: true
        }
    },
    setup (props) {
        const store = useStore();

        const msgBody = asyncComputed(async () => {
            let body = filters.emojify(filters.formatMsg(props.lastMsg.body));
            if (props.lastMsg.mentionedJidList && props.lastMsg.mentionedJidList.length > 0) {
                let promises = [];
                let results = {};
                for (let x = 0; x < props.lastMsg.mentionedJidList.length; x++) {
                    promises.push(store.dispatch('findContactFromId', { id: props.lastMsg.mentionedJidList[x] }).then(contact => {
                        results[props.lastMsg.mentionedJidList[x]] = contact;
                    }));
                }
                await Promise.all(promises);
                for (let x = 0; x < props.lastMsg.mentionedJidList.length; x++) {
                    let contact = results[props.lastMsg.mentionedJidList[x]];
                    let name = contact.formattedName || contact.verifiedName || contact.pushname;
                    body = body.replace('@' + props.lastMsg.mentionedJidList[x].split('@')[0], `<span class='mention-symbol'>@</span><span dir="ltr">${name}</span>`);
                }
            }
            return filters.emojify(body);
        }, { default: props.lastMsg.body, lazy: true });

        return {
            msgBody,
            filters
        };
    },
    computed: {
        duration () {
            const duration = this.lastMsg.duration;

            if (duration < 10) {
                return `0:0${duration}`;
            } else if (duration < 60) {
                return `0:${duration}`;
            }
            const m = Math.floor(duration / 60);
            let s = Math.floor((((duration / 60) - m) * 60));

            if (s < 10) s = '0' + s;

            return `${m}:${s}`;
        }
    },

};
</script>

<style scoped>
span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

span img {
    vertical-align: top;
}

.msgRevoked {
    font-style: italic;
}

.msgRevoked span:nth-child(1) {
    margin-right: 2px;
}
</style>
