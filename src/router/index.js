import Vue from "vue"
import VueRouter from "vue-router"
Vue.use(VueRouter)

import routes from "./routes"

let originPush = VueRouter.prototype.push;
VueRouter.prototype.push = function (location, resolve, reject) {
    if (resolve && reject) {
        originPush.call(this, location, resolve, reject)
    } else {
        originPush.call(this, location, () => { }, () => { })
    }
}

let originReplace = VueRouter.prototype.replace;
VueRouter.prototype.replace = function (location, resolve, reject) {
    if (resolve && reject) {
        originReplace.call(this, location, resolve, reject)
    } else {
        originReplace.call(this, location, () => { }, () => { })
    }
}

let router = new VueRouter({
    mode: "hash",
    routes,
    linkActiveClass: "active",
    scrollBehavior(to, from, savedPosition) {
        const { top } = savedPosition || { top: 0 };
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ top })
            }, 0)
        });
    }
})

router.beforeEach((to, from, next) => {
    if (process.env.NODE_ENV === 'development') return next();
    if (to.matched.some(res => res.meta.requireAuth)) {
        if (localStorage.getItem("token")) {
            next();
        } else {
            next({
                path: '/signin',
                query: {
                    redirect: to.fullPath
                }
            })
        }
    } else {
        next();
    }
})

export default router;