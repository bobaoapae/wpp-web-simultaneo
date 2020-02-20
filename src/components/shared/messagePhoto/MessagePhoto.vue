<template>
    <div class="message-photo" v-b-visible.once="onVisible">
        <div class="photo-container">
            <div class="box-image">
                <img
                    :src="imageFull"
                    @click="handleClick"
                    class="imageFull"
                    v-if="imageFull"
                />

                <img :class="{blur : !imageFull}" :src="preview" class="preview" v-else/>
            </div>

            <LoadingMedia v-if="!imageFull"/>
        </div>

        <div @dblclick.prevent.stop class="box-caption" v-if="msg.caption">
            <span :inner-html.prop="caption"></span>
        </div>

        <MessageTime :class="{'no-caption' : !haveCaption, 'custom-time' : !haveCaption}" :msg="msg"/>
    </div>
</template>

<script>
import MessageTime from '../messageTime/MessageTime';
import LoadingMedia from '../loadingMedia/LoadingMedia';
import { mapActions, mapMutations } from 'vuex';

export default {
    name: 'MessagePhoto',
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
            imageFull: ''
        };
    },
    computed: {
        preview () {
            return 'data:image/jpeg;base64,' + this.msg.body;
        },
        haveCaption () {
            return this.msg.caption !== undefined;
        }
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
        ...mapMutations(['SET_MODAL']),
        ...mapActions(['downloadMedia', 'findChatFromId']),

        getFullImage () {
            this.downloadMedia({ id: this.msg.id._serialized }).then(e => {
                this.imageFull = e.base64;
            });
        },
        handleClick () {
            this.SET_MODAL({
                show: true,
                media: this.imageFull,
                type: 'img',
                id: this.msg.id._serialized
            });
        },
        onVisible (visible) {
            if (visible && !this.imageFull) {
                this.getFullImage();
            }
        }
    }
};
</script>

<style scoped>
.message-photo {
    padding: 5px;
}

.photo-container {
    max-width: 330px;
    min-width: 330px;
    max-height: 330px;
    min-height: 100px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 6px;
}

.box-caption {
    max-width: 330px;
    min-width: 330px;
    word-wrap: break-word;
    user-select: text;
}

.box-image {
    min-width: 100%;
    min-height: 100%;
}

.blur {
    filter: blur(8px);
}

img {
    width: 100%;
    height: 100%;
}

.imageFull {
    cursor: pointer;
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
    right: 5px;
    bottom: 6px;
}

.box-caption >>> .mention-symbol {
    color: rgba(0, 0, 0, 0.25);
}
</style>
