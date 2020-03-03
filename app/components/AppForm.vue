<template>
    <form class="AppForm" @submit.prevent="submit">
        <slot></slot>

        <app-link class="AppForm__submit" button submit>
            {{ $t('submit') }}
        </app-link>
    </form>
</template>

<i18n>
    ko:
        submit: '제출'
</i18n>

<style scoped>
    .AppForm {
        & >>> textarea, select {
            background: var(--grey-800);
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            color: var(--grey-200);
            font-family: var(--theme-font);
            font-size: .9rem;
            outline: none;
        }

        & >>> textarea {
            flex: 1;
        }

        & >>> label {
            margin-right: 10px;
        }

        &__submit {
            margin: 0;
            margin-top: 20px;
        }
    }
</style>

<script>
    import api from "@/src/api";

    import AppLink from "@/components/AppLink";

    export default {
        props: {
            action: {
                type: String,
                required: true
            },

            method: {
                type: String,
                default: 'post'
            }
        },

        methods: {
            async submit() {
                const elem = this.$el;
                const body = {};

                [...elem.querySelectorAll('input[type="text"], input[type="password"], select, textarea')]
                    .forEach(input => body[input.name] = input.value);

                [...elem.querySelectorAll('input[type="checkbox"]')]
                    .forEach(input => body[input.name] = input.checked);

                const result = await api(this.action, this.method, body);
                this.$emit('submit', result);
            }
        },

        components: {
            AppLink
        }
    };
</script>
