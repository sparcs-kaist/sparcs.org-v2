<template>
    <section class="Services">
        <h1 class="Index__title">Services</h1>

        <div class="Services__service Service" v-for="service in services" :key="service.name">
            <div class="Service__status">
                <img class="Service__logo" :src="service.image">
                <template v-if="service.tags">
                    <span class="Service__tag" v-for="tag in service.tags" :key="tag">
                        <div class="Service__tag__decorator"></div>
                        {{ $t(tag) }}
                    </span>
                </template>
            </div>

            <div class="Service__about">
                <p class="Service__desc">
                    {{ $t(service.desc) }}
                </p>
                <div class="Service__links">
                    <AppLink class="Service__link" :to="service.link" v-if="service.link">
                        {{ $t('visit') }}
                    </AppLink>

                    <template v-if="service.github">
                        <AppLink class="Service__link" v-for="link in service.github" :key="link"
                            :to="getGithubLink(link)">

                            <IconGithub class="Service__link__icon" />
                            {{ link }}
                        </AppLink>
                    </template>
                </div>
            </div>
        </div>
    </section>
</template>

<i18n>
    ko:
        development: '개발 중'
        visit: '방문하기'

        service-ara: >
            Ara는 KAIST 학내 온라인 커뮤니티 서비스로, 하루 평균 접속량 2천 명을 자랑합니다.
            중고 장터 게시판, 구인 구직 게시판을 포함한 다양한 게시판에 많은 양의 게시물과 다양한 학사 공지가 올라옵니다.
            다양한 KAIST 학우들이 자유롭게 소통할 수 있는 공간, ARA를 방문해 주세요.

        service-geoul: >
            거울은 KAIST FTP라고도 불리는 오픈소스 미러링 서비스로, 전세계에 퍼져 있는 최신버전의 오픈소스 소프트웨어들을
            대한민국을 포함한 아시아 국가들에게 공급합니다.
            기존의 먼 곳에 위치해 있는 외국 서버들로부터 직접 다운로드 받을 필요없이,
            가까운 위치의 서버에서 다운로드 받을 수 있다는 큰 장점이 있습니다.
            현재 거울은 엄청난 서비스 접속량을 자랑하며 아시아 지역의 주요 미러링 서비스 중 하나로 자리하고 있습니다.

        service-home: >
            SPARCS 공식 홈페이지는 SPARCS가 학우들과 소통할 수 있는 창구로서 현재 운영,
            개발중인 SPARCS의 다양한 서비스들을 소개하고 SPARCS의 활동 및 현황을 공유하는 공간입니다.

        service-kono: >
            kono는 SPARCS에서 2019년 4월부터 개발중인 프로젝트입니다.
            카이스트 코인노래방의 7개 방의 사용 여부를 실시간으로 받아 웹 서비스로 제공합니다.
            코인노래방을 운영하는 카이스트 학생복지위원회 관리자를 위한 공지사항, 알림, 분실물 게시 서비스도 제공합니다.

        service-newara: >
            현재 운영 중인 학내 커뮤니티 Ara의 새로운 버전입니다.
            기존의 Ara가 개발된 지 오랜 시간이 지나 레거시 코드가 많고, 업데이트가 힘들어져 새롭게 처음부터 개발중입니다.

        service-otl: >
            OTL PLUS는 매 학기 개설되는 KAIST의 대부분의 과목들에 대한 정보를 쉽게 검색할 수 있게 도와줍니다.
            과목들을 개인 시간표에 추가할 수 있으며 여러 개의 시간표를 한 번에 관리할 수 있습니다.
            뿐만 아니라, 해당 과목에 대한 실라버스 및 해당 과목을 수강한 여러 학우들의 수강 후기를 볼 수 있어
            수강 신청에 있어 많은 편의를 제공합니다.
            시험을 망칠 게 뻔하니 미리 와서 다음 학기를 준비하세요.

        service-sso: >
            SPARCS 서비스 로그인을 하나의 계정으로 할 수 있도록 해주는 Single Sign On 서비스입니다.
            KAIST Portal 연동을 통해 KAIST 구성원임을 인증하고 실명, 생일, 학번 등 개인 정보를 저장하여 SPARCS 서비스에 제공합니다.

        service-status: >
            SPARCS에서 제공되는 서비스들이 정상적으로 동작중인지 상태를 체크할 수 있는 사이트입니다.

        service-zabo: >
            동아리를 비롯한 각종 단체들의 리크루팅, 공연 포스터를 온라인으로 게시할 수 있는 서비스입니다.
            학우들은 관심있는 단체의 행사를 보다 쉽게 검색할 수 있고, 단체들은 경쟁없이 편하게 홍보를 할 수 있습니다.
