<template>
    <section class="Landing" :class="{ 'Landing--many-notifications': manyNotifications }">
        <div class="Landing__notifications">
            <div class="Notification"
                :class="`Notification--alert${notification.level}`"
                v-for="notification in notifications">

                <h2 class="Notification__title"> {{ notification.title }} </h2>

                <p class="Notification__content Notification__content--raw"
                    v-html="notification.content"
                    v-if="notification.raw">
                </p>
                <p class="Notification__content" v-else>{{ notification.content }}</p>

                <AppLink class="Notification__delete" v-if="admin" button
                    @click="deleteNotification(notification._id)">

                    {{ $t('close') }}
                </AppLink>
            </div>
        </div>

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

                    <a class="Landing__link" href="mailto:staff@sparcs.org">
                        <IconArrow class="Landing__link__icon" />
                        Mail
                    </a>
                </div>
            </div>

            <transition name="Fade">
                <LandingText class="Landing__text"/>
            </transition>
        </div>
    </section>
</template>

<i18n>
    ko:
        close: '알림 삭제'

        description: >
            System Programmers’ Association for Researching Computer Systems


            SPARCS는 컴퓨터와 관련된 다양한 이슈에 관심이 있는 사람들이 모여, 다양한 활동을 통해 자신을 성장시키고,
            KAIST 학우들에게 도움이 되는 서비스를 개발하는 KAIST 최고의 컴퓨터 R&D 동아리입니다.


            OTL, Ara, Zabo, KAIST FTP 등을 관리하고 있으며 교양분관 1층 SPARCS실과 서버실을 동아리방으로 사용하고 있습니다.
</i18n>

<style scoped>
    .Notification {
        padding: 20px 30px;
        background: var(--grey-800);
        color: var(--grey-200);
        font-family: var(--theme-font);
        border-radius: 5px;
        margin-bottom: 20px;
        position: relative;
        z-index: 1;

        &:last-child {
            margin-bottom: 0;
        }

        &__title {
            margin: 0;
        }

        &__content {
            margin-bottom: 0;
            white-space: pre-line;

            &--raw {
                white-space: normal;
            }
        }

        &__delete {
            margin-top: 10px;
        }

        &--alert1, &--alert2, &--alert3 {
            color: var(--alert-foreground-900);
        }

        &--alert1 {
            background: var(--alert-level-1);
        }

        &--alert2 {
            background: var(--alert-level-2);
        }

        &--alert3 {
            background: var(--alert-level-3);
        }
    }

    .Landing {
        font-family: var(--theme-font);
        position: relative;
        background-image: url(../images/LandingBackground.svg);
        background-size: cover;
        padding-top: 1px;
        margin-top: -1px;
        min-height: 100vh;

        &--many-notifications &__text {
            display: none;
        }

        &__notifications {
            padding-top: 100px;
            padding-left: 60px;
            max-width: 30vw;
        }

        &__card {
            position: absolute;
            top: 10vh;
            right: 0;
            width: 60vw;
            padding: 50px;
            box-sizing: border-box;

            background: var(--theme-500);
            color: var(--theme-foreground-900);
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
            background: var(--theme-foreground-900);
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
            color: var(--theme-foreground-900);
            text-decoration: none;
            font-size: 1.5rem;
            margin-top: 5px;
            padding-right: 50px;

            &__icon {
                stroke: var(--theme-foreground-900);
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

    @media (max-width: 1000px) {
        .Landing {
            &__notifications {
                position: relative;
                max-width: 100%;
                padding: 100px 30px;
                padding-bottom: 30px;
            }

            &__card {
                position: relative;
                top: 0;
                left: 0;
                margin: 0 auto;
                width: 90vw;
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

        .Notification {
            max-width: 40vw;
        }
    }
</style>

<style>
    .Notification__content--raw {
        a {
            color: inherit;

            &:hover {
                background: rgba(var(--grey-050_w), 0.2);
            }
        }
    }
</style>

<script>
    import api from "@/src/api";

    import AppLink from "@/components/AppLink";
    import IconArrow from "@/images/IconArrow?inline";
    import LandingText from "@/images/LandingText?inline";

    export default {
        data() {
            return {
                notifications: [],
                loaded: false
            };
        },

        computed: {
            admin() {
                if(!this.$store.state.auth.user)
                    return false;

                return this.$store.state.auth.user.admin;
            },

            manyNotifications() {
                if(!this.loaded)
                    return true;

                return this.notifications.length > 2;
            }
        },

        methods: {
            async deleteNotification(id) {
                await api(`/notification/${id}`, 'delete');
                await this.fetchNotification();
            },

            async fetchNotification() {
                const { notifications } = await api('/notification');
                this.notifications = notifications;
            }
        },

        async created() {
            await this.fetchNotification();
            this.loaded = true;
        },

        components: {
            AppLink,
            IconArrow,
            LandingText
        }
    };
</script>
