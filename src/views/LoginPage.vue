<script>
import InfoBlock from '@/components/InfoBlock.vue'
import axios from 'axios'
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            mail: '',
            password: '',
            loginMessage: '',
            loadingLogin: false
        }
    },

    components: {
        InfoBlock
    },

    methods: {
        ...mapActions({
            loadUser: 'mainModule/loadUser'
        }),

        routerAction(evt, goTo) {
            evt.preventDefault()
            this.$router.push({
                name: goTo
            })
        },

        async loginAction() {
            try {
                this.loginMessage = ''
                this.loadingLogin = true

                if(this.loginValid) {
                    this.loginMessage = 'Произошла ошибка в заполнении'
                    return this.loadingLogin = false
                }

                await axios.post('/logout')
                this.$cookies.remove('cookie-auth', '/', '')

                let response = await axios.post('/login', {
                    mail: this.mail,
                    password: this.password
                })

                this.loadingLogin = false
                this.loginMessage = 'Вы вошли в аккаунт'
        
                await new Promise(prom => setTimeout(prom, 900)).then(() => {
                    this.$cookies.set('token', response.data.data.refreshToken, '5d', '/', '', true, 'none')
                    // this.$cookies.set()
                    localStorage.setItem('token', response.data.data.accessToken)
                    this.$router.push('/')
                    this.loadUser()
                })

            } catch (error) {
                if(error.response) {
                    this.loginMessage = error.response.data.message
                    console.log('Ошибка при отправке запроса на сервер:(', error)
                    return this.loadingLogin = false
                } else if (error.response?.data.errors.length != 0) {
                    this.loginMessage = error.response?.data.errors.map(error => error.msg).join(', ')
                    console.log('Ошибка при отправке запроса на сервер:(', error)
                    return this.loadingLogin = false
                }else {
                    return
                }
            } finally {
                await new Promise(prom => setTimeout(prom, 2400)).then(() => {
                    this.loginMessage = ''
                    this.loadingLogin = false
                })
            }
        }
    },

    computed: {
        loginValid() {
            return this.password === '' || this.mail === ''
        }
    }
}

</script>

<template>
    <div class="row gap-5">
        <div class="container">
            <form @submit.prevent="loginAction" autocomplete="off" class="menu-content">
                <h2>Вход в МикроБанк</h2>
                <my-input v-model="mail" placeholder="Почта" type="email"></my-input>
                <div>
                    <my-input v-model="password" type="password" placeholder="Пароль" autocomplete="new-password"></my-input>
                    <p class="mt-2" @click="routerAction($event, 'restore')">Не помню пароль</p>
                </div>
                <my-button-reg type="submit" class="no-secondary" :disabled="loadingLogin">Войти</my-button-reg>
                <my-button-reg type="button" class="btn-secondary" @click="routerAction($event, 'register')">Стать клиентом</my-button-reg>
            </form>
            <transition name="alert"><div v-if="this.loginMessage !== ''" data-67cdadw class="alert text-center" :class="this.loginMessage === 'Вы вошли в аккаунт' ? 'alert-success' : 'alert-danger'">{{ loginMessage }}</div></transition>
        </div>
        <info-block></info-block>
    </div>
</template>

<style scoped lang="scss">
    @import '@/assets/sass/auth.scss';
    @import '@/assets/sass/alertElem.scss';
</style>
