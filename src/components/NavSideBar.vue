<script>

export default {
    data() {

    },

    mounted() {

    },

    methods: {
        routerAction(evt, goTo) {
            this.$router.push({
                name: goTo
            })
        }
    }
}

</script>

<template>
  <div class="container">
    <div class="logo" @click="routerAction($event, 'dashboard')">
        <img src="../assets/images/logo-main.png" width="300" alt="">
    </div>
    <div class="buttons">
        <button class="btn btn-outline-primary"><img src="../assets/images/dashboard.png" width="25" alt="">Главная</button>
        <button class="btn btn-outline-primary"><img src="../assets/images/transactions.png" width="25" alt="">Операции</button>
        <button class="btn btn-outline-primary"><img src="../assets/images/card.png" width="25" alt="">Карты</button>
        <button class="btn btn-outline-primary"><img src="../assets/images/wallet.png" width="25" alt="">Мой кошелек</button>
    </div>
    <div class="dark-mode">
        <button for="switchCheckDefault" class="btn btn-outline-primary"><img src="../assets/images/dark-mode.png" width="25" alt="">
            <label for="switch">
                Темный режим
                <div class="form-check form-switch m-0 mt-1">
                    <input class="form-check-input" type="checkbox" role="switch" id="switch" />
                </div>
            </label>
        </button>
    </div>
    <div class="menu-board">
        <button class="btn btn-outline-primary"><img src="../assets/images/settings.png" width="25" alt="">Помощник</button>
        <button class="btn btn-outline-primary"><img src="../assets/images/logout.png" width="25" alt="">Выйти</button>
    </div>
    <div class="user">
        <div class="img">
            <img src="../assets/images/user.png" width="50" alt="">
        </div>
        <div class="data">
            <h2><b>Роман Романов</b></h2>
            <p>garbromannik@gmail.com</p>
        </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
    @import '../assets/sass/sidebar.scss';
</style>
