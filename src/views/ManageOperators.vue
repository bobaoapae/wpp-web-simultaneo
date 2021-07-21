<template>
    <div class="bg">
        <div class="container">
            <div class="content">
                <div class="content-header">Gerenciar Operadores</div>

                <LoadingSpinner v-if="isLoading"/>

                <div class="operators-list" v-else>
                    <div class="operators-row" v-for="operator in operators" :key="operator.uuid">

                        <div class="operators-content">
                            <div class="operators-detail">
                                <span>Nome: <strong>{{ operator.nome }}</strong></span>
                                <span>Login: <strong>{{ operator.login }}</strong></span>
                            </div>

                            <div class="operators-actions">
                                <template v-if="!processingUUID || processingUUID !== operator.uuid">
                                    <b-button variant="outline-primary" @click="resetPassword(operator.uuid)">Resetar Senha</b-button>
                                    <b-button variant="danger" @click="deleteOperator(operator.uuid)">Deletar</b-button>
                                </template>
                                <template v-else>
                                    <LoadingSpinner/>
                                </template>
                            </div>

                        </div>

                        <hr>
                    </div>
                </div>
                <div class="text-center">
                    <router-link class="text-center" to="/">Voltar</router-link>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from '@/api';
import LoadingSpinner from '@/components/shared/loadingSpinner/LoadingSpinner';

export default {
    name: 'ManageOperators',
    components: {
        LoadingSpinner
    },
    created () {
        this.loadOperators();
    },
    data () {
        return {
            isLoading: false,
            processingUUID: null,
            operators: null
        };
    },
    methods: {
        async loadOperators () {
            this.isLoading = true;
            let result = await api.get('/api/operators');
            this.operators = result.data;
            this.isLoading = false;
        },

        async deleteOperator (uuid) {
            this.processingUUID = uuid;
            let result = await api.delete(`/api/operators/${uuid}`);
            this.processingUUID = null;
            if (result.status === 200) {
                await this.$swal({
                    title: 'Operador Deletado',
                    text: 'O operador foi deletado',
                    icon: 'success',
                    heightAuto: false
                });
                await this.loadOperators();
            } else {
                this.$swal({ title: 'Erro', text: result.data.error, icon: 'error', heightAuto: false });
            }
        },

        async resetPassword (uuid) {
            this.processingUUID = uuid;
            let result = await api.put(`/api/operators/resetPassword/${uuid}`);
            this.processingUUID = null;
            if (result.status === 200) {
                await this.$swal({
                    title: 'Senha Resetada',
                    html: `A nova senha do operador é <strong>${result.data}</strong>`,
                    icon: 'success',
                    heightAuto: false
                });
                await this.loadOperators();
            } else {
                this.$swal({ title: 'Erro', text: result.data.error, icon: 'error', heightAuto: false });
            }
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
    max-width: 100%;
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
    text-align: center;
    font-weight: bold;
    font-size: 30px;
}

hr {
    width: 100%;
    text-align: center;
    margin: 0;
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

.error {
    color: red;
    margin-bottom: 15px;
    text-align: center;
}

.operators-list {
    display: flex;
    flex-direction: column;
}

.operators-row {
    display: flex;
    flex-direction: column;
    margin-top: 0.3em;
    margin-left: 0.8em;
    margin-right: 0.8em;
}

.operators-content {
    display: flex;
    flex-direction: row;
    margin-bottom: 0.3em;
}

.operators-detail {
    display: flex;
    flex-direction: column;
    flex: 7;
}

.operators-actions {
    display: flex;
    flex: 1;
}

.operators-actions button {
    margin-left: 0.3em;
}
</style>
