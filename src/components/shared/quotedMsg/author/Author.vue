<template>
    <div class="author">
        <span class="name" :style="{color:color}" >{{autor}}</span>
    </div>
</template>

<script>
    import {mapState} from 'vuex'

    export default {
        name: "Author",
        props: {
            senderObj: {
                type: Object,
                required: true,
            },
            color: {
                type: String,
                required: true
            }
        },
        computed: {
            ...mapState(["self"]),

            autor() {
                if (this.senderObj.name) {
                    return this.senderObj.name
                } else if (this.senderObj.id === this.self.id) {
                    return "Você"
                } else {
                    return "+"+this.senderObj.id.replace("@c.us", "");
                }
            }
        }
    }
</script>

<style scoped>
    .name {
        color: #35cd96;
        font-size: 12.8px;
        font-weight: 500;
    }
</style>