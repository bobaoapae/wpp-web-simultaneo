// eslint-disable-next-line no-unused-vars
import hackTime from 'hacktimer';
import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-vue/dist/bootstrap-vue.min.css';
import 'emoji-mart-vue-fast/css/emoji-mart.css';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css';
import 'vue-tel-input/dist/vue-tel-input.css';
import AsyncComputed from 'vue-async-computed';
import VueScrollTo from 'vue-scrollto';
import VueTelInput from 'vue-tel-input';
import { msg } from '@/helper.js';
import vueDebounce from 'vue-debounce';
import VueVirtualScroller from 'vue-virtual-scroller';
import VueSweetalert2 from 'vue-sweetalert2';
import 'sweetalert2/dist/sweetalert2.min.css';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(IconsPlugin);
Vue.use(AsyncComputed);
Vue.use(VueScrollTo);
Vue.use(VueTelInput);
Vue.use(vueDebounce);
Vue.use(VueVirtualScroller);
Vue.use(VueSweetalert2);

Vue.filter('uppercase', function (value) {
    if (!value) return '';
    return value.toUpperCase();
});

Vue.filter('capitalize', function (value) {
    if (!value) return '';
    let re = /(^|[.!?]\s+)([a-z])/g;
    return value.replace(re, (m, $1, $2) => $1 + $2.toUpperCase());
});

Vue.filter('emojify', function (value) {
    if (!value) return '';
    return msg.processNativeEmojiToImage(value);
});

Vue.filter('formatMsg', function (value) {
    if (!value) return '';
    return msg.formatMsg(value);
});

new Vue({
    router,
    store,
    render: h => h(App)
}).$mount('#app');
