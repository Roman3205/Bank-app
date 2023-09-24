<template>
    <div class="container" v-once>
        <h2>Добро пожаловать в МикроБанк - в ваш<br> надежный онлайн банк!</h2>
        <img src="@/assets/images/auth.png" width="500" alt="">
        <p>Зарегистрируйтесь или войдите в свой аккаунт, чтобы получить доступ к удобным<br> и безопасным банковским услугам. МикроБанк предлагает широкий спектр<br> услуг для управления вашими финансами, включая переводы, оплату счетов,<br> кредитные продукты и многое другое.</p>
    </div>
</template>

<style scoped lang="scss">
@import '@/assets/sass/blackmode.scss';

    .container {
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 20px;

        p {
            margin: 0;
        }
    }

    @media screen and (max-width: 900px) {
        img {
            width: 330px;
        }
    }

</style>