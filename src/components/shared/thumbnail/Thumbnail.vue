<template>
    <a :href="msg.matchedText" class="thumbnail" target="_blank">
        <div class="image">
            <img :alt="msg.title" :src="`data:image/jpeg;base64,${msg.thumbnail}`" v-if="msg.thumbnail">
        </div>

        <a :href="msg.matchedText" target="_blank">
            <div class="content">
                <div :title="msg.title" class="title">
                    {{msg.title}}
                </div>

                <div :title="msg.description" class="description">
                    {{msg.description}}
                </div>

                <div class="link">
                    {{link}}
                </div>
            </div>
        </a>
    </a>
</template>

<script>
export default {
    props: {
        msg: {
            type: Object,
            required: true
        }
    },
    computed: {
        link () {
            return this.msg.matchedText.split('/')[2];
        }
    }
};
</script>

<style scoped>
.thumbnail {
    background-color: rgba(0, 0, 0, 0.05);
    border-radius: 6px;
    display: flex;
    text-decoration: none;
}

.image img {
    width: 90px;
    height: 90px;
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
}

.content {
    padding: 6px 10px;
    display: flex;
    flex-direction: column;
    max-height: 90px;
}

.title {
    font-size: 13px;
    color: #000;
}

.description {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.45);

    flex: 0 999 auto;
    font-size: 12px;
    overflow: hidden;
    color: rgba(0, 0, 0, .45);
    text-overflow: ellipsis;
}

.link {
    font-size: 12px;
    color: rgba(0, 0, 0, 0.8);
}
</style>
