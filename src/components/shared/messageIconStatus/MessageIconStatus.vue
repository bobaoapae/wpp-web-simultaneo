<template>

    <span>
        <img src="@/assets/images/wpp-status-clock.svg" v-if="ack === 0">
        <img src="@/assets/images/wpp-status-one-check-gray.svg" v-else-if="ack === 1">
        <img src="@/assets/images/wpp-status-two-check-gray.svg" v-else-if="ack === 2">
        <img src="@/assets/images/wpp-status-two-check-blue.svg" v-else-if="ack === 3">
    </span>

</template>

<script>
export default {
  name: 'MessageIconStatus',
  props: {
    ack: {
      type: Number,
      required: true
    }
  }
};
</script>

<style scoped>

</style>
