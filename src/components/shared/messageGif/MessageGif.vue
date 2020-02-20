<template>
    <div class="message-gif" v-b-visible.once="onVisible">
        <div class="gif-container">
            <div class="box-preview blur" v-if="!srcVideo">
                <img :src=" 'data:image/jpeg;base64,'+ msg.body" alt="body">
            </div>
            <video :src="srcVideo" autoplay loop v-else/>
            <LoadingMedia v-if="!srcVideo"/>
        </div>

        <div @dblclick.prevent.stop class="box-caption" v-if="msg.hasCaption">
            <span v-html="caption"></span>
        </div>

        <MessageTime :class="{'no-caption' : !msg.hasCaption, 'custom-time' : !msg.hasCaption}" :msg="msg"/>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import LoadingMedia from '../loadingMedia/LoadingMedia.vue';
import MessageTime from '../messageTime/MessageTime.vue';

export default {
    name: 'MessageGif',
    components: {
        LoadingMedia,
        MessageTime
    },
    props: {
        msg: {
            type: Object,
            required: true
        }
    },
    data () {
        return {
            srcVideo: ''
        };
    },
    asyncComputed: {
        caption: {
            async get () {
                let caption = this.$options.filters.emojify(this.$options.filters.formatMsg(this.msg.caption));
                if (this.msg.mentionedJidList && this.msg.mentionedJidList.length > 0) {
                    let promises = [];
                    let results = {};
                    for (let x = 0; x < this.msg.mentionedJidList.length; x++) {
                        promises.push(this.findChatFromId({ id: this.msg.mentionedJidList[x] }).then(value => {
                            results[this.msg.mentionedJidList[x]] = value;
                        }));
                    }
                    await Promise.all(promises);
                    for (let x = 0; x < this.msg.mentionedJidList.length; x++) {
                        let chat = results[this.msg.mentionedJidList[x]];
                        let name = chat.contact.formattedName || chat.contact.verifiedName || chat.contact.pushname;
                        caption = caption.replace('@' + this.msg.mentionedJidList[x].split('@')[0], `<span class='mention-symbol'>@</span><span class='btn-link' dir="ltr">${name}</span>`);
                    }
                }
                return caption;
            },
            default () {
                return this.msg.caption;
            }
        }
    },
    methods: {
        ...mapActions(['downloadMedia', 'findChatFromId']),
        getVideo () {
            this.downloadMedia({ id: this.msg.id._serialized }).then(e => {
                this.srcVideo = e.base64;
            });
        },
        onVisible (visible) {
            if (visible && !this.srcVideo) {
                this.getVideo();
            }
        }
    }
};
</script>

<style scoped>
.message-gif {
    padding: 3px;
}

.gif-container {
    max-width: 220px;
    min-width: 220px;
    max-height: 160px;
    min-height: 160px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
}

.box-caption {
    max-width: 220px;
    min-width: 220px;
    user-select: text;
}

.box-preview {
    min-width: 100%;
    min-height: 100%;
}

.blur {
    filter: blur(8px);
}

video {
    width: 100%;
    height: 100%;
}

.no-caption {
    color: #FFF;
    background: rgba(0, 0, 0, 0.3);
    padding: 0 5px;
    border-radius: 3px;
}

.box-caption span {
    font-size: 14.2px;
    color: #262626;
}

.custom-time {
    right: 3px;
    bottom: 3px;
}

.box-caption >>> .mention-symbol {
    color: rgba(0, 0, 0, 0.25)
}
</style>
