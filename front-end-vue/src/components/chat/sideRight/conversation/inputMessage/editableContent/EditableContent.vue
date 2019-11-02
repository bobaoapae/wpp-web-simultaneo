<template>
    <div
            ref="editable"
            contenteditable="true"
            v-on="listeners"
    ></div>
</template>

<script>
    export default {
        props: {
            value: {
                type: String,
                default: '',
            },
        },
        computed: {
            listeners() {
                return { ...this.$listeners, input: this.onInput };
            },
        },
        mounted() {
            this.$refs.editable.innerHTML = this.value;
        },
        methods: {
            onInput(e) {
                this.$emit('input', e.target.innerHTML);
            },
        },
    };
</script>