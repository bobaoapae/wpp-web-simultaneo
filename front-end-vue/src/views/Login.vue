<template>
    <div class="bg" id="login">
        <div class="container">
            <div class="content">
                <div class="content-header"></div>

                <form id="form-login" @submit.prevent="handleLogin">
                    <p>Login</p>

                    <input type="text" id="user" placeholder="USUARIO" required v-model="form.user" />

                    <input
                        type="password"
                        id="password"
                        placeholder="SENHA"
                        required
                        v-model="form.pass"
                    />

                    <button type="submit">ENTRAR</button>

                    <span class="error">Usuario e/ou Senha invalido</span>
                </form>

                <hr />

                <a href="https://www.zapia.com.br" target="_blank">Zapiá</a>
            </div>
        </div>
    </div>
</template>

<script>
import api from "@/api";
import $ from "jquery";

export default {
    name: "Login",
    data() {
        return {
            form: {
                user: "joao",
                pass: "joao0123@"
            }
        };
    },
    methods: {
        handleLogin() {
            // const param = $.param({
            //     login: this.form.user,
            //     senha: this.form.pass,
            //     estabelecimento: "11e9827c-23f6-46c7-9c91-4bca525f4311"
            // });

            // api.get(`manager/generateToken?${param}`)
            //     .then((r) => {
            //         localStorage.TOKEN = r.data.token;
            //         this.$router.push("/");
            //     });

            const f = new FormData();
            f.append('login', this.form.user)
            f.append('senha',this.form.pass)

            api.post('/api/auth/login', f)
                .then((r) => {
                    localStorage.TOKEN = r.data.token;
                    this.$router.push("/");
                })
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

form > p {
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

.error {
    text-align: center;
    color: red;
    display: none;
}

.error.active {
    display: block;
}

hr {
    width: 80%;
    text-align: center;
}

a {
    text-align: center;
    margin-bottom: 50px;
}
</style>