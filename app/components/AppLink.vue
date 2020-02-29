<template>
    <a class="AppLink" :href="to" rel="noopener" target="_blank" v-if="external">
        <slot></slot>
        <IconArrow class="AppLink__icon" />
    </a>

    <router-link class="AppLink" :to="to" v-else>
        <slot></slot>
        <IconArrow class="AppLink__icon" />
    </router-link>
</template>

<style scoped>
    .AppLink {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 10px 15px;
        margin: 5px 5px;

        color: var(--grey-200);
        font-family: var(--title-font);
        font-size: 1.05rem;
        text-decoration: none;

        border-radius: 5px;
        cursor: pointer;
        background: var(--grey-780);
        transition: background .4s ease;

        &:first-child {
            margin-left: 0;
        }

        &:last-child {
            margin-right: 0;
        }

        &:hover {
            background: var(--grey-800);
        }

        & > svg {
            margin: 0 5px;
            fill: var(--grey-200);
            stroke: var(--grey-200);
            height: 1.1rem;
        }

        & &__icon {
            height: .8rem;
            margin-left: 10px;
            transform: rotate(180deg);
            transition: transform .4s ease;
        }

        &:hover &__icon {
            transform: translateX(5px) rotate(180deg);
        }
    }
</style>

<script>
    import IconArrow from "@/images/IconArrow?inline";

    export default {
        props: {
            to: {
                type: String,
                required: true
            }
        },

        computed: {
            external() {
                return /^[a-z]+:/.test(this.to);
            }
        },

        components: {
            IconArrow
        }
    };
</script>
