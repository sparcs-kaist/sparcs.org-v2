<template>
    <header class="AppNavbar" :class="{ 'AppNavbar--background': background }">
        <div class="AppNavbar__border"></div>
        <div class="AppNavbar__content">
            <router-link to="/" class="AppNavbar__branding" exact-active-class="AppNavbar__branding--active">
                <SparcsLogo class="AppNavbar__logo" />
            </router-link>

            <nav class="AppNavbar__items">
                <template>
                    <button class="AppNavbar__item AppNavbar__item--button" @click="login" v-if="!name">
                        {{ $t('login') }}
                    </button>
                    <span class="AppNavbar__item" v-else>
                        {{ name }}
                    </span>
                </template>
            </nav>
        </div>
    </header>
</template>

<i18n>
    ko:
        login: '로그인'
</i18n>

<style scoped>
    .AppNavbar {
        position: fixed;
        top: 0;
        left: 0;
        transition: backdrop-filter .4s ease, background .4s ease;
        z-index: 9;

        &::before {
            /* To optimize performance of backdrop-filter, box-shadow animation */

            content: '';
            display: block;

            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;

            background: rgba(var(--grey-900_w), .7);
            backdrop-filter: blur(4px);
            box-shadow: var(--shadow-400);
            opacity: 0;
            z-index: -1;

            transition: opacity .4s ease;
        }

        &--background {
            &::before {
                opacity: 1;
            }
        }

        &__border {
            background: var(--theme-400);
            height: 5px;
            width: 100vw;
        }

        &__content {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0 50px;

            & > * {
                padding-top: 15px;
                padding-bottom: 15px;
            }
        }

        &__branding {
            &--active {
                cursor: default;
            }
        }

        &__items {
            display: flex;
            align-self: stretch;
            align-items: stretch;
            padding: 0;
        }

        &__item {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 20px;

            background: transparent;
            border: none;
            outline: none;
            color: var(--grey-200);
            font-family: var(--theme-font);
            font-size: 1.1rem;
            font-weight: 700;
            transition: background .4s ease;

            &--button {
                cursor: pointer;

                &:hover {
                    background: rgba(var(--grey-800_w), .75);
                }
            }
        }

        &__logo {
            width: 154px;
            height: 40px;
        }
    }

    @media (max-width: 768px) {
        .AppNavbar {
            &__content {
                padding: 15px;
            }

            &__logo {
                width: 180px;
                height: 35px;
            }
        }
    }
</style>

<script>
    import api from "@/src/api";

    import SparcsLogo from "@/images/SparcsLogo?inline";

    export default {
        computed: {
            name() {
                if(!this.$store.state.user)
                    return null;
                
                return this.$store.state.user.name;
            }
        },

        props: {
            background: Boolean
        },

        methods: {
            async login() {
                const { url } = await api('/auth', 'post');
                location.href = url;
            }
        },

        components: {
            SparcsLogo
        }
    };
</script>
