<template>
    <div class="my-modal" v-if="modal.show">
        <div class="modal-header">
            <span @click="download">
                <img class="icon-download" src="@/assets/images/wpp-icon-donwload-modal.svg">
            </span>

            <img @click="closeModal" class="icon-close" src="@/assets/images/wpp-icon-close-modal.svg">
        </div>

        <div @click.stop="handleClick" class="content">
            <div class="box-image" v-if="modal.type === 'img'">
                <img :src="modal.media">
            </div>

            <div class="box-video" v-else-if="modal.type === 'video'">
                <video :src="modal.media" autoplay controls></video>
            </div>
        </div>
    </div>
</template>

<script>
import { mapState, mapMutations, mapActions } from 'vuex';

export default {
    name: 'ModalMedia',
    data () {
        return {
            listener: {}
        };
    },
    computed: {
        ...mapState(['modal'])
    },
    mounted () {
        this.$root.$on('keyDown', (evt) => {
            if (this.modal.show) {
                evt.preventDefault();
                if (evt.key === 'Escape') {
                    this.closeModal();
                }
            }
        });
    },
    methods: {
        ...mapMutations(['SET_MODAL']),
        ...mapActions(['downloadMedia']),

        closeModal () {
            this.SET_MODAL({
                show: false
            });
        },
        handleClick (evt) {
            if (evt.toElement.className === 'content') {
                this.$root.$emit('focusInput');
                this.closeModal();
            }
        },

        download () {
            this.downloadMedia({ id: this.modal.id }).then(e => {
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
};
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
