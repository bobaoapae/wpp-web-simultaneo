<template>
    <div class="photo-container">
        <div class="message-photo">
            <div class="previw" :class="{blur : !imagem}">
                <div class="box-image">
                    <img :src="imagem || previewImage" @click="handleClick"/>
                </div>
            </div>

            <div class="overlay" v-if="!imagem">
                <div>
                    <div class="box-circle">
                        <svg width="50" height="50" viewBox="0 0 43 43" class="spinner">
                            <circle
                                    cx="21.5"
                                    cy="21.5"
                                    r="20"
                                    fill="none"
                                    stroke-width="3"
                            >
                            </circle>
                        </svg>
                    </div>

                    <div class="box-cross">
                        <span data-icon="media-cancel">
                            <svg id="Layer_1"
                                 xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 44 44" width="44"
                                 height="44">
                                <path fill="#FFF"
                                      d="M29.377 16.099l-1.475-1.475L22 20.525l-5.901-5.901-1.476 1.475L20.525 22l-5.901 5.901 1.476 1.475 5.9-5.901 5.901 5.901 1.475-1.475L23.475 22l5.902-5.901z">
                                </path>
                            </svg>
                        </span>
                    </div>
                </div>
            </div>
        </div>


        <div class="box-caption" v-if="msg.caption">
            <span>{{msg.caption}}</span>
        </div>

        <MessageTime :msg="msg" :class="{'text-white' : haveCaption}"/>
    </div>
</template>

<script>
    import MessageTime from "../messageTime/MessageTime";
    import api from '@/api.js';
    // colocar botão para baixar iagem
    // ao baixar, trocar previw para a imagem top
    // tirar o botão de baixar
    // ao clicar na imagem, abrir o modal

    export default {
        name: "MessagePhoto",
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
                imagem : ''
            }
        },
        created() {
            this.getFullImage();
        },
        computed: {
            previewImage() {
                return "data:image/jpeg;base64," + this.msg.body
            },
            haveCaption() {
                return this.msg.caption === undefined;
            }
        },
        methods: {
            getFullImage() {
                api.get(`/api/whatsApp/mediaMessage/${this.msg.id._serialized}`)
                    .then(r => {
                        this.imagem = r.data.base64;
                    })
            },
            handleClick() {
                if (this.imagem) {
                    alert('ABRIR MODAL');
                }
            }
        }
    };
</script>

<style scoped>


    .photo-container {
        padding: 3px;
        max-width: 330px;
        min-width: 330px;
    }

    .message-photo {
        max-height: 330px;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;
        flex-direction: column;
        border-radius: 6px;
    }

    .previw {
        width: 100%;
    }

    .blur {
        filter: blur(8px);
    }


    img {
        width: 100%;
    }

    .box-caption {
        padding: 7px 4px 5px 6px;
        line-height: 19px;
        margin-bottom: 20px;
    }

    .box-caption span {
        font-size: 14.2px;
        color: #262626;
        white-space: pre-wrap;
        word-wrap: break-word;

    }

    .time {
        font-size: 11px;
        color: rgba(0, 0, 0, 0.45);
        position: absolute;
        right: 7px;
        bottom: 7px;
    }


    .overlay {
        position: absolute;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 130px;
        right: 190px;
    }

    .box-circle {
        position: absolute;
    }

    .box-cross {
        height: 50px;
        width: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        position: absolute;
    }

    svg.spinner {
        animation: rotate 2s linear infinite;
    }

    .spinner circle {
        animation: daley 1.5s ease-in-out infinite;
        stroke: hsla(0, 0%, 100%, .9);
    }

    @keyframes daley {
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

    @keyframes rotate {
        100% {
            transform: rotate(1turn);
        }
    }
</style>