import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';
import 'emoji-mart-vue-fast/css/emoji-mart.css';
import AsyncComputed from 'vue-async-computed';
import VueScrollTo from 'vue-scrollto';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(AsyncComputed);
Vue.use(VueScrollTo);

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
