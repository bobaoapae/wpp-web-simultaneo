<template>
    <div class="my-modal" v-if="modal.show">
        <div class="modal-header">
            <a :href="formatedHref" download>
                <img class="icon-download" src="@/assets/images/wpp-icon-donwload-modal.svg">
            </a>

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
    import {mapState, mapMutations} from 'vuex'

    export default {
        name: "ModalMedia",
        data() {
            return {
                listener: {}
            }
        },
        computed: {
            ...mapState(["modal"]),
            formatedHref() {
                return `${localStorage.baseURL}/api/whatsApp/mediaMessage/${this.modal.id}/true?token=${sessionStorage.TOKEN}`
            }
        },
        updated() {
            this.handleModalKeydown();
        },
        methods: {
            ...mapMutations(['SET_MODAL']),

            handleModalKeydown() {
                if (this.modal.show) {
                    this.listener = (event) => {
                        if(event.key === "Escape") {
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
                const element = document.createElement('a');
                element.setAttribute('href', this.modal.media);
                element.setAttribute('download', this.modal.media);

                element.style.display = 'none';
                document.body.appendChild(element);

                element.click();

                document.body.removeChild(element);
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