<template>
    <div class="bg">
        <div class="container">
            <div class="content">
                <div class="content-header"></div>
                <form @submit.prevent="handleSubmit" id="form-login">
                    <p class="title">{{ form.title }}</p>

                    <input
                            id="name"
                            placeholder="Nome"
                            required
                            type="text"
                            v-model="form.name"
                    />

                    <input
                            id="login"
                            placeholder="Login"
                            required
                            type="text"
                            v-model="form.login"
                            :disabled="isEditing"
                            minlength="5"
                            maxlength="40"
                    />

                    <input v-if="!isEditing"
                           id="password"
                           placeholder="Senha"
                           required
                           type="password"
                           v-model="form.password"
                    />

                    <span class="error" v-if="error.active">
            {{ error.msg }}
          </span>

                    <button :disabled="btn.loading" type="submit">
                        {{ btn.label }}
                    </button>

                    <router-link class='cancel-button' to='/operatordashboard' tag="button">
                        cancelar
                    </router-link>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api';
import { mapActions } from 'vuex';

export default {
    name: 'NewOperator',
    async created () {
        console.log(this.$route.params);
        if (this.$route.params.id) {
            this.form.title = 'Editar Operador';
            this.btn.label = 'EDITAR';
            this.isEditing = true;
            let loadingSwal = this.$swal({
                title: 'Aguarde...',
                text: 'Carregando Operadores',
                didOpen: () => {
                    this.$swal.showLoading();
                },
                didClose: () => {
                    this.$swal.hideLoading();
                },
                heightAuto: false
            });
            let operator = await this.fetchOperator({ uuid: this.$route.params.id });
            this.editingOperator = operator;
            this.form.name = operator.nome;
            this.form.login = operator.login;
            loadingSwal.close();
        }
    },
    data () {
        return {
            form: {
                title: 'Novo Operador',
                name: '',
                login: '',
                password: ''
            },
            btn: {
                label: 'CRIAR',
                loading: false
            },
            error: {
                active: false,
                msg: ''
            },
            editingOperator: null,
            isEditing: false
        };
    },
    methods: {
        ...mapActions(['fetchOperator']),

        async handleSubmit () {
            if (!this.isEditing) {
                this.btn.label = 'CRIANDO...';
            } else {
                this.btn.label = 'EDITANDO...';
            }

            this.btn.loading = true;

            let loadingSwal = this.$swal({
                title: 'Aguarde...',
                text: this.isEditing ? 'Editando Operador' : 'Criando Operador',
                didOpen: () => {
                    this.$swal.showLoading();
                },
                didClose: () => {
                    this.$swal.hideLoading();
                },
                heightAuto: false
            });

            const data = {
                nome: this.form.name
            };

            if (!this.isEditing) {
                Object.assign(data, {
                    login: this.form.login,
                    senha: this.form.password
                });
            } else {
                Object.assign(data, {
                    uuid: this.editingOperator.uuid
                });
            }

            try {
                // TODO: create function on store

                if (!this.isEditing) {
                    await api.post('/api/operators', data);
                } else {
                    await api.put('/api/operators', data);
                }

                loadingSwal.close();

                if (this.isEditing) {
                    await this.swalEditUser();
                } else {
                    await this.swalCreateUser();
                }

                await this.$router.push('/operatordashboard');
            } catch (e) {
                this.btn.label = 'ENVIAR';
                this.btn.loading = false;
                this.error.active = true;
                if (e.includes('duplicate key')) {
                    this.error.msg = 'Este usuário já está em uso';
                } else {
                    this.error.msg = e;
                }
                loadingSwal.close();
            }
        },

        async swalCreateUser () {
            await this.$swal({
                title: 'Feito!',
                text: 'Operador adicionado com sucesso!!!',
                icon: 'success',
                confirmButtonColor: 'green',
                heightAuto: false
            });
        },

        async swalEditUser () {
            await this.$swal({
                title: 'Feito!',
                text: 'Operador editado com sucesso!!!',
                icon: 'success',
                heightAuto: false
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
    margin-bottom: 30px;
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
    background: rgba(0, 0, 0, 0.1);
}

.new-account-link {
    text-align: center;
}

.site-link {
    text-align: center;
    margin-top: 30px;
    margin-bottom: 15px;
}

.error {
    color: red;
    margin-bottom: 15px;
    text-align: center;
}

.cancel-button {
    margin-bottom: 30px;
    border: none;
    height: 45px;
    border-radius: 20px;
    background: gray;
    transition: opacity 0.3s;
    color: aliceblue;
}

.cancel-button:hover {
    opacity: 0.7;
}
</style>
