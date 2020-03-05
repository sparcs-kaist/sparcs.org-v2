<template>
    <div class="NotFound">
        <NotFoundText class="NotFound__title" />
        <span class="NotFound__desc"> {{ $t('not-found') }} </span>
        <button class="NotFound__back App__back" button @click="back">
            <IconArrow class="App__back__icon" />
            {{ $t('go-back') }}
        </button>
    </div>
</template>

<i18n>
    ko:
        not-found: '잃어버린 제 사이트를 찾습니다.'
        go-back: '뒤로가기'
</i18n>

<style scoped>
    .NotFound {
        height: 100vh;

        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        font-family: var(--theme-font);

        &__title {
            fill: var(--grey-400);
            width: 15vw;
            height: 15vh;
            margin-bottom: 40px;
        }

        &__desc {
            color: var(--grey-400);
            font-size: 1.2rem;
            font-weight: 300;
        }

        &__back {
            cursor: pointer;
            border: none;
            outline: none;
            margin-top: 30px;
            border-radius: 5px;
            background: var(--grey-780);
            color: var(--grey-200);
            padding: 10px 30px;
        }
    }
</style>

<script>
    import NotFoundText from "@/images/NotFoundText?inline";
    import IconArrow from "@/images/IconArrow?inline";

    export default {
        methods: {
            back() {
                this.$router.back(1);
            }
        },

        components: {
            NotFoundText,
            IconArrow
        }
    };
</script>
