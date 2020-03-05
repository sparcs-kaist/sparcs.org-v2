<template>
    <label class="AppCheckbox">
        <input class="AppCheckbox__input" :name="name" type="checkbox" v-model="_checked">
        <div class="AppCheckbox__decorator">
            <div class="AppCheckbox__check"></div>
        </div>
        <div class="AppCheckbox__label">
            <slot></slot>
        </div>
    </label>
</template>

<style scoped>
    .AppCheckbox {
        display: inline-flex;
        align-items: center;
        font-family: var(--theme-font);

        &__input {
            display: none;
        }

        &__decorator {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 1.1rem;
            height: 1.1rem;
            margin-right: 5px;
            border-radius: 5px;
            background: var(--grey-750);
            transition: all .4s ease;
        }

        &__input:checked + &__decorator {
            background: var(--theme-500);

            .AppCheckbox__check {
                border-color: var(--theme-foreground-900);
            }
        }

        &__check {
            width: .3rem;
            height: .6rem;
            border: .1rem solid transparent;
            border-top: none;
            border-left: none;
            transform: translateY(-1px) rotate(45deg);
            transform-origin: center;
            transition: all .4s ease;
        }
    }
</style>

<script>
    export default {
        model: {
            prop: 'checked',
            event: 'update'
        },

        data() {
            return { unbound: this.checked };
        },

        props: {
            checked: {
                type: Boolean
            },

            name: {
                type: String,
                default: ''
            },

            bind: {
                type: Boolean
            }
        },

        computed: {
            _checked: {
                get() {
                    if(!this.bind)
                        return this.unbound;

                    return this.checked;
                },

                set(value) {
                    if(!this.bind) {
                        this.unbound = value;
                    } else {
                        this.$emit('update', value);
                    }
                }
            }
        }
    };
</script>
