<template>
    <div class="my-modal" v-if="modal.show">
        <div class="modal-header">
            <span @click="download">
                <img class="icon-download" src="@/assets/images/wpp-icon-donwload-modal.svg">
            </span>

            <img class="icon-close" src="@/assets/images/wpp-icon-close-modal.svg" @click="closeModal">
        </div>

        <div class="content" @click.stop="handleClick">
            <div class="box-image" v-if="modal.type === 'img'">
                <img :src="modal.media">
            </div>

            <div class="box-video" v-else-if="modal.type === 'video'">
                <video autoplay controls :src="modal.media"></video>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapState, mapMutations, mapActions} from 'vuex'

    export default {
        name: "ModalMedia",
        data() {
            return {
                listener: {}
            }
        },
        computed: {
            ...mapState(["modal"]),
        },
        updated() {
            this.handleModalKeydown();
        },
        methods: {
            ...mapMutations(['SET_MODAL']),
            ...mapActions(['sendWsMessage']),

            handleModalKeydown() {
                if (this.modal.show) {
                    this.listener = (event) => {
                        if (event.key === "Escape") {
                            this.closeModal();
                        }
                    };

                    document.addEventListener('keydown', this.listener, false);
                } else {
                    document.removeEventListener('keydown', this.listener, false);
                }
            },
            closeModal() {
                this.SET_MODAL({
                    show: false
                });
            },
            handleClick(evt) {
                if (evt.toElement.className === "content") {
                    this.closeModal();
                }
            },

            download() {
                this.sendWsMessage({msg: `downloadMedia,${this.modal.id}`}).then(e => {
                    const element = document.createElement('a');
                    element.setAttribute('href', e.base64);
                    element.setAttribute('download', e.fileName);

                    element.style.display = 'none';
                    document.body.appendChild(element);

                    element.click();

                    document.body.removeChild(element);
                });
            }
        }
    }
</script>

<style scoped>
    .my-modal {
        position: absolute;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background-color: rgba(255, 255, 255, 0.90);
        display: flex;
        flex-direction: column;
        z-index: 9999;
    }

    .modal-header {
        height: 60px;
        background: #FFF;
        justify-content: flex-end;
    }

    .icon-close {
        margin-left: 15px;
    }

    .icon-close, .icon-download {
        cursor: pointer;
    }

    .content {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .box-image, .box-video {
        padding: 15px;
    }

    .box-image img {
        max-height: calc(100vh - 100px);
        max-width: 100%;
    }

    .box-video video {
        max-height: calc(100vh - 100px);
        max-width: 100%;
    }
</style>