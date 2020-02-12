<template>
    <div class="location">
        <a :href="link" target="_blank">
            <img :src="'data:image/jpeg;base64,'+msg.body" alt="">
        </a>
    </div>
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
            return `https://maps.google.com/maps?q=${this.msg.lat}%2C${this.msg.lng}&z=17&hl=pt-BR`;
        }
    }
};
</script>

<style scoped>
    img {
        width: 270px;
        height: 150px;
        object-fit: contain;
    }
</style>
