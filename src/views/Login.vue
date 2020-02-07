<template>
   <div class="bg" id="login">
      <div class="container">
         <div class="content">
            <div class="content-header"></div>

            <form @submit.prevent="handleLogin" id="form-login">
               <p>Login</p>

               <input id="user" placeholder="Login" required type="text" v-model="form.user"/>

               <input
                  :type="showPass ? 'text' : 'password'"
                  id="password"
                  placeholder="Senha"
                  required
                  v-model="form.pass"
               />

               <div class="pass-options">
                  <div class="show-pass">
                     <label for="showPass">Mostrar senha</label>
                     <input id="showPass" type="checkbox" v-model="showPass">
                  </div>

                  <router-link class="forgot-password-link" to="/forgotpassword">Esqueci minha senha</router-link>
               </div>

               <button :disabled="btn.loading" type="submit">{{btn.label}}</button>

               <span class="error" v-show="error.active">{{error.msg}}</span>
            </form>

            <hr>

            <div class="box-new-account">
               <span>Ainda não tem uma conta?</span>
               <span>Que tal criar uma agora...</span>
               <router-link to="/newaccount">Clique aqui</router-link>
            </div>

            <hr/>

            <a class="site-link" href="https://www.zapia.com.br" target="_blank">Zapiá</a>
         </div>
      </div>
   </div>
</template>

<script>
import api from '@/api';
import { mapMutations } from 'vuex';

export default {
    name: 'Login',
    data () {
        return {
            form: {
                user: '',
                pass: ''
            },
            btn: {
                label: 'ENTRAR',
                loading: false
            },
            error: {
                active: false,
                msg: ''
            },
            showPass: false
        };
    },
    methods: {
        ...mapMutations(['SET_IS_LOGGED']),
        handleLogin () {
            this.btn.label = 'ENTRANDO...';
            this.btn.loading = true;

            const f = new FormData();
            f.append('login', this.form.user);
            f.append('senha', this.form.pass);

            api.post('/api/auth/login', f)
                .then((r) => {
                    this.btn.label = 'ENTRAR';
                    this.btn.loading = false;
                    sessionStorage.TOKEN = r.data.token;
                    sessionStorage.USER = JSON.stringify(r.data.usuario);
                    api.defaults.headers['Authorization'] = 'Bearer ' + sessionStorage.TOKEN;

                    this.SET_IS_LOGGED(true);
                    this.$router.push('/');
                })
                .catch((r) => {
                    let data = r.response.data;
                    this.btn.label = 'ENTRAR';
                    this.btn.loading = false;

                    this.error.active = true;
                    switch (data.message) {
                        case 'Bad credentials': {
                            this.error.msg = 'Usuário ou Senha Inválidos';
                            break;
                        }
                        case 'User account is locked': {
                            this.error.msg = 'Conta Inativa';
                            break;
                        }
                    }
                });
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
      outline: none;
   }

   form input#password {
      margin-bottom: 0;
   }

   .pass-options {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
   }

   .show-pass {
      flex: 1;
      display: flex;
      align-items: center;
      flex-basis: 150px;
   }

   .show-pass input[type='checkbox'] {
      margin: 0;
      padding: 0;
   }

   .show-pass label {
      margin: 0 15px 0 0;
      font-weight: 600;
   }

   form button {
      border: none;
      height: 45px;
      border-radius: 20px;
      background: linear-gradient(300deg, #009688 0%, #1ebea5 50%);
      transition: opacity 0.3s;
      color: aliceblue;
      margin-top: 15px;
   }

   form button:hover {
      opacity: 0.7;
   }

   .error {
      text-align: center;
      color: red;
   }

   .box-new-account {
      padding: 0 50px;
      display: flex;
      flex-direction: column;
      align-items: center
   }

   hr {
      width: 80%;
      text-align: center;
   }

   .site-link {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 15px;
}
</style>
