import userRoutes from './userRoutes';
export default [
    {
        name: 'Login',
        path: '/login',
        component: () => import('@/pages/Login'),
    },
    {
        name: 'SignIn',
        path: '/signin',
        component: () => import('@/pages/SignIn'),
    },
    {
        name: 'SignUp',
        path: '/signup',
        component: () => import('@/pages/SignUp'),
    },
    {
        path: '/user',
        children: [...userRoutes],
        component: () => import('@/EmptyLayout'),
        redirect: '/user/home',
    },
    {
        path: '/upload',
        name: 'Upload',
        component: () => import('@/pages/Upload'),
    },
    {
        path: '/blog-detail/:bid',
        name: 'BlogDetail',
        component: () => import('@/pages/BlogDetail'),
    },
    {
        path: '/user-detail/:uid',
        name: 'UserDetail',
        component: () => import('@/pages/UserDetail'),
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