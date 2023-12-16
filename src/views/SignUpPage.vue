<script>
import InfoBlock from '@/components/InfoBlock.vue'
import axios from 'axios'

export default {
    data() {
        return {
            name: '',
            mail: '',
            password: '',
            passwordConfirm: '',
            regMessage: '',
            loadingSignUp: undefined
        }
    },

    components: {
        InfoBlock
    },

    methods: {
        async registerAction() {
            try {
                this.loadingSignUp = true
                this.regMessage = ''

                if(this.regValid) {
                    this.regMessage = 'Произошла ошибка в заполнении'
                    return this.loadingSignUp = false
                } else if(this.password !== this.passwordConfirm) {
                    this.regMessage = 'Пароли не совпадают'
                    return this.loadingSignUp = false
                }

                await axios.post('/registration', {
                    name: this.name,
                    mail: this.mail,
                    password: this.password
                })

                this.name = ''
                this.mail = ''
                this.password = ''
                this.loadingSignUp = false
                this.regMessage = 'Успешная регистрация, проверьте почту'

                await new Promise(prom => setTimeout(prom, 4000)).then(() => {
                    this.$router.push('/login')
                })

            } catch (error) {
                if(error.response) {
                    this.regMessage = error.response.data.message
                    console.log('Ошибка при отправке запроса на сервер:(', error)
                    return this.loadingSignUp = false
                } else if (error.response.data.errors.length != 0) {
                    this.regMessage = error.response.data.errors.map(error => error.msg).join(', ')
                    console.log('Ошибка при отправке запроса на сервер:(', error)
                    return this.loadingSignUp = false
                }else {
                    return
                }
            } finally {
                await new Promise(prom => setTimeout(prom, 2400)).then(() => {
                    this.regMessage = ''
                    this.loadingSignUp = false
                })
            }
        },

        routerAction(evt, goTo) {
            evt.preventDefault()
            this.$router.push({
                name: goTo
            })
        }
    },

    computed: {
        regValid() {
            return this.name === '' || this.password === '' || this.mail === '' || this.password.length < 5 || this.name.length < 2 || this.password.length > 32
        }
    }
}

</script>

<template>
    <div class="row gap-5">
        <div class="container">
            <form @submit.prevent="registerAction" autocomplete="off" class="menu-content">
                <h2>Регистрация</h2>
                <my-input v-model="name" type="text" placeholder="Ваше имя"></my-input>
                <my-input v-model="mail" type="email" placeholder="Почта"></my-input>
                <my-input v-model="password" type="password" placeholder="Пароль"></my-input>
                <my-input v-model="passwordConfirm" type="password" placeholder="Подтвердите пароль"></my-input>
                <my-button-reg :disabled="loadingSignUp">Зарегистрироваться</my-button-reg>
            </form>
            <transition name="alert"><div v-if="this.regMessage !== ''" data-67cdadw class="alert text-center" :class="this.regMessage === 'Успешная регистрация, проверьте почту' ? 'alert-success' : 'alert-danger'">{{ regMessage }}</div></transition>
        </div>
        <info-block></info-block>
    </div>
</template>

<style scoped lang="scss">
    @import '@/assets/sass/auth.scss';
    @import '@/assets/sass/alertElem.scss';

    .alert {
        position: fixed;
        top: 30px;
        left: 530px;
        right: 530px;
        width: 300px;
    }

    .menu-content {
        height: 570px;
        
        p {
            margin: 0;
            text-align: center;
        }
    }

</style>
