<template>
    <div class="bg" id="login">
        <div class="container">
            <div class="content">
                <div class="content-header"></div>

                <form @submit.prevent="handleSubmit" id="form-login">
                    <p class="title">Esqueci minha senha</p>

                    <p class="text-center font-weight-bold">Problemas para entrar?</p>
                    <p class="text-center">Insira o seu nome de usuário e enviaremos uma nova senha para seu número de WhatsApp cadastrado</p>

                    <input id="login" placeholder="Login" required type="text" v-model="form.login" />

                    <button type="submit">
                        ENVIAR
                    </button>
                </form>

                <div class="d-flex justify-content-center separator">
                    <span class="line"></span>
                    <span class="mx-3">OU</span>
                    <span class="line"></span>
                </div>

                <router-link class="new-account-link" to="/newaccount">Criar uma nova conta</router-link>

                <hr />

                <a class="site-link" href="https://www.zapia.com.br" target="_blank">Zapiá</a>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Login',
    data () {
        return {
            form: {
                login: ''
            }
        };
    },
    methods: {
        handleSubmit () {

        }
    }
};
</script>

<style scoped>
.bg {
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: linear-gradient(175deg, #009688 0%, #1ebea5 50%);
}

.bg:before {
    content: "";
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0.2;
    background-image: url("../assets/images/bg-login.png");
    background-position: center;
}

.container {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: center;
    z-index: 1;
}

.content {
    display: flex;
    flex-direction: column;
    flex: 1;
    max-width: 450px;
    justify-content: center;
    align-content: center;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 17px 50px 0 rgba(0, 0, 0, 0.19),
        0 12px 15px 0 rgba(0, 0, 0, 0.24);
}

.content-header {
    height: 50px;
    width: 100%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: linear-gradient(300deg, #009688 0%, #1ebea5 50%);
}

form {
    display: flex;
    flex-direction: column;
    margin: 0 50px;
}

form p.title {
    text-align: center;
    font-weight: bold;
    font-size: 30px;
    margin: 0;
    padding: 30px 0;
}

form input {
    border: none;
    height: 50px;
    background: #e4e4e4bf;
    margin-bottom: 25px;
    border-radius: 20px;
    padding: 10px;
    outline: none;
}

form button {
    border: none;
    height: 45px;
    border-radius: 20px;
    background: linear-gradient(300deg, #009688 0%, #1ebea5 50%);
    transition: opacity 0.3s;
    color: aliceblue;
}

form button:hover {
    opacity: 0.7;
}

hr {
    width: 80%;
    text-align: center;
}

.separator {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 50px;
    margin: 15px 0;
}

.separator span.line {
    height: 1px;
    flex-grow: 1;
    background: rgba(0,0,0,.1);
}

.new-account-link {
    text-align: center;
}

.site-link {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 15px;
}
</style>
