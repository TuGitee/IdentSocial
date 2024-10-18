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
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/upload',
        name: 'Upload',
        component: () => import('@/pages/Upload'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/blog-detail/:bid',
        name: 'BlogDetail',
        component: () => import('@/pages/BlogDetail'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/user-detail/:uid',
        name: 'UserDetail',
        component: () => import('@/pages/UserDetail'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/chat-detail/:id?',
        name: 'ChatDetail',
        component: () => import('@/pages/ChatDetail'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/follow/:uid',
        name: 'Follow',
        component: () => import('@/pages/Follow'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/follower/:uid',
        name: 'Follower',
        component: () => import('@/pages/Follow'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '/setting',
        name: 'Setting',
        component: () => import('@/pages/Setting'),
        meta: {
            requireAuth: true
        }
    },
    {
        path: '*',
        component: () => import('@/pages/Error')
    }
]