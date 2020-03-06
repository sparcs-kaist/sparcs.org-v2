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
                </div>
                <div class="Seminar__files">
                    <a class="Seminar__file" v-for="source in seminar.sources" :href="source">
                        {{ getFileName(source) }}
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<i18n>
    ko:
        search: '검색'
        go-back: '뒤로가기'
        desc: '스팍스에서 진행되었던 세미나의 발표자료입니다.'
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
            background: var(--grey-800);
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
            max-width: 300px;
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

    import AppInput from "@/components/AppInput";
    import IconArrow from "@/images/IconArrow?inline";

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
                            (v1, v2) => v1.title.localeCompare(v2.title)
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
                            return source.toLowerCase().includes(lowerCaseQuery);
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
            }
        },

        methods: {
            getFileName(source) {
                return source.split('/').pop();
            },

            stringifyDate(date) {
                const dateObj = new Date(date);
                let month = `${dateObj.getMonth() + 1}`;
                let day = `${dateObj.getDate()}`;

                month = month.length < 2 ? `0${month}` : month;
                day = day.length < 2 ? `0${day}` : day;

                return `${dateObj.getFullYear()}-${month}-${day}`;
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
            AppInput,
            IconArrow
        }
    };
</script>
