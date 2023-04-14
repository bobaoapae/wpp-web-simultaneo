import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '@/views/Login';
import Wpp from '@/views/Wpp';
import ForgotPassword from '@/views/ForgotPassword';
import NewOperator from '@/views/NewOperator';
import ChangePassword from '@/views/ChangePassword';
import ChangeNumber from '@/views/ChangeNumber';
import SendMessageToNumber from '@/views/SendMessageToNumber';
import ConfirmChangeNumber from '@/views/ConfirmChangeNumber';
import NotFound from '@/views/NotFound';
import store from '@/store';
import OperatorDashboard from '@/views/OperatorDashboard';

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'wpp',
        component: Wpp,
        beforeEnter: (to, from, next) => {
            if (sessionStorage.TOKEN) {
                store.dispatch('closeWs');
                store.dispatch('fetchUser').then(value => {
                    next();
                }).catch(reason => {
                    router.push('/login');
                });
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
        path: '/editoperator/:id',
        name: 'edit-operator',
        component: NewOperator
    },
    {
        path: '/changepassword',
        name: 'change-password',
        component: ChangePassword
    },
    {
        path: '/changenumber',
        name: 'change-number',
        component: ChangeNumber
    },
    {
        path: '/confirmchangenumber',
        name: 'confirm-change-number',
        component: ConfirmChangeNumber
    },
    {
        path: '/sendmessagetonumber',
        name: 'send-message-to-number',
        component: SendMessageToNumber
    },
    {
        path: '/operatordashboard',
        name: 'operator-dashboard',
        component: OperatorDashboard
    },
    {
        path: '*',
        name: 'not-found',
        component: NotFound
    }
];

const router = new VueRouter({
    mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router;
