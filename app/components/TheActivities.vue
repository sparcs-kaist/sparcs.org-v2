<template>
    <section class="Activities">
        <h1 class="Index__title">Activities</h1>

        <div class="Activities__content">
            <div class="Activities__column" v-for="column in columns">
                <div class="Activities__card Card" v-for="activity in column" :key="activity.name">
                    <h2 class="Card__title"> {{ $t(activity.name) }} </h2>
                    <p class="Card__content">
                        {{ $t(`${activity.name}-desc`) }}
                    </p>
                    <div class="Card__links" v-if="activity.link">
                        <app-link :to="activity.link"> {{ $t('link') }} </app-link>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<i18n>
    ko:
        link: '바로가기'

        regular-meetup: '정기 모임'
        regular-meetup-desc: >
            매주 월요일 정회원이 모두 모여 세미나와 프로젝트 계획 등에 대해 논의합니다.
            각종 친목 활동에 대한 이야기도 활발히 전개됩니다.

        seminar: '세미나'
        seminar-desc: >
            세미나가 매주 정기적으로 개최됩니다.
            대표적인 세미나로는 봄학기에 개최되는 신입생 교육 세미나와 여름, 겨울학기에 개최되는 휠 세미나가 있습니다.
            이외에도 발제자의 관심분야에 따라 다양한 주제의 세미나가 수시로 열립니다.
            관련 정보는 하단의 링크에서 확인하실 수 있습니다.

        project: '프로젝트'
        project-desc: >
            팀을 조직하여 프로젝트를 수행할 수 있습니다. 만들어진 프로그램들은 KAIST 학생들을 위해 서비스됩니다.

        study: '스터디'
        study-desc: >
            스터디 그룹을 조직하여 심도있는 학습을 진행합니다.
            학교 수업에서 가르쳐주지 않는 다양한 전산 분야는 물론, 학과 수업을 도와주기 위한 것들도 있습니다.

        social-activity: '친목활동'
        social-activity-desc: >
            개발과 프로젝트 이외에도 딸기파티, MT 및 홈커밍 이벤트를 포함하는 많은 친목 활동이 진행됩니다.
</i18n>

<style scoped>
    .Activities {
        &__content {
            display: flex;
        }

        &__column {
            flex: 1;
            width: 0;
            margin: 0 10px;

            &:first-child {
                margin-left: 0;
            }

            &:last-child {
                margin-right: 0;
            }
        }
    }

    .Card {
        color: var(--theme-foreground-900);
        background: var(--theme-400);
        font-family: var(--theme-font);
        margin: 20px 0;
        padding: 10px 20px;
        border-radius: 5px;
        box-sizing: border-box;
        box-shadow: var(--shadow-500);

        &:first-child {
            margin-top: 0;
        }

        &:last-child {
            margin-bottom: 0;
        }
    }

    @media (max-width: 768px) {
        .Activities{
            &__content {
                flex-direction: column;
            }

            &__column {
                width: 100%;
                margin: 0;
                margin-top: 20px;
            }
        }
    }
</style>

<script>
    import AppLink from "@/components/AppLink";

    export default {
        data() {
            return {
                columns: [
                    [
                        { name: 'regular-meetup' },
                        { name: 'study' },
                        { name: 'social-activity' }
                    ],

                    [
                        { name: 'seminar', link: '/seminar' },
                        { name: 'project' },
                    ]
                ]
            };
        },

        components: {
            AppLink
        }
    };
</script>
