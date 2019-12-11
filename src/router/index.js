import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/Login'
import Wpp from '@/views/Wpp'

Vue.use(VueRouter);

const routes = [
    {
        path: '/',
        name: 'wpp',
        component: Wpp,
        beforeEnter: (to, from, next) => {
            const store = require('../store/index.js');
            console.log(sessionStorage.TOKEN);

            if (sessionStorage.TOKEN) {
                next();
            } else {
                router.push('/login')
            }

        }
    },
    {
        path: '/login',
        name: 'login',
        component: Login
    }
];

const router = new VueRouter({
    //mode: 'history',
    base: process.env.BASE_URL,
    routes
});

export default router
