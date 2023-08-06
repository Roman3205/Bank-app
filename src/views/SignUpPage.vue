<script>

export default {
    data() {

    },

    mounted() {

    },

    methods: {
        routerAction(evt, goTo) {
            evt.preventDefault()
            this.$router.push({
                name: goTo
            })
        }
    }
}

</script>

<template>
    <div class="container">
        <form autocomplete="off" class="menu-content">
            <h2>Регистрация</h2>
            <div class="input-block">
                <input type="name" class="form-control" placeholder="Ваше имя" autocomplete="off">
            </div>
            <div class="input-block">
                <input type="email" class="form-control" placeholder="Почта" autocomplete="off">
            </div>
            <div class="d-flex input-block">
                <input v-model="tel" type="tel" required pattern="[+][7][9][0-9]{9}" placeholder="Например, +79001234567" class="form-control"><span class="validity"></span>
            </div>
            <div class="input-block">
                <input type="password" class="form-control" placeholder="Пароль" autocomplete="off">
            </div>
            <div class="input-block">
                <input type="password" class="form-control" placeholder="Подтвердите пароль" autocomplete="off">
            </div>
            <button class="btn btn-info" type="submit">Зарегистрироваться</button>
        </form>
    </div>
</template>

<style scoped lang="scss">
    @import '../assets/sass/auth.scss';
    .menu-content {
        height: 635px;
        
        p {
            margin: 0;
            text-align: center;
        }
    }

</style>
