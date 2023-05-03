<template>
    <div class="default-button">
        <b-dropdown no-caret toggle-class="text-decoration-none p-0" variant="link">
            <template v-slot:button-content>
                <img class="default-icons" src="@/assets/images/wpp_settings.png"/>
            </template>
            <b-dropdown-item to="/sendmessagetonumber">
                Enviar Mensagem Para Número
            </b-dropdown-item>
            <b-dropdown-item to="/changenumber" v-if="user.canCreateOperator">
                Alterar Número
            </b-dropdown-item>
            <b-dropdown-item to="/changepassword">Alterar Senha</b-dropdown-item>
            <b-dropdown-item to="/operatordashboard" v-if="user.canCreateOperator">
                Gerenciar Operadores
            </b-dropdown-item>
            <b-dropdown-form class="text-nowrap" v-if="user.canCreateOperator">
                <b-form-checkbox
                        name="check-button"
                        switch
                        v-model="user.configuracao.enviarNomeOperadores"
                >
                    Enviar Nome Operadores
                </b-form-checkbox>
            </b-dropdown-form>
            <b-dropdown-form class="text-nowrap" v-if="user.canCreateOperator">
                <b-form-checkbox
                        name="check-button"
                        switch
                        v-model="user.configuracao.operadorPodeExcluirMsg"
                >
                    Operadores podem excluir mensagens?
                </b-form-checkbox>
            </b-dropdown-form>
        </b-dropdown>
    </div>
</template>
<script>
import { mapMutations, mapState } from 'vuex';
import api from '@/api';

export default {
    name: 'ButtonSettings',
    watch: {
        'user.configuracao.enviarNomeOperadores': function () {
            api.post('/api/users/config/toggleEnvioNomeOperador').then((e) => {
                this.SET_CURRENT_USER(e.data);
            });
        },
        'user.configuracao.operadorPodeExcluirMsg': function () {
            api.post('/api/users/config/toggleOperadorPodeExcluirMsg').then((e) => {
                this.SET_CURRENT_USER(e.data);
            });
        }
    },
    computed: {
        ...mapState(['self', 'user'])
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
.dropdown-button {
    margin: 5px;
    height: 25px;
    width: 25px;
}
</style>
