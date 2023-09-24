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
            <div class="text-inform mb-2">
                <h2>Восстановление пароля</h2>
                <p class="mt-4">Укажите почту, привязанную к вашему аккаунту, чтобы восстановить доступ к нему.</p>
            </div>
            <my-input placeholder="Почта" type="email"></my-input>
            <my-button-reg>Восстановить пароль</my-button-reg>
        </form>
    </div>
</template>

<style scoped lang="scss">
    @import '@/assets/sass/auth.scss';
    .menu-content {
        height: 380px;
        
        p {
            margin: 0;
            text-align: left;
        }
    }
</style>