import i18nKo from "@/i18n/ko.json";

import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const lang = (navigator.language ? navigator.language : 'ko').split('-').shift();

const i18n = new VueI18n({
    locale: lang,
    fallbackLocale: 'ko',
    messages: {
        ko: i18nKo
    }
});

export default i18n;
