<template>
    <div class="bg">
        <div class="content">
            <div class="content-header">
                <ReturnButton />
            </div>
            <div>
                <div>
                    <div id="table-header">
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
                        <div v-if="isDesk">
                            <router-link class="edit-btn" :to="'/editoperator/' + operator.uuid" tag="button">
                                <img
                                    src="@/assets/images/wpp-new-chat.png"
                                    alt="edit"
                                    class="default-icons"
                                />
                            </router-link>
                            <button class="delete-btn" @click="swalDeleteUser(operator.uuid)">
                                <img
                                        src="@/assets/images/delete.svg"
                                        alt="delete"
                                        class="default-icons"
                                />
                            </button>
                        </div>
                            <div v-else class="default-button">
                            <b-dropdown no-caret toggle-class="text-decoration-none p-0" variant="link">
                                <template v-slot:button-content>
                                    <img class="default-icons" src="@/assets/images/wpp-icon-kebab-menu.svg"/>
                                </template>
                                <b-dropdown-item :to="'/editoperator/' + operator.uuid">
                                    Editar
                                </b-dropdown-item>
                                <b-dropdown-item @click="swalDeleteUser(operator.uuid)">
                                    Excluir
                                </b-dropdown-item>
                            </b-dropdown>
                        </div>
                    </div>
                </div>
                <div class="table-footer">
                    <button class="list-btn" @click="previousPage">
                        <img
                                src="@/assets/images/left.png"
                                alt="<"
                                class="default-icons"
                        />
                    </button>
                    <p>{{ indexPage + 1 }}/{{ totalPage }}</p>
                    <button class="list-btn" @click="nextPage">
                        <img
                                src="@/assets/images/right.png"
                                alt=">"
                                class="default-icons"
                        />
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';
import ReturnButton from '@/components/ui/ReturnButton.vue';

export default {
    name: 'OperatorDashboard',
    components: {
        ReturnButton
    },
    data () {
        return {
            operators: [],
            indexPage: 0,
            screenWidth: 0,
            operatorsPerPage: 8
        };
    },

    beforeUnmount () {
        window.removeEventListener('resize', this.handleResize);
    },

    mounted () {
        this.getOperators();
        this.screenWidth = window.innerWidth;
        window.addEventListener('resize', this.handleResize);
    },

    computed: {
        operatorsPaginated () {
            return this.operators.slice(this.operatorsPerPage * this.indexPage, this.operatorsPerPage * (this.indexPage + 1));
        },
        totalPage () {
            return Math.ceil(this.operators.length / this.operatorsPerPage);
        },
        isDesk () {
            return this.screenWidth > 500;
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
        },

        handleResize () {
            this.screenWidth = window.innerWidth;
        }
    }
};
</script>
