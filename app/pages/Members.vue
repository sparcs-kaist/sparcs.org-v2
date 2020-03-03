<template>
    <div class="Members App__page">
        <h1 class="App__title">Members</h1>
        <p class="Members__desc">
            {{ $t('desc') }}
        </p>

        <div class="Members__members">
            <div class="Member" v-for="member in members" :id="member.id">
                <div class="Member__info">
                    <h3 class="Member__name"> {{member.name}} </h3>
                    <span class="Member__id"> {{member.id}} </span>
                </div>
            </div>
        </div>
    </div>
</template>

<i18n>
    ko:
        desc: >
            SPARCS의 개발자와 디자이너들을 소개합니다.
</i18n>

<style scoped>
    .Members {
        &__desc {
            font-family: var(--theme-font);
            color: var(--grey-200);
        }
    }
</style>

<script>
    import api from "@/src/api";

    export default {
        data() {
            return {
                members: []
            };
        },

        async beforeRouteEnter(to, from, next) {
            const { members } = await api('/member');

            next(vm => {
                vm.members = members;
            });
        },

        components: {
        }
    };
</script>
