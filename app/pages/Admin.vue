<template>
    <div class="Admin App__page">
        <h1 class="App__title"> {{ $t('admin-page') }} </h1>
        <section class="Admin__section Section">
            <h2 class="Section__title"> {{ $t('add-notification') }} </h2>
            <AppForm class="Section__form" action="/notification" method="post"
                @submit="notify($t('add-notification'), $event)">

                <div class="Section__row">
                    <AppInput name="title" :placeholder="$t('title')" />
                </div>

                <div class="Section__row">
                    <textarea name="content" :placeholder="$t('content')"></textarea>
                </div>

                <div class="Section__row">
                    <select name="level">
                        <option value="0"> {{ $t('alert-0') }}</option>
                        <option value="1"> {{ $t('alert-1') }}</option>
                        <option value="2"> {{ $t('alert-2') }}</option>
                        <option value="3"> {{ $t('alert-3') }}</option>
                    </select>
                </div>

                <div class="Section__row">
                    <AppCheckbox name="raw">
                        {{ $t('raw') }}
                    </AppCheckbox>
                </div>
            </AppForm>
        </section>

        <section class="Admin__section Section">
            <h2 class="Section__title"> {{ $t('set-recruiting') }} </h2>
            <AppForm class="Section__form" action="/recruiting/available" method="post"
                @submit="notify($t('set-recruiting'), $event)">

                <div class="Section__row">
                    <AppCheckbox name="available">
                        {{ $t('is-recruiting') }}
                    </AppCheckbox>
                </div>
            </AppForm>
        </section>

        <section class="Admin__section Section">
            <h2 class="Section__title"> {{ $t('members') }} </h2>
            <h3 class="Section__title"> {{ $t('attributes') }} </h3>
            <div class="Admin__attributes" v-for="attribute in attributes" :key="attribute.id">
                <div class="Attribute">
                    <span class="Attribute__id"> {{ attribute.id }} </span>
                    <ul class="Attribute__tags">
                        <li class="Attribute__tag" v-if="attribute.admin">
                            {{ $t('admin') }}
                        </li>

                        <li class="Attribute__tag" v-if="attribute.ignore">
                            {{ $t('ignore') }}
                        </li>
                    </ul>
                    <AppLink class="Attribute__delete" button @click="deleteAttribute(attribute.id)">
                        {{ $t('delete-attributes') }}
                    </AppLink>
                </div>
            </div>

            <h3 class="Section__title"> {{ $t('set-attributes') }} </h3>
            <AppForm class="Section__form" action="/member/attribute" method="post"
                @submit="updateAttribute">

                <div class="Section__row">
                    <AppInput name="userId" :placeholder="$t('user-id')" />
                </div>

                <div class="Section__row">
                    <AppCheckbox name="admin">
                        {{ $t('admin') }}
                    </AppCheckbox>

                    <AppCheckbox name="ignore">
                        {{ $t('ignore') }}
                    </AppCheckbox>
                </div>
            </AppForm>

            <h3 class="Section__title"> {{ $t('refresh-member') }} </h3>
            <AppForm class="Section__form" action="/member/refresh" method="post"
                @submit="notify($t('refresh-member'), $event)">

                <div class="Section__row">
                    <AppInput name="ldapId" :placeholder="$t('ldap-id')" />
                    <AppInput name="ldapPw" type="password" :placeholder="$t('ldap-pw')" />
                </div>
            </AppForm>
        </section>

        <section class="Admin__section Section">
            <h2 class="Section__title"> {{ $t('delete-seminar') }} </h2>
            <div class="Section__row">
                <AppInput v-model="seminarId" :placeholder="$t('seminar-id')" bind/>

                <AppLink class="Section__submit" button @click="deleteSeminar">
                    {{ $t('delete-seminar') }}
                </AppLink>
            </div>
        </section>
    </div>
</template>

<i18n>
    ko:
        admin-page: '관리자 페이지'
        notification: '공지'
        add-notification: '공지 추가'
        title: '제목'
        content: '내용'
        raw: 'HTML'
        alert-0: '수수한 알림'
        alert-1: '조금 수수한 알림'
        alert-2: '조금 화려한 알림'
        alert-3: '화려한 알림'
        members: '사용자 설정'
        set-recruiting: '리크루팅 기간으로 설정'
        is-recruiting: '리크루팅 중입니다.'
        attributes: '사용자 어트리뷰트'
        set-attributes: '사용자 어트리뷰트 추가'
        user-id: '사용자 ID'
        admin: '관리자'
        ignore: '목록에서 표시하지 않음'
        delete-attributes: '어트리뷰트 삭제'
        refresh-member: '사용자 목록 새로고침'
        refresh: '새로고침'
        ldap-id: 'LDAP 아이디'
        ldap-pw: 'LDAP 비밀번호'
        delete-seminar: '세미나 삭제'
        seminar-id: '세미나 ID'
</i18n>

<style scoped>
    .Attribute {
        margin-bottom: 30px;
    }

    .Section {
        margin-top: 50px;

        * {
            font-family: var(--theme-font);
        }

        &__title {
            font-family: var(--title-font);
            font-size: 1.6rem;
        }

        h3&__title {
            font-size: 1.4rem;
        }

        &__row {
            display: flex;
            align-items: center;
            margin-top: 10px;
        }

        &__desc {
            white-space: pre-line;
        }
    }
</style>

<script>
    import api from "@/src/api";

    import AppCheckbox from "@/components/AppCheckbox";
    import AppForm from "@/components/AppForm";
    import AppInput from "@/components/AppInput";
    import AppLink from "@/components/AppLink";

    export default {
        data() {
            return {
                attributes: [],
                seminarId: ''
            };
        },

        methods: {
            notify(name, result) {
                this.$store.dispatch('toast/addToastFromApi', { name, result });
            },

            async fetchAttribute() {
                const { attributes } = await api('/member/attribute');
                this.attributes = attributes;
            },

            async updateAttribute(event) {
                await this.fetchAttribute();
                this.notify(this.$t('set-attributes'), event);
            },

            async deleteAttribute(id) {
                const result = await api(`/member/attribute/${id}`, 'delete');
                await this.fetchAttribute();
                this.notify(this.$t('delete-attributes'), result);
            },

            async refresh() {
                const result = await api('/member/refresh', 'post');
                this.notify(this.$t('refresh-member'), result);
            },

            async deleteSeminar() {
                const result = await api(`/seminar/${this.seminarId}`, 'delete');
                await this.notify(this.$t('delete-seminar'), result);
            }
        },

        async mounted() {
            await this.fetchAttribute();
        },

        components: {
            AppCheckbox,
            AppForm,
            AppInput,
            AppLink
        }
    };
</script>
