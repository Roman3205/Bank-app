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
            <h2>Вход в МикроБанк</h2>
            <div class="input-block">
                <input type="email" class="form-control" placeholder="Почта" autocomplete="off">
                
            </div>
            <div class="input-block">
                <input type="password" class="form-control" placeholder="Пароль" autocomplete="new-password">
                <p>Не помню пароль</p>
            </div>
            <button class="btn btn-info" type="submit">Войти</button>
            <button class="btn btn-secondary" @click="routerAction($event, 'register')">Стать клиентом</button>
        </form>
    </div>
</template>

<style scoped lang="scss">
    @import '../assets/sass/auth.scss';
</style>
