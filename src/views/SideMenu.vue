<template>
    <div class="side-menu">
        <TopMenuOptions/>
        <div class="custom-space"></div>
        <BottomMenuOptions/>
    </div>
</template>

<script>
import TopMenuOptions from '@/components/sideMenu/TopMenuOptions.vue';
import BottomMenuOptions from '@/components/sideMenu/BottomMenuOptions.vue';

export default {
    name: 'SideMenu',
    components: {
        TopMenuOptions,
        BottomMenuOptions
    }
};
</script>

<style scoped>
.side-menu {
    display: flex;
    flex-direction: column;
    background-color: ghostwhite;
    height: 100%;
}
</style>
