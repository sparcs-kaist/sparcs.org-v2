import App from "@/App";
import Vue from "vue";

import i18n from "@/src/i18n";
import router from "@/src/router";

new Vue({
    el: '#App',
    i18n,
    router,
    render(h) {
        return h(App);
    }
});
