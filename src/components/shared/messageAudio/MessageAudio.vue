<template>
    <div class="message-audio">
        <div class="audio-container">
            <div class="box-spinner" v-show="srcLoading && !srcAudio">
                <svg
                        class="_2bESe"
                        width="34"
                        height="34"
                        viewBox="0 0 43 43">
                    <circle
                            class="oWVod _1y_Nu _2BA8e"
                            cx="21.5"
                            cy="21.5"
                            r="20"
                            fill="none"
                            stroke-width="3">

                    </circle>
                </svg>
            </div>

            <div class="box-download" v-show="srcError && !srcLoading && !srcAudio" @click="getAudio">
                <img src="@/assets/images/wpp-icon-download-audio.svg">
            </div>

            <div class="box-range" v-show="srcLoading || srcError"></div>

            <audio v-show="!srcLoading && !srcError && srcAudio" controls :src="srcAudio"></audio>

            <MessageTime :msg="msg"/>
        </div>
    </div>
</template>

<script>
    import {mapActions} from 'vuex'
    import api from '@/api'
    import MessageTime from "../messageTime/MessageTime";

    export default {
        name: "MessageAudio",
        components: {
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
                srcAudio: this.msg.base64MediaFull,
                srcLoading: false,
                srcError: false
            }
        },
        created() {
            if (!this.msg.base64MediaFull) {
                this.getAudio();
            }
        },
        methods: {
            ...mapActions(['addFullMediaInMsg']),

            getAudio() {
                console.log('GET AUDIO');

                this.srcLoading = true;

                api.get(`/api/whatsApp/mediaMessage/${this.msg.id._serialized}/false`)
                    .then(r => {
                        console.log(r);
                        this.srcAudio = r.data.base64;
                        this.srcLoading = false;
                        this.srcError = false;
                        this.saveInCache(r.data.base64);
                    })
                    .catch(e => {
                        this.srcLoading = false;
                        this.srcError = true;
                    })
            },
            saveInCache(media) {
                let idChat;
                if (this.msg.id.fromMe) {
                    idChat = this.msg.to;
                } else {
                    idChat = this.msg.from;
                }

                this.addFullMediaInMsg({
                    idChat: idChat,
                    idMsg: this.msg.id,
                    media: media,
                })
            },
        }
    }
</script>

<style scoped>
    .message-audio {
        padding: 3px;
    }

    .audio-container {
        display: flex;
        align-items: center;
        margin-bottom: 25px;
    }

    .box-spinner {
        padding: 5px;
        margin-right: 10px;
    }

    .box-download {
        padding: 5px;
        margin-right: 10px;
    }

    .box-range {
        min-width: 200px;
        min-height: 20px;
        display: flex;
        align-items: center;
        margin-right: 10px;
    }

    .box-range::before {
        content: '';
        width: 100%;
        height: 3px;
        background-color: rgba(0, 0, 0, .2);
        display: block;
        border-radius: 10px;
    }


    audio {
        background: transparent !important;
    }

    svg {
        animation: _3rafi 2s linear infinite;
    }


    ._2BA8e {
        stroke: #849982;
    }

    .oWVod {
        stroke-dasharray: 1, 150;
        stroke-dashoffset: 0;
        stroke-linecap: round;
        animation: _1NbMv 1.5s ease-in-out infinite;
    }

    @keyframes _3rafi {
        100% {
            transform: rotate(1turn);
        }
    }

    @keyframes _1NbMv {
        0% {
            stroke-dasharray: 1, 150;
            stroke-dashoffset: 0;
        }
        50% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -35;
        }
        100% {
            stroke-dasharray: 90, 150;
            stroke-dashoffset: -124;
        }
    }
</style>