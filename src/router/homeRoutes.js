export default [
    {
        name: 'Recommend',
        path: 'recommend',
        component: () => import('@/pages/Home/Recommend/index.vue'),
        meta: {
            footerShow: true,
            name: '推荐',
        },
    },
    {
        name: 'Following',
        path: 'following',
        component: () => import('@/pages/Home/Following/index.vue'),
        meta: {
            footerShow: true,
            name: '关注',
        },
    }
]