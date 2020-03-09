<template>
    <form class="SeminarUpload" @submit.prevent>
        <h1 class="SeminarUpload__title"> {{ $t('seminar-upload') }} </h1>
        <div class="SeminarUpload__row">
            <AppInput class="SeminarUpload__fill" v-model="title" :placeholder="$t('title')" bind />
        </div>

        <div class="SeminarUpload__row">
            <AppInput v-model="speaker" :placeholder="$t('speaker')" bind />
            <AppInput v-model="date" type="date" bind />
        </div>

        <h2 class="SeminarUpload__hint"> {{ $t('select-files') }} </h2>
        <transition-group name="FadeMove" class="SeminarUpload__files" tag="div">
            <div class="SeminarUpload__file File" v-for="file in files" :key="file.id">
                <span class="File__title"> {{ file.name }} </span>
                <button type="button" @click="deleteFile(file.id)" class="File__delete"> {{ $t('delete') }} </button>
            </div>
        </transition-group>

        <div class="SeminarUpload__row">
            <label class="SeminarUpload__label">
                <input class="SeminarUpload__input" type="file" ref="upload" multiple @change="addFile">
                <span class="SeminarUpload__label-text"> {{ $t('select-files') }} </span>
            </label>
        </div>

        <h2 class="SeminarUpload__hint"> {{ $t('add-links') }} </h2>
        <transition-group name="FadeMove" class="SeminarUpload__files" tag="div">
            <div class="SeminarUpload__file File" v-for="link in links" :key="link.id">
                <span class="File__title"> {{ link.name }} </span>
                <button type="button" @click="deleteLink(link.id)" class="File__delete"> {{ $t('delete') }} </button>
            </div>
        </transition-group>

        <div class="SeminarUpload__row">
            <AppInput v-model="linkName" :placeholder="$t('link-name')" bind />
            <AppInput class="SeminarUpload__fill" v-model="linkUrl" :placeholder="$t('link-url')" bind />
            <AppLink button @click="addLink">
                {{ $t('add-link') }}
            </AppLink>
        </div>

        <h2 class="SeminarUpload__hint"> {{ $t('submit') }} </h2>
        <div class="SeminarUpload__row SeminarUpload__submit-row">
            <AppLink button @click="upload">
                {{ $t('submit') }}
            </AppLink>
        </div>

        <transition name="Fade">
            <div class="SeminarUpload__status" v-if="uploading">
                <span> {{ $t('uploading') }} </span>
                <div class="SeminarUpload__progress" :style="progressStyle"></div>
            </div>
        </transition>
    </form>
</template>

<i18n>
    ko:
        seminar-upload: '세미나 업로드'
        title: '제목'
        speaker: '발표자'
        date: '발표일자'
        select-files: '파일 선택'
        delete: '삭제'
        submit: '업로드'
        uploading: '업로드 중입니다...'
        add-links: '링크 추가'
        add-link: '링크 추가'
        link-name: '링크 이름'
        link-url: 'https://'
</i18n>

<style scoped>
    .SeminarUpload {
        &__title {
            font-family: var(--theme-font);
            color: var(--grey-200);
        }

        &__hint {
            font-family: var(--theme-font);
            font-size: 1.25rem;
            font-weight: 700;
            color: var(--grey-200);
            margin: 0;
            margin-top: 20px;
            margin-bottom: 10px;
        }

        &__fill {
            flex: 1;
        }

        &__row {
            display: flex;
            margin: 5px 0;

            & > * {
                margin: 5px;
                flex-wrap: wrap;
            }
        }

        &__files {
            position: relative;
            display: flex;
            flex-direction: column;
            font-family: var(--theme-font);
            color: var(--grey-200);
        }

        &__file {
            width: 100%;
            margin-left: 5px;
        }

        &__input {
            width: 6rem;
            opacity: .001;
            padding: 10px 15px;
        }

        &__label {
            cursor: default;
            position: relative;
        }

        &__label-text {
            pointer-events: none;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
        }

        &__submit-row {
            /* justify-content: flex-end; */
        }

        &__status {
            color: var(--grey-200);
            font-family: var(--theme-font);
        }

        &__progress {
            background: var(--theme-500);
            height: 3px;
            margin-top: 10px;
        }
    }

    .File__delete, .SeminarUpload__label {
        margin: 5px 5px;

        border: none;
        outline: none;
        color: var(--grey-200);
        font-family: var(--theme-font);
        font-size: 1.05rem;

        border-radius: 5px;
        cursor: pointer;
        background: var(--grey-780);
        transition: background .4s ease;

        &:hover {
            background: var(--grey-800);
        }
    }

    .File {
        display: flex;
        align-items: center;
        justify-content: space-between;

        &__delete {
            padding: 8px 12px;
        }

        &__title {
            white-space: nowrap;
            flex: 1;
            width: 0;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>

<script>
    import api from "@/src/api";
    import formatDate from "@/src/formatDate";

    import AppInput from "@/components/AppInput";
    import AppLink from "@/components/AppLink";

    export default {
        data() {
            return {
                title: '',
                speaker: '',
                date: formatDate(new Date()),
                files: [],
                linkName: '',
                linkUrl: '',
                links: [],
                uploading: false,
                progress: 0
            };
        },

        methods: {
            addFile() {
                const files = [...this.$refs.upload.files].map(file => {
                    file.id = Math.random().toString(36).slice(2);
                    return file;
                });

                this.files = this.files.concat(files).slice(0, 16);
                this.$refs.upload.value = '';
            },

            deleteFile(id) {
                this.files = this.files.filter(v => v.id !== id);
            },

            addLink() {
                this.links.push({
                    id: Math.random().toString(36).slice(2),
                    name: this.linkName,
                    url: this.linkUrl
                });
            },

            deleteLink(id) {
                this.links = this.links.filter(v => v.id !== id);
            },

            async upload() {
                const options = {
                    onUploadProgress: e => {
                        this.progress = Math.floor((e.loaded * 100) / e.total);
                    }
                };

                const linksEncoded = this.links.reduce((prev, curr) => {
                    prev[curr.name] = curr.url;
                    return prev;
                }, {});

                const formData = new FormData();
                formData.append('title', this.title);
                formData.append('speaker', this.speaker);
                formData.append('date', new Date(this.date).getTime());
                formData.append('links', JSON.stringify(linksEncoded));
                this.files.forEach(file => {
                    formData.append('content', file);
                });

                this.uploading = true;
                this.progress = 0;

                const result = await api('/seminar', 'post', formData, options);
                this.$store.dispatch('toast/addToastFromApi', {
                    result,
                    name: this.$t('seminar-upload')
                });

                this.uploading = false;
                this.files = [];
                this.links = [];
                this.title = '';
                this.speaker = '';
                this.linkName = '';
                this.linkUrl = '';
            }
        },

        computed: {
            progressStyle() {
                return { width: `${this.progress}%` };
            }
        },

        components: {
            AppInput,
            AppLink
        }
    };
</script>
