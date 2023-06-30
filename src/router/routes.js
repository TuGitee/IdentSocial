import userRoutes from './userRoutes';
export default [
    {
        name: 'Login',
        path: '/login',
        component: () => import('@/pages/Login'),
        meta: {
            keepAlive: true,
        }
    },
    {
        name: 'SignIn',
        path: '/signin',
        component: () => import('@/pages/SignIn'),
        meta: {
            keepAlive: true,
        }
    },
    {
        name: 'SignUp',
        path: '/signup',
        component: () => import('@/pages/SignUp'),
        meta: {
            keepAlive: true,
        }
    },
    {
        path: '/user',
        children: [...userRoutes],
        component: () => import('@/EmptyLayout'),
        redirect: '/user/home',
        meta: {
            keepAlive: true,
        }
    },
    {
        path: '/upload',
        name: 'Upload',
        component: () => import('@/pages/Upload'),
        meta: {
            keepAlive: true,
        }
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
        path: '/empty',
        name: 'Empty',
        component: () => import('@/EmptyLayout'),
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