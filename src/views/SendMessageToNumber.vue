<template>
    <div class="bg">
        <div class="container">
            <div class="content">
                <div class="content-header"></div>

                <form @submit.prevent="handleSubmit" id="form-login" v-if="!error.active && !success">
                    <p class="title">Informe o número do contato</p>

                    <vue-tel-input
                        v-model="inputNumber"
                        v-bind="bindProps"
                        @validate="onValidate"/>
                    <div>
                      <span id="disabled-wrapper">
                        <button class="mt-3" type="submit" :disabled="btn.loading || !isValidNumber">
                            {{ btn.label }}
                        </button>
                      </span>
                        <b-tooltip v-if="!btn.loading && !isValidNumber" target="disabled-wrapper">Número Inválido
                        </b-tooltip>
                        <div class="text-center">
                            <router-link class="text-center" to="/">Voltar</router-link>
                        </div>
                    </div>
                </form>
                <div v-else-if="!success">
                    <h1 class="text-danger text-center">Ocorreu um erro</h1>
                    <p class="text-center">{{ error.msg }}</p>
                    <div class="text-center">
                        <span class="btn btn-link" @click="tryAgain">Tentar Novamente</span>
                    </div>
                </div>

                <hr/>
            </div>
        </div>
    </div>
</template>

<script>

import { mapActions, mapMutations } from 'vuex';
import router from '@/router';

export default {
    name: 'SendMessageToNumber',
    data () {
        return {
            success: false,
            error: {
                active: false,
                msg: 'Falha na conexão'
            },
            btn: {
                label: 'PROCURAR CONTATO',
                loading: false
            },
            inputNumber: '',
            isValidNumber: false,
            bindProps: {
                mode: 'international',
                inputOptions: {
                    placeholder: 'Número WhatsApp'
                }
            }
        };
    },
    methods: {
        ...mapMutations(['SET_ACTIVE_CHAT']),
        ...mapActions(['findChatFromNumber']),

        onValidate (data) {
            this.isValidNumber = data.valid;
        },

        handleSubmit () {
            let numberPattern = /\d+/g;
            let number = this.inputNumber.match(numberPattern).join('');
            this.btn.loading = true;
            this.btn.label = 'PROCESSANDO';
            this.findChatFromNumber({ number }).then(chat => {
                this.SET_ACTIVE_CHAT(chat);
                router.push({ name: 'wpp' });
            }).catch(() => {
                this.error.active = true;
                this.error.msg = 'Não encontrado';
            });
        },

        tryAgain () {
            this.error.active = false;
            this.btn.loading = false;
            this.btn.label = 'PROCURAR CONTATO';
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
    background: rgba(0, 0, 0, .1);
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
