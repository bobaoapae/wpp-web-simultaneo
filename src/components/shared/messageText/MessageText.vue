<template>
    <div class="text-container">
        <div @dblclick.prevent.stop>
            <Thumbnail :msg="msg" v-if="msg.matchedText"/>

            <MessageTextContent :msg="msg"/>
        </div>

        <MessageTime :msg="msg"/>

    </div>
</template>

<script>
import MessageTime from '../messageTime/MessageTime.vue';
import Thumbnail from '../thumbnail/Thumbnail.vue';
import MessageTextContent from '@/components/shared/messageTextContent/MessageTextContent.vue';

export default {
    name: 'MessageText',
    components: {
        MessageTime,
        Thumbnail,
        MessageTextContent
    },
    props: {
        msg: {
            type: Object,
            required: true
        }
    }
};
</script>

<style scoped>
.text-container {
    min-width: 100px;
    max-width: 500px;
    user-select: text;
}
</style>
