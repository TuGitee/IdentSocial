export default [
    {
        name: 'Recommend',
        path: 'recommend',
        component: () => import('@/pages/Home/Recommend/index.vue'),
        meta: {
            footerShow: true,
            name: '推荐',
            keepAlive: true,
        },
    },
    {
        name: 'Following',
        path: 'following',
        component: () => import('@/pages/Home/Following/index.vue'),
        meta: {
            footerShow: true,
            name: '关注',
            keepAlive: true,
        },
    },
    // {
    //     name: 'Nearby',
    //     path: 'nearby',
    //     component: () => import('@/pages/Home/Nearby/index.vue'),
    //     meta: {
    //         footerShow: true,
    //         name: '喜欢',
    //     }
    // },
]