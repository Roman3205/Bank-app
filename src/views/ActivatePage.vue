<script>
import axios from 'axios'

export default {
    data() {
        return {
            mail: '',
            messageReq: '',
            loadingReq: false
        }
    },

    mounted() {

    },

    methods: {
        async checkLink() {
            try {
                this.loadingReq = true
                if(this.mail === '') {
                    this.messageReq = 'Заполните поле'
                    return this.loadingReq = false
                }
                let response = await axios.get('/activate', {params: {
                    link: this.$route.params.link,
                    mail: this.mail
                }})
                this.loadingReq = false
                this.messageReq = response.data.message
                await new Promise(prom => setTimeout(prom, 2000))
                this.messageReq = ''
                this.$router.push({name: 'login'})
            } catch (error) {
                if(error.response && error.response.data.message === 'Некорректная ссылка активации') {
                    this.messageReq = error.response.data.message
                    await new Promise(prom => setTimeout(prom, 2000))
                    this.$router.push('/notfound')
                } else {
                    this.messageReq = error.response.data.message
                    await new Promise(prom => setTimeout(prom, 2000))
                    this.messageReq = ''
                }
            } finally {
                this.loadingReq = false
            }
        },

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
        <form autocomplete="off" class="menu-content" @submit.prevent="checkLink">
            <div class="text-inform mb-2">
                <h2>Подтверждение почты</h2>
                <p class="mt-4">Укажите почту, привязанную к вашему аккаунту, чтобы активировать аккаунт.</p>
            </div>
            <my-input placeholder="Почта" type="email" v-model="mail"></my-input>
            <my-button-reg>Подтвердить</my-button-reg>
        </form>
        <transition name="alert"><div v-if="this.messageReq !== ''" data-67cdadw class="alert text-center" :class="this.messageReq === 'Почта подтверждена' ? 'alert-success' : 'alert-danger'">{{ this.messageReq }}</div></transition>
    </div>
</template>

<style scoped lang="scss">
    @import '@/assets/sass/auth.scss';
    @import '@/assets/sass/alertElem.scss';
    .menu-content {
        height: 380px;
        
        p {
            margin: 0;
            text-align: left;
        }
    }
</style>