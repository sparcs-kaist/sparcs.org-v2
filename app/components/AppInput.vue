<template>
    <label class="AppInput">
        <input class="AppInput__input" :name="name" :type="type" v-model="text"
            :autocomplete="hintOnOff" :autocorrect="hintOnOff"
            :autocapitalize="hintOnOff" :spellcheck="hintTrueFalse"
            :placeholder="placeholder">
    </label>
</template>

<style scoped>
    .AppInput {
        &__hint {
            font-family: var(--theme-font);
            font-size: .8rem;
            color: var(--grey-200);
        }

        &__input {
            background: var(--grey-800);
            border: none;
            border-radius: 5px;
            padding: 10px 20px;
            color: var(--grey-200);
            font-family: var(--theme-font);
            font-size: .9rem;
            outline: none;
        }
    }
</style>

<script>
    export default {
        model: {
            prop: 'value',
            event: 'update'
        },

        data() {
            return { unbound: this.value };
        },

        props: {
            value: {
                type: String,
                default: ''
            },

            name: {
                type: String,
                default: ''
            },

            hint: {
                type: Boolean
            },

            placeholder: {
                type: String,
                default: ''
            },

            bind: {
                type: Boolean
            },

            type: {
                type: String,
                default: 'text'
            }
        },

        computed: {
            text: {
                get() {
                    if(!this.bind)
                        return this.unbound;

                    return this.value;
                },

                set(value) {
                    if(!this.bind) {
                        this.unbound = value;
                    } else {
                        this.$emit('update', value);
                    }
                }
            },

            hintOnOff() {
                return this.hint ? 'on' : 'off';
            },

            hintTrueFalse() {
                return this.hint ? 'true' : 'false';
            }
        }
    };
</script>
