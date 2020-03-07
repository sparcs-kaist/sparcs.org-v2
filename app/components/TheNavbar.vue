<template>
    <header class="AppNavbar" :class="{ 'AppNavbar--background': background }">
        <div class="AppNavbar__border"></div>
        <div class="AppNavbar__content">
            <router-link to="/" class="AppNavbar__branding" exact-active-class="AppNavbar__branding--active">
                <SparcsLogo class="AppNavbar__logo" />
            </router-link>

            <nav class="AppNavbar__items">
                <div class="AppNavbar__segment AppNavbar__bottom">
                    <router-link to="/seminars" class="AppNavbar__item"
                        exact-active-class="AppNavbar__item--active">

                        <NavigationSeminar class="AppNavbar__icon" />
                        {{ $t('seminars') }}
                    </router-link>

                    <router-link to="/" class="AppNavbar__item AppNavbar__mobile"
                        exact-active-class="AppNavbar__item--active">

                        <NavigationHome class="AppNavbar__icon" />
                        {{ $t('home') }}
                    </router-link>

                    <router-link to="/members" class="AppNavbar__item"
                        exact-active-class="AppNavbar__item--active">

                        <NavigationMember class="AppNavbar__icon" />
                        {{ $t('members') }}
                    </router-link>
                </div>

                <div class="AppNavbar__segment AppNavbar__top">
                    <button class="AppNavbar__item" @click="login" v-if="!name">
                        {{ $t('login') }}
                    </button>
                    <button class="AppNavbar__item" @click="logout" v-else>
                        {{ name }}
                    </button>
                </div>
            </nav>
        </div>
    </header>
</template>

<i18n>
    ko:
        login: '로그인'
        members: '회원'
        seminars: '세미나'
        menu: '메뉴'
        home: '메인'
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
            transition: opacity .4s ease;
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

        &__items, &__segment {
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

            cursor: pointer;
            background: transparent;
            border: none;
            outline: none;
            color: var(--grey-200);
            font-family: var(--theme-font);
            font-size: 1.1rem;
            font-weight: 700;
            text-decoration: none;
            transition: background .4s ease, color .4s ease;;

            &:hover {
                background: rgba(var(--grey-800_w), .75);
            }

            &--active {
                color: var(--theme-400);
            }

            &--active .AppNavbar__icon {
                stroke: var(--theme-400);
            }
        }

        &__logo {
            width: 154px;
            height: 40px;
            transition: opacity .4s ease;
        }

        &__top {
            transition: opacity .4s ease;
        }

        &__mobile {
            display: none;
        }

        &__icon {
            display: none;
            width: 25px;
            height: 25px;
            stroke: var(--grey-200);
            stroke-width: 24px;
            transition: stroke .4s ease;
        }
    }

    @media (max-width: 600px) {
        .AppNavbar {
            &--background {
                &::before {
                    opacity: 0;
                }
            }

            &--background & {
                &__top, &__border, &__logo {
                    opacity: 0;
                    pointer-events: none;
                }
            }

            &__content {
                padding: 0 15px;
            }

            &__logo {
                width: 180px;
                height: 35px;
            }

            &__mobile {
                display: flex;
            }

            &__bottom {
                position: fixed;
                display: flex;
                justify-content: center;
                width: 100%;
                height: 60px;
                background: var(--grey-900);
                bottom: 0;
                left: 0;
            }

            &__item {
                font-weight: 300;
                font-size: 1rem;
                flex-direction: column;
                flex: 1;
            }

            &__icon {
                display: block;
            }
        }
    }
</style>

<script>
    import api from "@/src/api";

    import NavigationHome from "@/images/NavigationHome?inline";
    import NavigationMember from "@/images/NavigationMember?inline";
    import NavigationSeminar from "@/images/NavigationSeminar?inline";
    import SparcsLogo from "@/images/SparcsLogo?inline";

    export default {
        computed: {
            name() {
                if(!this.$store.state.auth.user)
                    return null;

                return this.$store.state.auth.user.name;
            }
        },

        props: {
            background: Boolean
        },

        methods: {
            async login() {
                const { url } = await api('/auth', 'post');
                location.href = url;
            },

            async logout() {
                await this.$store.dispatch('auth/logout');
            }
        },

        components: {
            NavigationHome,
            NavigationMember,
            NavigationSeminar,
            SparcsLogo
        }
    };
</script>
