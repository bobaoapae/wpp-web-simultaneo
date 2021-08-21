<template>
    <div class="sticker-container" ref="stickerContainer" v-observe-visibility="{
         throttle: 300,
         callback: onVisible,
         once: true
    }">
        <div class="box-sticker">
            <img :src="this.sticker" alt="sticker" class="sticker" v-if="this.sticker"/>
            <LoadingMedia v-else/>
        </div>

        <MessageTime :msg="msg"/>
    </div>
</template>

<script>
import { mapActions, mapState } from 'vuex';
import MessageTime from '@/components/shared/messageTime/MessageTime.vue';
import LoadingMedia from '../loadingMedia/LoadingMedia.vue';

export default {
    name: 'MessageSticker',
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
    mounted () {
        if (!this.msg.quotedMsg) {
            this.$refs.stickerContainer.parentElement.style.backgroundColor = 'transparent';
            this.$refs.stickerContainer.parentElement.style.boxShadow = 'none';
        }
    },
    data () {
        return {
            sticker: ''
        };
    },
    computed: {
        ...mapState(['activeChat'])
    },
    methods: {
        ...mapActions(['downloadMedia']),

        getSticker () {
            this.downloadMedia({ id: this.msg.id._serialized }).then(e => {
                this.sticker = e.base64;
            });
        },
        onVisible (visible) {
            if (visible && !this.sticker) {
                this.getSticker();
            }
        }
    }
};
</script>

<style scoped>
.sticker-container {
    display: flex;
    justify-content: center;
    align-items: center;
}

.box-sticker {
    min-width: 125px;
    max-width: 125px;
    min-height: 125px;
    max-height: 125px;
    margin-bottom: 30px;
}

img {
    width: 100%;
    height: 100%;
}
</style>
