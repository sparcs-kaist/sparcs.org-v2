<template>
    <section class="Landing">
        <div class="Landing__card">
            <div class="Landing__card-content">
                <h1 class="Landing__title">SPARCS</h1>
                <div class="Landing__decorator"></div>
                <p class="Landing__description">{{ $t('description') }}</p>

                <div class="Landing__links">
                    <a class="Landing__link" href="https://github.com/sparcs-kaist">
                        <IconArrow class="Landing__link__icon" />
                        Github
                    </a>

                    <a class="Landing__link" href="mailto://staff@sparcs.org">
                        <IconArrow class="Landing__link__icon" />
                        Mail
                    </a>
                </div>
            </div>

            <LandingText class="Landing__text"/>
        </div>
    </section>
</template>

<i18n>
    ko:
        description: >
            SPARCS: Programmers’ Association for Researching Computer Systems


            SPARCS는 컴퓨터와 관련된 다양한 이슈에 관심이 있는 사람들이 모여, 다양한 활동을 통해 자신을 성장시키고,
            KAIST 학우들에게 도움이 되는 서비스를 개발하는 KAIST 최고의 컴퓨터 R&D 동아리입니다.


            OTL, Ara, Zabo, KAIST FTP 등을 관리하고 있으며 교양분관 1층 SPARCS실과 서버실을 동아리방으로 사용하고 있습니다.
</i18n>

<style scoped>
    .Landing {
        font-family: var(--theme-font);
        position: relative;
        background-image: url(../images/LandingBackground.svg);
        background-size: cover;
        padding-top: 1px;
        margin-top: -1px;
        min-height: 100vh;

        &__card {
            margin-top: 10vh;
            margin-left: auto;
            width: 60vw;
            padding: 50px;
            box-sizing: border-box;

            background: var(--theme-500);
            color: var(--grey-900);
        }

        &__card-content {
            display: flex;
            flex-direction: column;
        }

        &__text {
            position: absolute;
            right: 50vw;
            height: 10rem;
        }

        &__title {
            font-family: var(--title-font);
            font-size: 2.5rem;
            margin-top: 0;
            margin-bottom: .5rem;
        }

        &__decorator {
            width: 5rem;
            height: .7rem;
            margin-bottom: 2rem;
            background: var(--grey-900);
        }

        &__description {
            white-space: pre-line;
            font-size: 1.3rem;
        }

        &__links {
            display: inline-block;
            align-self: flex-end;
            margin-top: 10vh;
        }

        &__link {
            display: flex;
            align-items: center;
            color: var(--grey-900);
            text-decoration: none;
            font-size: 1.5rem;
            margin-top: 5px;
            padding-right: 50px;

            &__icon {
                stroke: var(--grey-900);
                height: 1rem;
                margin-right: .5rem;
                transition: transform .4s ease;
            }

            &:hover &__icon {
                transform: translateX(-5px);
            }
        }
    }

    @media (max-height: 720px) {
        .Landing {
            &__text {
                display: none;
            }
        }
    }

    @media (max-width: 800px) {
        .Landing {
            &__card {
                width: 90vw;
                margin-right: auto;
            }

            &__title {
                font-size: 1.7rem;
            }

            &__description {
                font-size: 1.1rem;
            }

            &__links {
                margin-top: 20px;
            }
        }
    }

    @media (max-width: 1280px) {
        .Landing {
            &__text {
                display: none;
            }
        }
    }

    @media (min-width: 1280px) and (max-height: 1000px) {
        .Landing {
            &__text {
                margin-top: -5rem;
                margin-right: -5rem;
            }
        }
    }

    @media (min-width: 1600px) and (min-height: 870px) {
        .Landing {
            &__card {
                width: 40vw;
            }
        }
    }
</style>

<script>
    import IconArrow from "@/images/IconArrow?inline";
    import LandingText from "@/images/LandingText?inline";

    export default {
        components: {
            IconArrow,
            LandingText
        }
    };
</script>
