import App from "@/App";
import Vue from "vue";

import i18n from "@/src/i18n";
import store from "@/src/store";
import router from "@/src/router";

(async () => {
    await store.dispatch('auth/init');

    new Vue({
        el: '#App',
        i18n,
        store,
        router,
        render(h) {
            return h(App);
        }
    });
})();
