import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

const lang = (navigator.language ? navigator.language : 'ko').split('-').shift();

const i18n = new VueI18n({
    locale: lang,
    fallbackLocale: 'ko'
});

export default i18n;
