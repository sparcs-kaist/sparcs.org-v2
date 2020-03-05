<template>
    <footer class="Footer">
        <div class="Footer__content">
            <SparcsLogo class="Footer__logo" />
            <div class="Footer__location">
                <span class="Footer__location-text"> {{ $t('location-1') }} </span>
                <span class="Footer__location-text"> {{ $t('location-2') }} </span>
            </div>

            <!-- To prevent our email being crawled -->
            <EmailText class="Footer__email" />

            <div class="Footer__license">
                {{ $t('license') }}
            </div>
        </div>
    </footer>
</template>

<i18n>
    ko:
        location-1: '대전광역시 유성구 대학로 291 한국과학기술원'
        location-2: '교양분관(N10) 1층 SPARCS'
        license: 'Developed in SPARCS, Licensed under MIT License'
</i18n>

<style scoped>
    .Footer {
        font-family: var(--theme-font);
        margin-top: 50px;
        border-top: 30px solid var(--grey-780);
        background: var(--grey-850);
        padding: 50px 30px;

        &__content {
            display: flex;
            flex-direction: column;

            max-width: 900px;
            margin: 0 auto;
        }

        &__logo {
            margin-bottom: 20px;

            path {
                fill: var(--grey-200);
            }
        }

        &__location {
            color: var(--grey-600);
            font-weight: 400;
            display: flex;
            flex-wrap: wrap;
            margin-bottom: 10px;
        }

        &__email {
            fill: var(--grey-600);
        }

        &__license {
            font-family: var(--theme-font);
            color: var(--grey-600);
            margin-top: 30px;
        }
    }
</style>

<script>
    import EmailText from "@/images/EmailText?inline";
    import SparcsLogo from "@/images/SparcsLogo?inline";

    export default {
        components: {
            EmailText,
            SparcsLogo
        }
    };
</script>
