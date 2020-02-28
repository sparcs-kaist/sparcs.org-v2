<template>
    <div class="App">
        <AppNavbar :background="scroll > innerHeight * .5" />

        <transition name="fade">
            <router-view />
        </transition>
    </div>
</template>

<style scoped>
    .fade-enter-active, .fade-leave-active {
        transition: opacity .4s ease;
    }

    .fade-enter, .fade-leave-to {
        opacity: 0;
    }
</style>

<style>
    body, html {
        background: var(--grey-850);
        margin: 0;
        padding: 0;
    }

    :root {
        --title-font: 'Raleway', 'NanumBarunRoboto', sans-serif;
        --theme-font: 'NanumBarunRoboto', sans-serif;

        --theme-400_w: 236, 143, 038;
        --theme-500_w: 235, 160, 042;

        --theme-400: rgb(var(--theme-400_w)); /* #ec8f26 */
        --theme-500: rgb(var(--theme-500_w)); /* #eba02a */

        --grey-900_w: 255, 255, 255;
        --grey-850_w: 250, 250, 250;
        --grey-800_w: 241, 241, 241;
        --grey-780_w: 234, 234, 234;
        --grey-750_w: 225, 225, 225;
        --grey-650_w: 161, 161, 161;
        --grey-200_w: 034, 034, 034;
        --grey-100_w: 016, 016, 016;

        --grey-900: rgb(var(--grey-900_w)); /* #ffffff */
        --grey-850: rgb(var(--grey-850_w)); /* #fafafa */
        --grey-800: rgb(var(--grey-800_w)); /* #f1f1f1 */
        --grey-780: rgb(var(--grey-780_w)); /* #eaeaea */
        --grey-750: rgb(var(--grey-750_w)); /* #e1e1e1 */
        --grey-650: rgb(var(--grey-650_w)); /* #a1a1a1 */
        --grey-200: rgb(var(--grey-200_w)); /* #222222 */
        --grey-100: rgb(var(--grey-100_w)); /* #101010 */
    }
</style>

<script>
    import AppNavbar from "@/components/AppNavbar";

    export default {
        data() {
            return {
                innerHeight: window.innerHeight,
                scroll: window.scrollY
            };
        },

        components: {
            AppNavbar
        },

        mounted() {
            this.resizeListener = () => { this.innerHeight = window.innerHeight; };
            this.scrollListener = () => { this.scroll = window.scrollY; };

            window.addEventListener('resize', this.resizeListener);
            window.addEventListener('scroll', this.scrollListener);
        },

        destroyed() {
            if(this.resizeListener) {
                window.removeEventListener('resize', this.resizeListener);
                this.resizeListener = null;
            }

            if(this.scrollListener) {
                window.removeEventListener('scroll', this.scrollListener);
                this.scrollListener = null;
            }
        }
    };
</script>
