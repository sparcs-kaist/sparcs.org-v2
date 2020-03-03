<template>
    <span class="AppLink AppLink--disabled" v-if="disabled">
        <slot></slot>
    </span>

    <button class="AppLink" :type="submit ? 'submit' : 'button'" @click="handleClick" v-else-if="button">
        <slot></slot>
        <IconArrow class="AppLink__icon" />
    </button>

    <a class="AppLink" :href="to" rel="noopener" target="_blank" v-else-if="external">
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

        border: none;
        outline: none;
        color: var(--grey-200);
        font-family: var(--title-font);
        font-size: 1.05rem;
        text-decoration: none;

        border-radius: 5px;
        cursor: pointer;
        background: var(--grey-780);
        transition: background .4s ease;

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

        &&--disabled {
            cursor: not-allowed;
            box-shadow: none;
            background: var(--grey-750);
            color: var(--grey-650);

            &:hover {
                background: var(--grey-750);
                color: var(--grey-650);
            }
        }
    }
</style>

<script>
    import IconArrow from "@/images/IconArrow?inline";

    export default {
        props: {
            to: {
                type: String
            },

            disabled: {
                type: Boolean
            },

            button: {
                type: Boolean
            },

            submit: {
                type: Boolean
            }
        },

        computed: {
            external() {
                return /^[a-z]+:/.test(this.to);
            }
        },

        methods: {
            handleClick(event) {
                if(!this.submit)
                    event.preventDefault();

                this.$emit('click', event);
            }
        },

        components: {
            IconArrow
        }
    };
</script>
