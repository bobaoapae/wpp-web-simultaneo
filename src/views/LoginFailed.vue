<template>
    <div id="loading">
        <div class="login-failed">
            <span class="h5 title">Tentando conectar ao celular</span>
            <span class="content">
                <span class="reconnect">Tentando novamente em {{ time }} segundos</span>
                <hr class="divider"/>
                <span class="desc">Certifique-se de que seu telefone tem uma conexão ativa com a internet.</span>
                <hr class="divider"/>
                <div class="logout" v-if="showLogout">
                    <span>Demorando muito? <button class="btn btn-link" @click="logout">Clique aqui</button> para deslogar e reiniciar</span>
                </div>
            </span>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'LoginFailed',
    data () {
        return {
            time: 30,
            intervalId: 0,
            timeout: 0,
            showLogout: false
        };
    },
    created () {
        this.intervalId = setInterval(() => {
            this.time--;
            if (this.time <= 0) {
                this.time = 30;
            }
        }, 1000);
        this.timeout = setTimeout(() => {
            this.showLogout = true;
        }, 30000);
    },
    destroyed () {
        clearInterval(this.intervalId);
        clearTimeout(this.timeout);
    },
    methods: {
        ...mapActions(['logout'])
    }
};
</script>

<style scoped>
#loading {
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f2f2f2;
}

.login-failed {
    background-color: #fff;
    border-radius: 3px;
    box-shadow: 0 17px 50px 0 rgba(0, 0, 0, .19), 0 12px 15px 0 rgba(0, 0, 0, .24);
    padding: 22px 24px 20px;
    box-sizing: border-box;
    display: flex;
    overflow: hidden;
    width: 400px;
    flex-direction: column;
    flex: none;
    font-family: Segoe UI, Helvetica Neue, Helvetica, Lucida Grande, Arial, Ubuntu, Cantarell, Fira Sans, sans-serif;
    color: #4a4a4a;
    text-rendering: optimizeLegibility;
    font-feature-settings: "kern";
}

.divider {
    border: none;
    border-top: 1px solid rgba(0, 0, 0, 0.08);
    margin-top: 12px;
    margin-bottom: 12px;
    height: 1px;
    width: 100%;
}

.content {
    font-size: 14.2px;
    line-height: 20px;
}

</style>
