<template>
    <div class="Index">
        <TheLanding />
        <TheServices class="Index__section" />
        <TheActivities class="Index__section" />
        <TheMembers class="Index__section" />
    </div>
</template>


<style scoped>
    .Index {
        &__section {
            width: 100%;
            max-width: 900px;
            box-sizing: border-box;
            padding: 0 30px;
            margin: 0 auto;
            margin-top: 50px;
        }

        & >>> &__title {
            margin-left: -15px;
            font-family: var(--title-font);
            font-weight: 300;
            font-size: 2.3rem;
            text-transform: uppercase;
        }
    }

    @media (min-width: 1280px) {
        .Index {
            & >>> &__title {
                margin-left: -40px;
            }
        }
    }
</style>

<script>
    import api from "@/src/api";
    import store from "@/src/store";

    import TheActivities from "@/components/TheActivities";
    import TheLanding from "@/components/TheLanding";
    import TheMembers from "@/components/TheMembers";
    import TheServices from "@/components/TheServices";

    export default {
        async beforeRouteEnter(route, from, next) {
            const { code, state } = route.query;

            if(code && state) {
                await store.dispatch('finalizeAuth', { code, state });
                return next('/');
            }

            next();
        },

        components: {
            TheActivities,
            TheLanding,
            TheMembers,
            TheServices
        }
    };
</script>
