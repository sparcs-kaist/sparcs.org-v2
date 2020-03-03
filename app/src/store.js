import api from "@/src/api";

import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
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
            if(!ok)
                return;

            commit('setUser', { id, name, admin });
        },

        async finalizeAuth({ dispatch }, { code, state }) {
            const { ok, token } = await api('/auth/finalize', 'post', { code, state });
            if(ok) {
                localStorage.setItem('SparcsAuthorization', token);
            }

            await dispatch('init');
        }
    }
});
