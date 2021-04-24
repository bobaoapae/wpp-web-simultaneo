<template>
    <header class="header">
        <div class="box-photo-profile">
            <img
                :src="self.picture"
                alt="User profile photo"
                class="photo-profile"
                v-if="self.picture"
            />

            <img
                alt="User profile photo"
                class="photo-profile"
                src="@/assets/images/wpp-photo-user.svg"
                v-else
            >
        </div>

        <div class="box-nome">
            <span class="nome-usuario-principal"><strong>{{nomeUsuario}}</strong></span>
        </div>

        <div class="box-icons">
            <img src="@/assets/images/wpp-icon-status.svg"/>
            <img @click="handleClick" src="@/assets/images/wpp-icon-message.svg"/>

            <b-dropdown no-caret toggle-class="text-decoration-none p-0" variant="link">
                <template v-slot:button-content>
                    <img src="@/assets/images/wpp-icon-kebab-menu.svg"/>
                </template>
                <b-dropdown-item to="/sendmessagetonumber">Enviar Mensagem Para Número</b-dropdown-item>
                <b-dropdown-item to="/changenumber">Alterar Número</b-dropdown-item>
                <b-dropdown-item to="/changepassword">Alterar Senha</b-dropdown-item>
                <b-dropdown-item to="/newoperator" v-if="user.canCreateOperator">Novo Operador</b-dropdown-item>
                <b-dropdown-form class="text-nowrap" v-if="user.canCreateOperator">
                    <b-form-checkbox name="check-button" switch v-model="user.configuracao.enviarNomeOperadores">
                        Enviar Nome Operadores
                    </b-form-checkbox>
                </b-dropdown-form>
                <b-dropdown-form class="text-nowrap" v-if="user.canCreateOperator">
                    <b-form-checkbox name="check-button" switch v-model="user.configuracao.operadorPodeExcluirMsg">
                        Operadores podem excluir mensagens?
                    </b-form-checkbox>
                </b-dropdown-form>
            </b-dropdown>
        </div>
    </header>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
import api from '@/api';

export default {
    name: 'LeftHeader',
    watch: {
        'user.configuracao.enviarNomeOperadores': function () {
            api.post('/api/users/config/toggleEnvioNomeOperador').then(e => {
                this.SET_CURRENT_USER(e.data);
            });
        },
        'user.configuracao.operadorPodeExcluirMsg': function () {
            api.post('/api/users/config/toggleOperadorPodeExcluirMsg').then(e => {
                this.SET_CURRENT_USER(e.data);
            });
        }
    },
    computed: {
        ...mapState(['self', 'user']),

        nomeUsuario () {
            if (this.user.permissao.permissao !== 'ROLE_OPERATOR') {
                return this.user.nome;
            }
            return this.user.usuarioPai.nome;
        }
    },
    methods: {
        ...mapMutations(['SET_CURRENT_USER']),

        handleClick () {
            this.$root.$emit('showNewChat', true);
        }
    }
};
</script>

<style scoped>
.header {
    display: flex;
    background: #EEEEEE;
    padding: 11px 16px;
}

.box-icons {
    flex: 1;
    display: flex;
    justify-content: flex-end;
    align-items: center;
}

.box-icons img {
    cursor: pointer;
    padding: 8px;
    margin-left: 10px;
}

.photo-profile {
    cursor: pointer;
    height: 40px;
    width: 40px;
    border-radius: 50%;
    object-fit: cover;
}

.box-nome {
    margin: auto;
}

.nome-usuario-principal {
    margin-left: 10px;
    font-size: 13px;
}
</style>
