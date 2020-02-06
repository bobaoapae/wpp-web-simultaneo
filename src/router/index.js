import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/views/Login';
import Wpp from '@/views/Wpp';
import ForgotPassword from '@/views/ForgotPassword';
import NewAccount from '@/views/NewAccount';
import ChangePassword from '@/views/ChangePassword';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'wpp',
        component: Wpp,
        beforeEnter: (to, from, next) => {
            if (sessionStorage.TOKEN) {
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
        path: '/newaccount',
        name: 'new-account',
        component: NewAccount
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
