import { createRouter, createWebHistory } from 'vue-router';
import store from '@/store';

const NotFound = () => import('@/views/NotFound.vue');
const Login = () => import('@/views/Login.vue');
const Wpp = () => import('@/views/Wpp.vue');
const ForgotPassword = () => import('@/views/ForgotPassword.vue');
const NewOperator = () => import('@/views/NewOperator.vue');
const ManageOperators = () => import('@/views/ManageOperators.vue');
const ChangePassword = () => import('@/views/ChangePassword.vue');
const ChangeNumber = () => import('@/views/ChangeNumber.vue');
const SendMessageToNumber = () => import('@/views/SendMessageToNumber.vue');
const ConfirmChangeNumber = () => import('@/views/ConfirmChangeNumber.vue');

const routes = [
    {
        path: '/',
        name: 'wpp',
        component: Wpp,
        beforeEnter: async (to, from, next) => {
            if (sessionStorage.TOKEN) {
                await store.dispatch('closeWs');
                await store.dispatch('fetchUser').then(() => {
                    next();
                }).catch(reason => {
                    console.error(reason);
                    router.push('/login');
                });
            } else {
                next();
                await router.push('/login');
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
        path: '/manageoperators',
        name: 'manage-operators',
        component: ManageOperators
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
        path: '/:catchAll(.*)',
        name: 'not-found',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router;
