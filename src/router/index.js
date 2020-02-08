import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/views/Login';
import Wpp from '@/views/Wpp';
import ForgotPassword from '@/views/ForgotPassword';
import NewOperator from '@/views/NewOperator';
import ChangePassword from '@/views/ChangePassword';
import store from '@/store';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'wpp',
        component: Wpp,
        beforeEnter: (to, from, next) => {
            if (sessionStorage.TOKEN) {
                store.dispatch('closeWs');
                next();
            } else {
                router.push('/login');
            }
        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    },
    {
        path: '/forgotpassword',
        name: 'forgot-password',
        component: ForgotPassword
    },
    {
        path: '/newoperator',
        name: 'new-operator',
        component: NewOperator
    },
    {
        path: '/changepassword',
        name: 'change-password',
        component: ChangePassword
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
