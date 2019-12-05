<template>
    <router-view />
</template>

<script>
export default {
    name: "App"
};
</script>

<style>
html,
body {
    height: 100%;
}

::-webkit-scrollbar {
    width: 6px!important;
    height: 6px!important;
}

::-webkit-scrollbar-thumb {
    background-color: rgba(0,0,0,.2);
}

::-webkit-scrollbar-track {
    background: hsla(0,0%,100%,.08);
}

.emoji-mart-category-label span {
    background-color: #f0f0f0 !important;
    color: #969696;
}

</style>