import userRoutes from './userRoutes';
export default [
    {
        name: 'Start',
        path: '/',
        component: () => import('@/pages/StartPage'),
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
        path: '/chat-detail/:id?',
        name: 'ChatDetail',
        component: () => import('@/pages/ChatDetail'),
    },
    {
        path: '/follow/:uid',
        name: 'Follow',
        component: () => import('@/pages/Follow'),
    },
    {
        path: '/follower/:uid',
        name: 'Follower',
        component: () => import('@/pages/Follower'),
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/pages/Setting'),
    },
    {
        path: '*',
        component: () => import('@/pages/Error')
    }
]