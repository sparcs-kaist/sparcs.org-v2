<template>
    <section class="Members">
        <h1 class="Index__title">Members</h1>

        <div class="Members__section Section">
            <h2 class="Section__title"> {{ $t('recruiting') }} </h2>
            <p class="Section__content">
                {{ $t('recruiting-desc') }}
            </p>
            <div class="Section__links">
                <app-link to="https://apply.sparcs.org" :disabled="!recruitingEnabled"
                    class="Section__link Section__link--primary">

                    <template v-if="recruitingEnabled">
                        {{ $t('recruiting-link') }}
                    </template>
                    <template v-else>
                        {{ $t('recruiting-disabled') }}
                    </template>
                </app-link>
            </div>
        </div>

        <div class="Members__section Section">
            <h2 class="Section__title"> {{ $t('members') }} </h2>
            <p class="Section__content">
                {{ $t('members-desc') }}
            </p>
            <div class="Section__links">
                <app-link to="/members" class="Section__link">
                    {{ $t('members-link') }}
                </app-link>
            </div>
        </div>
    </section>
</template>

<i18n>
    ko:
        recruiting: '리크루팅'
        recruiting-link: '리크루팅'
        recruiting-disabled: '현재 리크루팅 기간이 아닙니다.'
        recruiting-desc: >
            스팍스는 같이 개발을 진행할 열정이 넘치시는 분들을 매 학기 모집하고 있습니다.
            자세한 사항은 리크루팅 페이지를 참조해주세요.

        members: '회원 목록'
        members-link: '회원 목록'
        members-desc: >
            SPARCS의 개발자와 디자이너들을 소개합니다.

</i18n>

<style scoped>
    .Section {
        color: var(--grey-100);
        font-family: var(--theme-font);
        margin-top: 50px;

        &:nth-of-type(1) {
            margin-top: 0;
        }

        &__content, &__links {
            margin-left: 10px;
        }

        &__link {
            box-shadow: var(--shadow-500);

            &--primary {
                color: var(--theme-foreground-900);
                background: var(--theme-500);

                & >>> svg {
                    stroke: var(--theme-foreground-900);
                }

                &:hover {
                    background: var(--theme-400);
                }
            }
        }
    }
</style>

<script>
    import AppLink from "@/components/AppLink";

    export default {
        data() {
            return {
                recruitingEnabled: false
            };
        },

        components: {
            AppLink
        }
    };
</script>
