<template>
    <header class="AppNavbar" :class="{ 'AppNavbar--background': background }">
        <div class="AppNavbar__border"></div>
        <div class="AppNavbar__content">
            <div class="AppNavbar__branding">
                <SparcsLogo class="AppNavbar__logo" />
            </div>

            <nav class="AppNavbar__items">

            </nav>
        </div>
    </header>
</template>

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
            padding: 15px 30px;
        }

        &__items {
            display: flex;
        }

        &__logo {
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
    import SparcsLogo from "@/images/SparcsLogo?inline";

    export default {
        props: {
            background: Boolean
        },

        components: {
            SparcsLogo
        }
    };
</script>