</i18n>

<style scoped>
    .Service {
        display: flex;
        margin: 60px 0;
        color: var(--grey-200);

        &__logo {
            width: 25vw;
            max-width: 200px;
            height: 8.5vw;
            max-height: 50px;
            object-fit: contain;
            object-position: center left;
            margin-right: 20px;
        }

        &__about {
            width: 0;
            flex: 1;
        }

        &__status {
            display: flex;
            flex-direction: column;
        }

        &__desc {
            margin: 0;
            font-family: var(--theme-font);
        }

        &__links {
            margin-top: 10px;
        }

        &__link {
            height: 1.4rem;
            vertical-align: middle;
            
            &__icon {
                stroke: none !important;
            }
        }

        &__tags {
            display: flex;
            flex-direction: column;
        }

        &__tag {
            display: inline-flex;
            align-items: center;

            font-family: var(--theme-font);
            color: var(--grey-650);

            &__decorator {
                display: inline-block;
                width: 7px;
                height: 7px;
                margin-right: 10px;
                border-radius: 50%;
                background: var(--grey-650);
            }
        }
    }

    @media (max-width: 360px) {
        .Service {
            flex-direction: column;

            &__logo {
                width: 30vw;
                height: 10vw;
                margin-right: 0;
            }

            &__status {
                margin-bottom: 20px;
            }

            &__about {
                width: 100%;
            }
        }
    }
</style>

<script>
    import AppLink from "@/components/AppLink";
    import IconGithub from "@/images/IconGithub?inline";
    import ServiceAra from "@/images/ServiceAra";
    import ServiceGeoul from "@/images/ServiceGeoul";
    import ServiceHome from "@/images/ServiceHome";
    import ServiceKono from "@/images/ServiceKono";
    import ServiceNewAra from "@/images/ServiceNewAra";
    import ServiceOTL from "@/images/ServiceOTL";
    import ServiceSSO from "@/images/ServiceSSO";
    import ServiceStatus from "@/images/ServiceStatus";
    import ServiceZabo from "@/images/ServiceZabo";

    export default {
        data() {
            return {
                services: [
                    {
                        name: 'Ara',
                        desc: 'service-ara',
                        image: ServiceAra,
                        link: 'https://ara.kaist.ac.kr',
                        github: [ 'arara' ]
                    },

                    {
                        name: 'Geoul',
                        desc: 'service-geoul',
                        image: ServiceGeoul,
                        link:  'http://ftp.kaist.ac.kr',
                        github: [ 'ftp.kaist.ac.kr' ]
                    },

                    {
                        name: 'Home',
                        desc: 'service-home',
                        image: ServiceHome,
                        github: [ 'sparcs.org-v2' ]
                    },

                    {
                        name: 'Kono',
                        desc: 'service-kono',
                        image: ServiceKono,
                        link: 'https://kono.sparcs.org',
                        github: [ 'kono' ],
                        tags: [ 'development' ]
                    },

                    {
                        name: 'NewAra',
                        desc: 'service-newara',
                        image: ServiceNewAra,
                        link: 'https://ara-beta.sparcs.org',
                        github: [ 'new-ara-api', 'new-ara-web' ],
                        tags: ['development']
                    },

                    {
                        name: 'OTL',
                        desc: 'service-otl',
                        image: ServiceOTL,
                        link: 'https://otl.kaist.ac.kr',
                        github: [ 'otlplus' ]
                    },

                    {
                        name: 'SSO',
                        desc: 'service-sso',
                        image: ServiceSSO,
                        link: 'https://sparcssso.kaist.ac.kr',
                        github: [ 'sparcssso' ]
                    },

                    {
                        name: 'status',
                        desc: 'service-status',
                        image: ServiceStatus,
                        link: 'https://status.sparcs.org',
                        github: ['status-page']
                    },

                    {
                        name: 'Zabo',
                        desc: 'service-zabo',
                        image: ServiceZabo,
                        link: 'https://zabo.sparcs.org',
                        github: [ 'zabo-front-reactjs', 'zabo-server-nodejs' ]
                     }
                ]
            }
        },

        methods: {
            getGithubLink(repository) {
                return `https://github.com/sparcs-kaist/${repository}`;
            }
        },

        components: {
            AppLink,
            IconGithub
        }
    };
</script>
