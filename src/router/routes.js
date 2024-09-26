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
        component: () => import('@/pages/EmptyLayout'),
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
        path: '/chat-detail/:cid',
        name: 'ChatDetail',
        component: () => import('@/pages/ChatDetail'),
    },
    {
        path: '/world-detail',
        name: 'WorldDetail',
        component: () => import('@/pages/WorldDetail'),
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/pages/Setting'),
    },
    {
        path: '/',
        redirect: '/login',
    },
    {
        path: '*',
        component: () => import('@/pages/Error')
    }
]