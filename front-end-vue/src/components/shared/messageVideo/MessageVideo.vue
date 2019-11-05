<template>
    <div>
        <video autoplay controls >
            <source :src="srcVideo">
                    The “video” tag is not supported by your browser.
        </video>
    </div>
</template>

<script>
    export default {
        name: "MessageVideo",
        props: {
            msg: {
                type: Object,
                required: true
            }
        },
        computed: {
            srcVideo() {
                return "data:video/mp4;base64"+this.msg.body
            }
        }
    }
</script>

<style scoped>

</style>