<template>
    <transition-group class="Toasts" name="FadeMove" tag="div">
        <div class="Toast" v-for="toast in toasts" :class="toast.class" :key="toast.id">{{
            toast.text
        }}</div>
    </transition-group>
</template>

<style scoped>
    .Toasts {
        position: fixed;
        top: 100px;
        right: 50px;
        width: 200px;
    }

    .Toast {
        font-family: var(--theme-font);
        color: var(--alert-foreground-900);
        padding: 10px 20px;
        border-radius: 5px;
        white-space: pre-line;
        margin-top: 10px;
        width: 100%;

        &--success {
            background: var(--alert-success);
        }

        &--fail {
            background: var(--alert-level-2);
        }
    }
</style>

<script>
    export default {
        computed: {
            toasts() {
                return this.$store.state.toast.toasts;
            }
        }
    };
</script>
