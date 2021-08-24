import {createApp} from 'vue'
import App from "@/App.vue";
import router from './router';
import store from './store';
// @ts-ignore
import VueVirtualScroller from 'vue-virtual-scroller'
import VueSweetalert2 from 'vue-sweetalert2';
// @ts-ignore
// @ts-ignore
import BootstrapVue from 'bootstrap-vue-3';
import ObserveVisibility from './observe-visibility'
import VueSmoothScroll from 'vue3-smooth-scroll'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'vue-virtual-scroller/dist/vue-virtual-scroller.css'
import 'sweetalert2/dist/sweetalert2.min.css';
import 'emoji-mart-vue-fast/css/emoji-mart.css';

const app = createApp(App);

app.use(store);
app.use(router);
app.use(VueVirtualScroller)
app.use(VueSweetalert2);
app.use(BootstrapVue);
app.use(ObserveVisibility);
app.use(VueSmoothScroll);
app.provide('appInstance', app);

app.mount('#app')
