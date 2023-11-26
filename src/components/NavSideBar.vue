<script>
import { mapState, mapActions, mapMutations } from 'vuex'
import axios from 'axios'

export default {
    methods: {
        ...mapActions({
            changeTheme: 'changeTheme',
            changeThemeDefault: 'changeThemeDefault'
        }),

        ...mapMutations({
            setUser: 'mainModule/setUser'
        }),

        changeColorTheme(evt) {
            if(evt.target.checked == true) {
                this.changeTheme()
            } else if(evt.target.checked == false) {
                this.changeThemeDefault()
            } else {
                return
            }
        },

        routerAction(evt, goTo) {
            evt.preventDefault()
            this.$router.push({
                name: goTo
            })
        },

        async logOut() {
            try {
                await axios.post('/logout')

                await new Promise(prom => setTimeout(prom, 900)).then(() => {
                    this.$cookies.remove('cookie-auth', '/', '')
                    this.setUser({})
                    this.$router.push('/login')
                })
            } catch (error) {
                console.log('Произошла ошибка при отправке запроса на сервер');
            }
        }
    },

    computed: {
        ...mapState({
            color: state => state.color,
            backgroundBlock: state => state.backgroundBlock,
            background: state => state.background,
            sideBarColor: state => state.sideBarColor,
            user: state => state.mainModule.user
        }),

        isDark() {
            return localStorage['colorTheme'] === 'dark'
        }
    }
}
</script>

<template>
  <div class="container">
    <div class="logo">
        <img src="@/assets/images/logo-main.png" width="300" alt="">
    </div>
    <div class="buttons">
        <my-button-bar @click="routerAction($event, 'dashboard')" :class="{'active': this.$route.name === 'dashboard'}">
            <img src="@/assets/images/dashboard.png" width="25" alt="">
            Главная
        </my-button-bar>
        <my-button-bar @click="routerAction($event, 'transactions')" :class="{'active': this.$route.name === 'transactions'}">
            <img src="@/assets/images/transactions.png" width="25" alt="">
            Платежи и операции
        </my-button-bar>
        <my-button-bar @click="routerAction($event, 'cards')" :class="{'active': this.$route.name === 'cards'}">
            <img src="@/assets/images/card.png" width="25" alt="">
            Карты
        </my-button-bar>
    </div>
    <div class="dark-mode">
        <my-button-bar>
            <img src="@/assets/images/dark-mode.png" width="25" alt="">
            <label for="switch">
                Темный режим
                <div class="form-check form-switch m-0 mt-1">
                    <input :checked="isDark" @input="changeColorTheme($event)" class="form-check-input" type="checkbox" role="switch" id="switch" />
                </div>
            </label>
        </my-button-bar>
    </div>
    <div class="menu-board">
        <my-button-bar @click="routerAction($event, 'support')" :class="{'active': this.$route.name === 'support'}">
            <img src="@/assets/images/settings.png" width="25" alt="">
            Помощник
        </my-button-bar>
        <my-button-bar @click.prevent="logOut">
            <img src="@/assets/images/logout.png" width="25" alt="">
            Выйти
        </my-button-bar>
    </div>
    <div class="user">
        <div class="img">
            <img src="@/assets/images/user.png" width="40" alt="">
        </div>
        <div class="data" v-if="user">
            <h2><b>{{ user.firstName }}</b></h2>
            <p>{{ user.mail }}</p>
        </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
    @import '@/assets/sass/sidebar.scss';
    * {
        color: v-bind(sideBarColor);
    }

    .user .data h2 b, .user .data p {
        color: v-bind(color);
    }

    .dark-mode label {
        transition: 0.55s;

        &:hover {
            color: #fff;
        }
    }

</style>