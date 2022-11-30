import homeRoutes from './homeRoutes';

export default [
    {
        name: 'Home',
        path: 'home',
        component: () => import('@/pages/Home/index.vue'),
        meta: {
            footerShow: true,
            icon: "el-icon-s-home",
        },
        children: [...homeRoutes],
        redirect: { 
            path: '/user/home/recommend'
        }
    },
    {
        name: 'FaceAnalysis',
        path: 'faceanalysis',
        component: () => import('@/pages/FaceAnalysis/index.vue'),
        meta: {
            footerShow: true,
            icon: "el-icon-camera-solid"
        }
    },
    {
        name: 'Chat',
        path: 'chat',
        component: () => import('@/pages/Chat/index.vue'),
        meta: {
            footerShow: true,
            icon: "el-icon-message-solid",
            isDot: true,
        },
    },
    {
        name: 'Me',
        path: 'me',
        component:() => import('@/pages/Me/index.vue'),
        meta: {
            footerShow: true,
            icon: "el-icon-user-solid",
            isDot: true,
        },
    }
]