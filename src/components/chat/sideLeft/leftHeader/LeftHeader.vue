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

      <div class="box-icons">
         <img src="@/assets/images/wpp-icon-status.svg"/>
         <img src="@/assets/images/wpp-icon-message.svg" @click="handleClick"/>

         <b-dropdown variant="link" toggle-class="text-decoration-none p-0" no-caret>
            <template v-slot:button-content>
               <img src="@/assets/images/wpp-icon-kebab-menu.svg"/>
            </template>
            <b-dropdown-item to="/changenumber">Alterar Número</b-dropdown-item>
            <b-dropdown-item to="/changepassword">Alterar Senha</b-dropdown-item>
            <b-dropdown-item v-if="canCreateOperator" to="/newoperator">Novo Operador</b-dropdown-item>
             <b-dropdown-form v-if="canCreateOperator" class="text-nowrap">
                 <b-form-checkbox v-model="user.configuracao.enviarNomeOperadores" name="check-button" switch>
                     Enviar Nome Operadores
                 </b-form-checkbox>
             </b-dropdown-form>
            <b-dropdown-item class="d-none" to="/changenumber">Alterar Numero</b-dropdown-item>
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
        }
    },
    computed: {
        ...mapState(['self', 'user']),

        canCreateOperator () {
            return this.user.permissao && this.user.permissao.permissao !== 'ROLE_OPERATOR';
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
</style>
