<template>
    <div class="loading-box">
        <LoadingSpinner/>
        <div class="logout" v-if="showLogout">
            <span>Demorando muito? <button class="btn btn-link" @click="logout">Clique aqui</button> para deslogar e reiniciar</span>
        </div>
    </div>
</template>

<script>
import LoadingSpinner from '@/components/shared/loadingSpinner/LoadingSpinner';
import { mapActions } from 'vuex';

export default {
    name: 'Loading',
    components: {
        LoadingSpinner
    },
    data () {
        return {
            timeout: 0,
            showLogout: false
        };
    },
    created () {
        this.timeout = setTimeout(() => {
            this.showLogout = true;
        }, 30000);
    },
    methods: {
        ...mapActions(['logout'])
    }
};
</script>

<style scoped>
.loading-box {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background: #f2f2f2;
}

</style>
