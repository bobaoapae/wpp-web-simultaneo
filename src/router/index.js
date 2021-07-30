import { createRouter, createWebHistory } from 'vue-router';
import NotFound from '@/views/NotFound';
import Login from '@/views/Login';
import Wpp from '@/views/Wpp';
/*import ForgotPassword from '@/views/ForgotPassword';
import NewOperator from '@/views/NewOperator';
import ManageOperators from '@/views/ManageOperators';
import ChangePassword from '@/views/ChangePassword';
import ChangeNumber from '@/views/ChangeNumber';
import SendMessageToNumber from '@/views/SendMessageToNumber';
import ConfirmChangeNumber from '@/views/ConfirmChangeNumber';*/
import store from '@/store';

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
        path: '/notFound',
        name: 'not-found',
        component: NotFound
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes: routes
});

export default router;
