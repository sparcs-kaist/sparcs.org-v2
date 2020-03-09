<template>
    <div class="Seminars App__page">
        <router-link class="App__back" to="/">
            <IconArrow class="App__back__icon" />
            {{ $t('go-back') }}
        </router-link>

        <h1 class="App__title">Seminars</h1>

        <p class="Seminars__desc">
            {{ $t('desc') }}
        </p>

        <div class="Seminars__criteria">
            <div class="Seminars__query">
                <AppInput v-model="query" bind :placeholder="$t('search')" />
                <div class="Seminars__sorting">
                    <label class="Seminars__sorting-button">
                        <input class="Seminars__sorting-input" type="radio" value="date" v-model="sortMode">
                        <IconSortDate class="Seminars__sorting-icon" />
                    </label>

                    <label class="Seminars__sorting-button">
                        <input class="Seminars__sorting-input" type="radio" value="title" v-model="sortMode">
                        <IconSortTitle class="Seminars__sorting-icon" />
                    </label>
                    <AppCheckbox class="Seminars__sorting-reverse" v-model="sortReverse" bind>
                        {{ $t('reverse') }}
                    </AppCheckbox>
                </div>
            </div>

            <div class="Seminars__years">
                <button class="Seminars__year" :class="{ 'Seminars__year--active': year === n }"
                    @click="year = n" v-for="n in years" v-if="!query">

                    {{ n }}
                </button>
            </div>
        </div>

        <div class="Seminars__seminars">
            <div class="Seminar" v-for="seminar in seminarsFiltered" :key="seminar._id">
                <h2 class="Seminar__title"> {{ seminar.title }} </h2>
                <div class="Seminar__metadata">
                    <span class="Seminar__speaker"> by {{ seminar.speaker }} </span>
                    /
                    <span class="Seminar__date"> at {{ stringifyDate(seminar.date) }} </span>
                    <template v-if="admin">
                        /
                        <span class="Seminar__id">
                            {{ seminar._id }}
                        </span>
                    </template>
                </div>
                <div class="Seminar__files">
                    <a class="Seminar__file" v-for="source in seminar.sources" :href="source.url"
                        target="_blank" rel="noopener">

                        {{ source.name }}
                    </a>
                </div>
            </div>
        </div>

        <TheSeminarUpload v-if="authState" />
    </div>
</template>

<i18n>
    ko:
        search: '검색'
        go-back: '뒤로가기'
        desc: '스팍스에서 진행되었던 세미나의 발표자료입니다.'
        reverse: '역순'
</i18n>

<style scoped>
    .Seminars {
        &__desc {
            font-family: var(--theme-font);
            color: var(--grey-200);
        }

        &__years {
            display: flex;
            flex-wrap: wrap;
            margin-top: 10px;
        }

        &__year {
            cursor: pointer;
            /* background: var(--grey-800); */
            background: transparent;
            border: none;
            border-radius: 5px;
            font-size: 1.05rem;
            font-family: var(--theme-font);
            font-weight: 400;
            outline: none;
            padding: 5px 9px;
            margin: 5px;
            transition: all .4s ease;

            &:hover {
                background: var(--grey-780);
            }

            &--active {
                color: var(--grey-900);
                background: var(--theme-500);

                &:hover {
                    background: var(--theme-400);
                }
            }
        }

        &__query {
            display: flex;
            align-items: center;
            flex-wrap: wrap;
        }

        &__sorting {
            display: flex;
            margin: 10px;
            align-items: center;
        }

        &__sorting-button {
            cursor: pointer;
        }

        &__sorting-icon {
            width: 2rem;
            height: 2rem;
            padding: .25rem;
            margin: 0 5px;
            background: var(--grey-800);
            fill: var(--grey-200);
            border-radius: 5px;
            transition: all .4s ease;

            &:hover {
                background: var(--grey-780);
            }
        }

        &__sorting-input {
            display: none;
        }

        &__sorting-input:checked + &__sorting-icon {
            background: var(--theme-500);
            fill: var(--theme-foreground-900);

            &:hover {
                background: var(--theme-500);
            }
        }

        &__sorting-reverse {
            margin-left: 10px;
        }
    }

    .Seminar {
        border-left: 1px solid var(--grey-600);
        padding: 10px 0;
        padding-left: 20px;
        margin: 30px 0;

        &__title {
            color: var(--grey-200);
            font-family: var(--title-font);
            font-size: 1.1rem;
            margin: 0;
        }

        &__metadata {
            color: var(--grey-200);
            margin-top: 5px;
            font-family: var(--theme-font);

            & > * {
                padding: 0 7px;
            }

            & > *:first-child {
                padding-left: 0;
            }
        }

        &__files {
            margin-top: 15px;
        }

        &__file {
            cursor: pointer;
            display: inline-block;
            padding: 5px 12px;
            margin: 5px 10px;
            border-radius: 5px;
            background: var(--grey-800);
            color: var(--grey-400);
            font-family: var(--theme-font);
            text-decoration: none;
            transition: background .4s ease;

            &:hover {
                background: var(--grey-780);
            }
        }
    }
