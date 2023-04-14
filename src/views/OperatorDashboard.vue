<template>
    <div class="bg">
        <div class="content">
            <div class="content-header">
                <router-link class="return-btn" to="/" tag="button"></router-link>
            </div>
            <div id="table">
                <div>
                    <div id="table-heading">
                        <div>Operador</div>
                        <div>Login</div>
                        <router-link class="new-btn" to="/newoperator" tag="button">
                            +
                        </router-link>
                    </div>
                </div>
                <div id="table-rows">
                    <div class="table-row" v-for="operator in operatorsPaginated" :key="operator.uuid">
                        <div>{{ operator.nome }}</div>
                        <div>{{ operator.login }}</div>
                        <router-link class="edit-btn" :to="'/editoperator/' + operator.uuid" tag="button">
                            <img
                                src="@/assets/images/edit.png"
                                alt="edit"
                                class="icon-default"
                            />
                        </router-link>
                        <button class="delete-btn" @click="swalDeleteUser(operator.uuid)">
                            <img
                                    src="@/assets/images/delete.svg"
                                    alt="delete"
                                    class="icon-default"
                            />
                        </button>
                    </div>
                </div>
                <div class="controller-label">
                    <button class="list-btn" @click="previousPage">
                        <img
                                src="@/assets/images/left.png"
                                alt="<"
                                class="icon-default"
                        />
                    </button>
                    <p>{{ indexPage + 1 }}/{{ totalPage }}</p>
                    <button class="list-btn" @click="nextPage">
                        <img
                                src="@/assets/images/right.png"
                                alt=">"
                                class="icon-default"
                        />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    name: 'OperatorDashboard',
    data () {
        return {
            operators: [],
            indexPage: 0,
            operatorsPerPage: 10
        };
    },

    mounted () {
        this.getOperators();
    },

    computed: {
        operatorsPaginated () {
            return this.operators.slice(this.operatorsPerPage * this.indexPage, this.operatorsPerPage * (this.indexPage + 1));
        },
        totalPage () {
            return Math.ceil(this.operators.length / this.operatorsPerPage);
        }
    },

    methods: {
        ...mapActions(['fetchAllOperators', 'deleteOperator']),
        async getOperators () {
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

            this.operators = await this.fetchAllOperators();

            loadingSwal.close();
        },

        swalDeleteUser: async function (uuid) {
            this.$swal({
                title: 'Você está seguro disso!?',
                text: 'Ao excluir um operador, os dados serão excluídos permanentemente!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: 'green',
                cancelButtonColor: 'red',
                confirmButtonText: 'Sim, excluir!',
                cancelButtonText: 'Voltar',
                heightAuto: false
            }).then(
                async (result) => {
                    if (result.isConfirmed) {
                        this.$swal({
                            title: 'Aguarde...',
                            text: 'Excluindo Operador',
                            didOpen: () => {
                                this.$swal.showLoading();
                            },
                            heightAuto: false
                        });
                        await this.deleteOperator({ uuid });
                        await this.getOperators();
                        this.$swal({
                            title: 'Feito!',
                            text: 'Operador excluido com sucesso!',
                            icon: 'success',
                            confirmButtonColor: 'green',
                            heightAuto: false
                        });
                    }
                });
        },

        nextPage () {
            if (this.indexPage < this.totalPage - 1) {
                this.indexPage += 1;
            }
        },

        previousPage () {
            if (this.indexPage > 0) {
                this.indexPage -= 1;
            }
        }
    }
};
</script>

<style scoped>
.bg {
    width: 100%;
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

.content-header {
    height: 50px;
    width: 100%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    background: linear-gradient(300deg, #009688 0%, #1ebea5 50%);
}

.content {
    align-self: start;
    flex: 2;
    background: #fff;
    border-radius: 20px;
    z-index: 1;
    box-shadow: 0 17px 50px 0 rgba(0, 0, 0, 0.19),
    0 12px 15px 0 rgba(0, 0, 0, 0.24);
    margin: 50px 15%;
}

#table {
    padding: 20px;
}

#table-heading,
#table-rows,
.table-row,
.controller-label {
    display: flex;
    flex-wrap: wrap;
    text-align: center;
}

#table-heading {
    font-weight: bold;
    padding: 20px;
    border-bottom: 3px solid #333;
    border-top: 3px solid #333;
}

.table-row {
    width: 100%;
    padding: 12px;
    border-bottom: 1px solid #ccc;
}

#table-rows {
    border-bottom: 3px solid #333;
}

#table-heading div,
.table-row div {
    width: 19%;
    height: 20px;
}

select {
    padding: 12px 6px;
    margin-right: 12px;
}

.new-btn {
    background-color: green;
    color: black;
    border-color: grey;
    height: 40px;
    width: 40px;
    border-radius: 50px;
    margin-left: 20px;
    font-weight: bold;
    font-size: 20px;
}

.delete-btn {
    background-color: #ff2a00;
    border-color: grey;
    height: 40px;
    width: 40px;
    border-radius: 50px;
    margin-left: 10px;
}

.edit-btn {
    background-color: #ffe600;
    border-color: grey;
    height: 40px;
    width: 40px;
    border-radius: 50px;
    margin-left: 20px;
}

.return-btn {
    background-color: transparent;
    border-color: transparent;
    height: 25px;
    width: 25px;
    background-image:url("../assets/images/return_arrow.png");
    background-repeat: no-repeat;
    background-size: cover;
    margin: 12px;
}

.controller-label {
    padding-top: 15px;
    align-self: center;
    align-content: center;
    align-items: center;
    margin-left: 40%;
}

.list-btn {
    margin-top: -15px;
    margin-right: 10px;
    margin-left: 10px;
    border: transparent;
    background: transparent;
    color: blue;
}

.icon-default {
    height: 25px;
    width: 25px;
}
</style>
