<template>
    <div class="Members App__page">
        <router-link class="App__back" to="/">
            <IconArrow class="App__back__icon" />
            {{ $t('go-back') }}
        </router-link>

        <h1 class="App__title">Members</h1>
        <div class="Members__desc">
            <p class="Members__desc-paragraph">
                {{ $t('desc') }}
            </p>

            <p class="Members__desc-paragraph" v-if="!authState">
                {{ $t('members-hidden') }}
            </p>
        </div>

        <div class="Members__criteria">
            <AppInput class="Members__criteria__search" v-model="nameCriteria" :placeholder="$t('name')" bind />
            <AppCheckbox v-model="undergradCriteria" bind> {{ $t('undergraduate') }} </AppCheckbox>
            <AppCheckbox v-model="developerCriteria" bind> {{ $t(  'developer'  ) }} </AppCheckbox>
            <AppCheckbox v-model="designerCriteria"  bind> {{ $t(   'designer'  ) }} </AppCheckbox>
        </div>

        <transition-group class="Members__members" name="FadeMove" tag="div">
            <div class="Member" :class="`Member--height-${calculateHeight(member)}`"
                v-for="member in filteredMembers" :key="member.id">

                <div class="Member__tags">
                    <span class="Member__tag" v-if="member.is_developer"> {{ $t('developer') }} </span>
                    <span class="Member__tag" v-if="member.is_designer"> {{ $t('designer') }} </span>
                </div>

                <div class="Member__info">
                    <h3 class="Member__name"> {{member.name}} </h3>
                    <span class="Member__id"> {{member.id}} </span>
                </div>

                <div class="Member__links">
                    <a :href="getWebsite(member.website)" v-if="member.website"
                        rel="noopener" target="_blank">

                        <IconWebsite />
                        {{ $t('website') }}
                    </a>

                    <a :href="getGithubLink(member.github_id)" v-if="member.github_id"
                        rel="noopener" target="_blank">

                        <IconGithub />
                        {{ $t('github') }}
                    </a>

                    <a :href="getBehanceLink(member.behance_url)" v-if="member.behance_url"
                        rel="noopener" target="_blank">

                        <IconBehance />
                        {{ $t('behance_url') }}
                    </a>

                    <a :href="getLinkedInLink(member.linkedin_url)" v-if="member.linkedin_url"
                        rel="noopener" target="_blank">

                        <IconLinkedIn />
                        {{ $t('linkedin') }}
                    </a>
                </div>
            </div>
        </transition-group>
    </div>
</template>

<i18n>
    ko:
        go-back: '뒤로가기'
        desc: >
            SPARCS의 개발자와 디자이너들을 소개합니다.

        developer: '개발자'
        designer: '디자이너'
        undergraduate: '학부'
        linkedin: 'LinkedIn'
        github: 'GitHub'
        website: 'Website'
        name: '이름 또는 ID'
        members-hidden: '회원분들 중 일부는 숨겨진 상태입니다. 스팍스 회원이실 경우, 로그인하시면 전부 보실 수 있습니다.'
</i18n>

