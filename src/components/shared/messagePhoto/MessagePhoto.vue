<template>
    <div class="message-photo">
        <div class="photo-container">
            <div class="box-image" :class="{blur : !imageFull}">
                <img
                        class="imageFull"
                        :src="imageFull"
                        @click="handleClick"
                        v-if="imageFull"
                />

                <img class="preview" :src="preview" v-else/>
            </div>

            <LoadingMedia v-if="!imageFull"/>
        </div>


        <div class="box-caption" v-if="msg.caption">
            <span v-html="captionFormated"></span>
        </div>

        <MessageTime :msg="msg" :class="{'no-caption' : !haveCaption}"/>
    </div>
</template>

<script>
    import MessageTime from "../messageTime/MessageTime";
    import api from '@/api.js';
    import {msg} from '@/helper.js';
    import {mapActions, mapMutations} from 'vuex'
    import LoadingMedia from "../loadingMedia/LoadingMedia";

    export default {
        name: "MessagePhoto",
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
        data() {
            return {
                imageFull: this.msg.base64MediaFull
            }
        },
        created() {
            //console.log('imageFull:', this.imageFull);
            this.getFullImage();
        },
        computed: {
            preview() {
                return "data:image/jpeg;base64," + this.msg.body
            },
            haveCaption() {
                return this.msg.caption !== undefined;
            },
            captionFormated() {
                if (this.msg.caption) {
                    return msg.formatMsg(this.msg.caption);
                } else {
                    return '';
                }
            }
        },
        methods: {
            ...mapMutations(['SET_MODAL']),
            ...mapActions(['addFullMediaInMsg']),

            getFullImage() {
                if (!this.msg.base64MediaFull) {
                    console.log('GET PHOTO');
                    api.get(`/api/whatsApp/mediaMessage/${this.msg.id._serialized}`)
                        .then(r => {
                            this.imageFull = r.data.base64;

                            let idChat;
                            if (this.msg.id.fromMe) {
                                idChat = this.msg.to;
                            } else {
                                idChat = this.msg.from;
                            }

                            this.addFullMediaInMsg({
                                idChat: idChat,
                                idMsg: this.msg.id,
                                imagem: r.data.base64,
                            })
                        })
                }
            },
            handleClick() {
                this.SET_MODAL({
                    show: true,
                    media: this.imageFull,
                    type: 'img'
                })
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
</style>