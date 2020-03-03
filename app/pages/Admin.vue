<template>
    <div class="Admin App__page">
        <transition-group class="Admin__toasts" name="Fade" tag="div">
            <div class="Toast" v-for="toast in toasts" :class="toast.class" :key="toast.id">{{
                toast.text
            }}</div>
        </transition-group>

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
                    <label>
                        <input type="checkbox" name="raw">
                        {{ $t('raw') }}
                    </label>
                </div>
            </AppForm>
        </section>

        <section class="Admin__section Section">
            <h2 class="Section__title"> {{ $t('set-recruiting') }} </h2>
            <AppForm class="Section__form" action="/recruiting/available" method="post"
                @submit="notify($t('set-recruiting'), $event)">

                <div class="Section__row">
                    <label>
                        <input type="checkbox" name="available">
                        {{ $t('is-recruiting') }}
                    </label>
                </div>
            </AppForm>
        </section>

        <section class="Admin__section Section">
            <h2 class="Section__title"> {{ $t('attributes') }} </h2>
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
                    <label>
                        <input type="checkbox" name="admin">
                        {{ $t('admin') }}
                    </label>

                    <label>
                        <input type="checkbox" name="ignore">
                        {{ $t('ignore') }}
                    </label>
                </div>
            </AppForm>
        </section>
    </div>
</template>

<i18n>
    ko:
        success: '{name} 성공!'
        fail: >
            {name} 실패 ㅠㅠ

            이유: {reason}
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
        set-recruiting: '리크루팅 기간으로 설정'
        is-recruiting: '리크루팅 중입니다.'
        attributes: '사용자 어트리뷰트'
        set-attributes: '사용자 어트리뷰트 추가'
        user-id: '사용자 ID'
        admin: '관리자'
        ignore: '목록에서 표시하지 않음'
        delete-attributes: '어트리뷰트 삭제'
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

        &__row {
            display: flex;
            margin-top: 10px;
        }

        &__desc {
            white-space: pre-line;
        }
    }

    .Admin {
        &__toasts {
            position: fixed;
            top: 100px;
            right: 50px;
        }
    }

    .Toast {
        font-family: var(--theme-font);
        color: var(--alert-foreground-900);
        padding: 10px 20px;
        border-radius: 5px;
        white-space: pre-line;
        margin-top: 10px;

        &--success {
            background: var(--alert-success);
        }

        &--fail {
            background: var(--alert-level-2);
        }
    }
</style>

<script>
    import api from "@/src/api";

    import AppForm from "@/components/AppForm";
    import AppInput from "@/components/AppInput";
    import AppLink from "@/components/AppLink";

    export default {
        data() {
            return {
                attributes: [],
                toasts: []
            };
        },

        methods: {
            notify(name, result) {
                const id = Math.random().toString(36).slice(2);

                if(result.ok) {
                    this.toasts.push({
                        id,
                        text: this.$t('success', { name }),
                        class: 'Toast--success'
                    });
                } else {
                    this.toasts.push({
                        id,
                        text: this.$t('fail', { name, reason: result.reason }),
                        class: 'Toast--fail'
                    });
                }

                setTimeout(() => {
                    const index = this.toasts.findIndex(toast => toast.id === id);
                    if(index >= 0)
                        this.toasts.splice(index, 1);
                }, 3000);
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
            }
        },

        async mounted() {
            await this.fetchAttribute();
        },

        components: {
            AppForm,
            AppInput,
            AppLink
        }
    };
</script>