<style scoped>
    .Members {
        &__members {
            position: relative;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-gap: 15px;
            grid-auto-rows: 2rem;
        }

        &__desc {
            color: var(--grey-200);
            font-family: var(--theme-font);
            margin-bottom: 2rem;
        }

        &__desc-paragraph {
            margin: 0;
        }

        &__criteria {
            display: flex;
            max-width: 500px;
            margin-bottom: 50px;

            & > * {
                margin-right: 10px;
            }

            &__search {
                flex: 1;
            }
        }
    }

    .Member {
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        color: var(--grey-200);
        font-family: var(--theme-font);
        background: var(--grey-800);
        padding: 15px 30px;
        box-sizing: border-box;
        max-width: 100%;
        overflow: hidden;

        &--height-0 {
            grid-row: span 2;
        }

        &--height-1 {
            grid-row: span 3;
        }

        &--height-2 {
            grid-row: span 4;
        }

        &--height-3 {
            grid-row: span 4;
        }

        &__info {
            display: flex;
            align-items: flex-end;
            
            & > * {
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }

        &__name {
            margin: 0;
        }

        &__id {
            margin-left: 5px;
            margin-bottom: 1px;
            font-size: 1rem;
            font-weight: 300;
        }

        &__tags {
            display: flex;
            flex-wrap: wrap;
            margin-left: -5px;
        }

        &__tag {
            font-weight: 400;
            font-size: .9rem;
            color: var(--grey-200);
            margin: 5px;
        }

        &__links {
            display: flex;
            flex-direction: column;
            align-items: flex-start;

            & > :first-child {
                margin-top: 20px;
            }

            a {
                font-family: var(--title-font);
                color: rgba(var(--theme-foreground-200), .8);
                display: inline-flex;
                align-items: center;
                padding: 3px 8px;
                border-radius: 5px;
                margin-top: 3px;
                margin-left: -8px;
                text-decoration: none;
                transition: all .4s ease;

                &:hover {
                    background: var(--theme-900);
                }
            }

            svg {
                fill: rgba(var(--theme-foreground-200), .8);
                width: 1rem;
                height: 1rem;
                margin-right: 5px;
                transition: fill .4s ease;
            }
        }
    }


    .FadeMove-leave-active {
        position: absolute;
        transition: transform .4s cubic-bezier(1, 0, 1, 0), opacity .3s cubic-bezier(0.33, 0.33, 0.33, 1);
        width: calc(33.3333% - 10px);

        &.Member {
            &--height-0 {
                height: calc(4rem + 15px);
            }

            &--height-1 {
                height: calc(6rem + 30px);
            }

            &--height-2 {
                height: calc(8rem + 45px);
            }

            &--height-3 {
                height: calc(8rem + 45px);
            }
        }
    }

    @media (max-width: 768px) {
        .Members {
            &__members {
                grid-template-columns: repeat(2, 1fr);
            }
        }

        .FadeMove-leave-active {
            width: calc(50% - 7.5px);
        }
    }

    @media (max-width: 550px) {
        .Members {
            &__members {
                grid-template-columns: repeat(1, 1fr);
            }
        }

        .FadeMove-leave-active {
            width: 100%;
        }
    }
</style>

<script>
    import api from "@/src/api";

    import AppCheckbox from "@/components/AppCheckbox";
    import AppInput from "@/components/AppInput";
    import IconArrow from "@/images/IconArrow?inline";
    import IconBehance from "@/images/IconBehance?inline";
    import IconGithub from "@/images/IconGithub?inline";
    import IconLinkedIn from "@/images/IconLinkedIn?inline";
    import IconWebsite from "@/images/IconWebsite?inline";

    export default {
        data() {
            return {
                members: [],
                nameCriteria: '',
                undergradCriteria: false,
                designerCriteria: false,
                developerCriteria: false
            };
        },

        computed: {
            filteredMembers() {
                return this.members.filter(member => {
                    if(this.nameCriteria) {
                        const criterion = this.nameCriteria.toLowerCase();
                        if (
                            !(member.id.toLowerCase().includes(criterion)) &&
                            !(member.name.toLowerCase().includes(criterion))
                        ) {
                            return false;
                        }
                    }

                    if(this.undergradCriteria && !member.is_undergraduate)
                        return false;

                    if(this.designerCriteria && !member.is_designer)
                        return false;

                    if(this.developerCriteria && !member.is_developer)
                        return false;

                    return true;
                });
            },

            authState() {
                return this.$store.getters['auth/authState'];
            }
        },

        methods: {
            calculateHeight(member) {
                let links = 0;
                if(!member.is_developer && !member.is_designer) links--;
                if(member.github_id) links++;
                if(member.linkedin_url) links++;
                if(member.behance_url) links++;
                if(member.website) links++;

                if(links < 0) return 0;
                if(0 <= links && links < 2) return 1;
                if(2 <= links && links < 4) return 2;
                if(4 <= links) return 3;
            },

            getGithubLink(id) {
                id = id.replace(/^(?:https?:\/\/)?(?:www\.)?github.com\//i, '');
                return `https://github.com/${id}`;
            },

            getLinkedInLink(id) {
                id = id.replace(/^(?:https?:\/\/)?(?:www\.)?linkedin\.com\/in\//i, '');
                return `https://www.linkedin.com/in/${id}`;
            },

            getBehanceLink(id) {
                id = id.replace(/^(?:https?:\/\/)?(?:www\.)?behance\.net\//i, '');
                return `https://behance.net/${id}`;
            },

            getWebsite(link) {
                if(!/^https?:\/\//.test(link))
                    return `https://${link}`;

                return link;
            }
        },

        async beforeRouteEnter(to, from, next) {
            const { members } = await api('/member');

            next(vm => {
                vm.members = members;
            });
        },

        components: {
            AppCheckbox,
            AppInput,
            IconArrow,
            IconBehance,
            IconGithub,
            IconLinkedIn,
            IconWebsite
        }
    };
</script>
