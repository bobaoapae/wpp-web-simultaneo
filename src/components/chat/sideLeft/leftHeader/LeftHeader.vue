<template>
  <header class="header">
    <div><h5>Conversas</h5></div>
    <div class="custom-space"></div>
    <div class="default-button">
        <img class="default-icons" @click="handleClick" src="@/assets/images/wpp-new-chat.png" />
    </div>
  </header>
</template>

<script>
import { mapState, mapMutations } from 'vuex';
export default {
    name: 'LeftHeader',
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
.header {
  display: flex;
  background: #eeeeee;
  padding: 11px 16px;
}

.box-icons {
  flex: 1;
  display: flex;
  justify-content: flex-end;
  align-items: center;
}

.box-icons img {
  padding: 8px;
  margin-left: 10px;
}
</style>