</style>

<script>
    import api from "@/src/api";
    import formatDate from "@/src/formatDate";

    import AppCheckbox from "@/components/AppCheckbox";
    import AppInput from "@/components/AppInput";
    import IconArrow from "@/images/IconArrow?inline";
    import IconSortDate from "@/images/IconSortDate?inline";
    import IconSortTitle from "@/images/IconSortTitle?inline";
    import TheSeminarUpload from "@/components/TheSeminarUpload";

    export default {
        data() {
            return {
                seminars: [],
                sortMode: 'date',
                sortReverse: true,
                query: '',
                year: (new Date()).getFullYear()
            };
        },

        computed: {
            admin() {
                if(!this.$store.state.auth.user)
                    return false;

                return this.$store.state.auth.user.admin;
            },

            seminarsSorted() {
                let sorted;

                switch(this.sortMode) {
                    case 'date':
                        sorted = this.seminars.sort(
                            (v1, v2) => v1.date.getTime() - v2.date.getTime()
                        );
                        break;

                    case 'title':
                        sorted = this.seminars.sort(
                            (v1, v2) => v2.title.localeCompare(v1.title)
                        );
                        break;

                    default:
                        sorted = this.seminars;
                }

                if(this.sortReverse)
                    sorted = sorted.reverse();

                return sorted;
            },

            seminarsFiltered() {
                if(!this.query) {
                    return this.seminarsSorted.filter(seminar => seminar.date.getFullYear() === this.year);
                }

                const lowerCaseQuery = this.query.toLowerCase();
                return this.seminarsSorted.filter(seminar => {
                    return (
                        (seminar.title || '').toLowerCase().includes(lowerCaseQuery) ||
                        (seminar.speaker || '').toLowerCase().includes(lowerCaseQuery) ||
                        seminar.sources.some(source => {
                            return source.name.toLowerCase().includes(lowerCaseQuery);
                        })
                    );
                });
            },

            yearStart() {
                const maxYear = (new Date()).getFullYear();
                const yearStart = this.seminars.reduce((prev, curr) => {
                    const currYear = curr.date.getFullYear();
                    if(currYear < prev)
                        return currYear;

                    return prev;
                }, maxYear);
                return yearStart;
            },

            yearEnd() {
                return this.seminars.reduce((prev, curr) => {
                    const currYear = curr.date.getFullYear();
                    if(currYear > prev)
                        return currYear;

                    return prev;
                }, this.yearStart);
            },

            years() {
                return [...Array(this.yearEnd - this.yearStart + 1)]
                    .map((_, i) => i + this.yearStart)
                    .reverse();
            },

            authState() {
                return this.$store.getters['auth/authState'];
            }
        },

        methods: {
            stringifyDate(date) {
                return formatDate(date);
            }
        },

        async beforeRouteEnter(to, from, next) {
            const { seminars } = await api('/seminar');
            seminars.forEach(seminar => {
                seminar.date = new Date(seminar.date);
                return seminar;
            });

            next(vm => {
                vm.seminars = seminars;
            });
        },

        async mounted() {
            const { seminars } = await api('/seminar');
            seminars.forEach(seminar => {
                seminar.date = new Date(seminar.date);
                return seminar;
            });

            this.seminars = seminars;
            this.year = this.years[0];
        },

        components: {
            AppCheckbox,
            AppInput,
            IconArrow,
            IconSortDate,
            IconSortTitle,
            TheSeminarUpload
        }
    };
</script>
