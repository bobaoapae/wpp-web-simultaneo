<template>
    <div class="bg">
        <div class="container">
            <div class="content">
                <div class="content-header"></div>

                <form @submit.prevent="handleSubmit" id="form-login" v-if="!error.active && !success">
                    <p class="title">Mudar meu número</p>

                    <vue-tel-input
                        :placeholder="'Informe um número com WhatsApp'"
                        v-model="inputTelefone"
                    @input="onInput"/>
                  <div>
                      <span id="disabled-wrapper">
                        <button class="mt-3" type="submit" :disabled="btn.loading || !dadosTelefone.isValid">
                            {{btn.label}}
                        </button>
                      </span>
                      <b-tooltip v-if="!btn.loading && !dadosTelefone.isValid" target="disabled-wrapper">Número Inválido</b-tooltip>
                  </div>
                </form>
                <div v-else-if="success">
                    <h1 class="text-success text-center">Sucesso!</h1>
                    <p class="text-center">Foi enviado um link de confirmação para o seu número atual.</p>
                    <div class="text-center">
                        <router-link class="text-center" to="/">Voltar</router-link>
                    </div>
                </div>
                <div v-else>
                    <h1 class="text-danger text-center">Ocorreu um erro</h1>
                    <p class="text-center">{{error.msg}}</p>
                    <div class="text-center">
                        <span class="btn btn-link" @click="tentarNovamente">Tentar Novamente</span>
                    </div>
                </div>

                <hr />

                <a class="site-link" href="https://www.zapia.com.br" target="_blank">Zapiá</a>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api';

export default {
    name: 'ChangePassword',
    data () {
        return {
            success: false,
            error: {
                active: false,
                msg: 'Falha na conexão'
            },
            btn: {
                label: 'ALTERAR',
                loading: false
            },
            inputTelefone: '',
            dadosTelefone: {
                isValid: false
            }
        };
    },
    methods: {
        handleSubmit () {
            const f = new FormData();
            f.append('telefone', this.dadosTelefone.number.e164);
            this.btn.loading = true;
            this.btn.label = 'PROCESSANDO';
            api.put('/api/users/alterarNumero', f)
                .then(() => {
                    this.success = true;
                })
                .catch(reason => {
                    this.error.active = true;
                    if (reason.response && reason.response.data) {
                        this.error.msg = reason.response.data;
                    }
                });
        },

        onInput (number, data) {
            Object.assign(this.dadosTelefone, data);
        },

        tentarNovamente () {
            this.error.active = false;
            this.btn.loading = false;
            this.btn.label = 'ALTERAR';
            this.inputTelefone = '';
            this.dadosTelefone = {
                isValid: false
            };
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
    width: 100%;
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
