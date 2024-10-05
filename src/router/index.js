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
    },
})

export default router;