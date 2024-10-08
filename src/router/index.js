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

const positionMap = {};

const router = new VueRouter({
    mode: "hash",
    routes,
    linkActiveClass: "active",
    scrollBehavior(to) {
        return { y: positionMap[to.fullPath] || 0 };
    }
})

router.afterEach((to, from) => {
    positionMap[from.fullPath] = document.documentElement.scrollTop || document.body.scrollTop;
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