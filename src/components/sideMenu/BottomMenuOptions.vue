<template>
<div>
    <ButtonSettings/>
    <div class="box-photo-profile">
        <img
                :src="self.picture"
                alt="User profile photo"
                class="photo-profile"
                v-if="self.picture"
        />

        <img
                alt="User profile photo"
                class="photo-profile"
                src="../../assets/images/wpp-photo-user.svg"
                v-else
        />
    </div>
</div>
</template>

<script>

import { mapState } from 'vuex';
import ButtonSettings from '@/components/ui/ButtonSettings.vue';

export default {
    name: 'BottomMenuOption',
    components: { ButtonSettings },
    computed: {
        ...mapState(['self'])
    },
    import: {
        ButtonSettings
    }
};
</script>

<style>
.photo-profile {
    margin: 5px;
    cursor: pointer;
    height: 30px;
    width: 30px;
    border-radius: 50%;
    object-fit: cover;
}
</style>
