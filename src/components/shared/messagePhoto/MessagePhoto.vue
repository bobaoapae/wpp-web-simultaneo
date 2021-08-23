<template>
    <div class="message-photo" v-observe-visibility="{
         throttle: 300,
         callback: onVisible,
         once: true
    }">
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

        <MessageTextContent @dblclick.prevent.stop v-if="msg.hasCaption" :msg="msg"/>

        <MessageTime :class="{'no-caption' : !haveCaption, 'custom-time' : !haveCaption}" :msg="msg"/>
    </div>
</template>

<script>
import { mapActions, mapMutations } from 'vuex';
import MessageTime from '../messageTime/MessageTime.vue';
import LoadingMedia from '../loadingMedia/LoadingMedia.vue';
import MessageTextContent from '@/components/shared/messageTextContent/MessageTextContent.vue';

export default {
    name: 'MessagePhoto',
    components: {
        MessageTextContent,
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

.box-caption ::v-deep(.mention-symbol) {
    color: rgba(0, 0, 0, 0.25);
}
</style>
