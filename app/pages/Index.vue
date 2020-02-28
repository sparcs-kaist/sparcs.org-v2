<template>
    <div class="Index">
        <TheLanding />
        <TheNotifications class="Index__section" />
        <TheServices class="Index__section" />
        <TheActivities class="Index__section" />
    </div>
</template>


<style scoped>
    .Index {
        &__section {
            width: 100%;
            max-width: 900px;
            box-sizing: border-box;
            padding: 0 20px;
            margin: 0 auto;
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
    import TheActivities from "@/components/TheActivities";
    import TheLanding from "@/components/TheLanding";
    import TheNotifications from "@/components/TheNotifications";
    import TheServices from "@/components/TheServices";

    export default {
        components: {
            TheActivities,
            TheLanding,
            TheNotifications,
            TheServices
        }
    };
</script>
