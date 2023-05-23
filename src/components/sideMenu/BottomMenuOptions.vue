<template>
<div>
    <SettingsButton/>
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
import SettingsButton from '@/components/ui/SettingsButton.vue';

export default {
    name: 'BottomMenuOption',
    components: { SettingsButton },
    computed: {
        ...mapState(['self'])
    },
    import: {
        SettingsButton
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
