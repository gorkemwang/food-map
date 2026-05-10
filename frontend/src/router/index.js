import { createRouter, createWebHistory } from 'vue-router';
import WorkspaceList from '@/views/WorkspaceList.vue';
import restaurantList from '@/views/RestaurantList.vue';
import DBList from '@/views/DBList.vue';
import IndexPage from '@/views/IndexPage.vue';
import UserLogin from '@/views/UserLogin.vue';

const routes = [
    {
        path: '/',
        component: IndexPage,
        meta: {
            requiresAuth: true
        },
        children: [
            {
                path: '/',
                redirect: '/restaurantList'
            },
             {
                path: '/restaurantList',
                name: 'restaurantList',
                component: restaurantList,
                meta: {
                    requiresAuth: false
                }

            },
            {
                path: '/siteList',
                 redirect: '/workspaceList'
            },
            {
                path: '/workspaceList',
                name: 'WorkspaceList',
                component: WorkspaceList,
                meta: {
                    requiresAuth: false
                }

            },
            {
                path: '/dbSetting',
                name: 'DBList',
                component: DBList,
                meta: {
                    requiresAuth: false,
                    role: 'ROLE_ADMIN'
                }
            }
        ],
    },
    {
        path: '/login',
        name: 'UserLogin',
        component: UserLogin
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');
    if (to.meta.requiresAuth && !token) {
        next('/login');
    } else {
        next();
    }
});

export default router;