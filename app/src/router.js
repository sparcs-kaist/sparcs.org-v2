import Admin from "@/pages/Admin.vue";
import Index from "@/pages/Index.vue";
import Members from "@/pages/Members.vue";
import NotFound from "@/pages/NotFound.vue";
import Seminars from "@/pages/Seminars.vue";

import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export default new VueRouter({
    routes: [
        { name: 'Index', path: '/', component: Index },
        { name: 'Admin', path: '/admin', component: Admin },
        { name: 'Members', path: '/members', component: Members },
        { name: 'Seminars', path: '/seminars', component: Seminars },
        { name: 'NotFound', path: '*', component: NotFound }
    ],

    mode: 'history',

    async scrollBehavior (to, from, savedPosition) {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if(to.hash) {
            return {
                selector: to.hash,
                offset: { y: 50 }
            };
        }

        if(savedPosition) {
            return savedPosition
        } else {
            return { x: 0, y: 0 }
        }
    }
});
