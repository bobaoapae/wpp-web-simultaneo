<template>
    <router-link class="return-btn" to="/" tag="button" />
</template>

<script>
export default { name: 'ReturnButton' };
</script>

<style scoped>
.return-btn {
    background-color: transparent;
    border: transparent;
    height: 25px;
    width: 25px;
    background-image:url("@/assets/images/return_arrow.png");
    background-repeat: no-repeat;
    background-size: cover;
    margin: 12px;
}
</style>
