import userRoutes from './userRoutes';
export default [
    {
        name: 'Login',
        path: '/login',
        component: () => import('@/pages/Login/index.vue'),
    },
    {
        name: 'SignIn',
        path: '/signin',
        component: () => import('@/pages/SignIn/index.vue'),
    },
    {
        name: 'SignUp',
        path: '/signup',
        component: () => import('@/pages/SignUp/index.vue'),
    },
    {
        path: '/user',
        children: [...userRoutes],
        component: () => import('@/EmptyLayout'),
        redirect: '/user/home',
    },
    {
        path: '/',
        component: () => import('@/pages/Error'),
        redirect: '/login',
    },
    {
        path: '*',
        component: () => import('@/pages/Error')
    }
]