import api from "@/src/api";
import i18n from "@/src/i18n";

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

const auth = {
    namespaced: true,

    state: {
        user: null
    },

    mutations: {
        setUser(state, user) {
            state.user = user;
        }
    },

    getters: {
        authState(state) {
            return !!state.user;
        }
    },

    actions: {
        async init({ commit }) {
            const { ok, id, name, admin } = await api('/auth');
            if(!ok) {
                commit('setUser', null);
                return;
            }

            commit('setUser', { id, name, admin });
        },

        async finalizeAuth({ dispatch }, { code, state }) {
            const { ok, token } = await api('/auth/finalize', 'post', { code, state });
            if(ok) {
                localStorage.setItem('SparcsAuthorization', token);
            }

            await dispatch('init');
        },

        async logout({ dispatch }) {
            localStorage.removeItem('SparcsAuthorization');

            await dispatch('init');
        }
    }
};

const toast = {
    namespaced: true,

    state: {
        toasts: []
    },

    mutations: {
        pushToast(state, toast) {
            state.toasts.push(toast);
        },

        removeToast(state, id) {
            const index = state.toasts.findIndex(toast => toast.id === id);
            if(index >= 0)
                state.toasts.splice(index, 1);
        }
    },

    actions: {
        addToast({ commit }, toast) {
            const id = Math.random().toString(36).slice(2);
            toast.id = id;

            commit('pushToast', toast);

            setTimeout(() => {
                commit('removeToast', id);
            }, 3000);
        },

        addToastFromApi({ dispatch }, { result, name }) {
            const toast =
                result.ok ?
                {
                    text: i18n.t('success', { name }),
                    class: 'Toast--success'
                } :
                {
                    text: i18n.t('fail', { name, reason: result.reason }),
                    class: 'Toast--fail'
                };

            dispatch('addToast', toast);
        }
    }
};

export default new Vuex.Store({
    modules: {
        auth, toast
    }
});
