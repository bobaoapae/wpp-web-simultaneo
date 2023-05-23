<template>
    <div class="side-menu">
        <div class="custom-space"></div>
        <BottomMenuOptions/>
    </div>
</template>

<script>
import BottomMenuOptions from '@/components/sideMenu/BottomMenuOptions.vue';

export default {
    name: 'SideMenu',
    components: {
        BottomMenuOptions
    }
};
</script>

<style scoped>
.side-menu {
    display: flex;
    flex-direction: column;
    background-color: #f0f2f5;
    height: 100%;
}
</style>
