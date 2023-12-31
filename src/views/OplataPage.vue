<template>
    <div class="container">
        <form class="oplata-block" v-if="checkObj" @submit.prevent="acceptOplata">
            <div class="logo">
                <img src="@/assets/images/logo-main.png" width="300" alt="">
            </div>
            <h2><b>Введите код подтверждения</b></h2>
            <div class="type">
                <span>Тип:</span>
                <span v-text="this.oplataObj.type === 'waiting-for-shifting' ? 'Перевод' : this.oplataObj.type === 'waiting-for-payment' ? 'Оплата' : ''"></span>
            </div>
            <div class="sum">
                <span>Сумма:</span>
                <span>RUB {{ oplataObj.money }}</span>
            </div>
            <div class="date">
                <span>Дата:</span>
                <span>{{ getDate(oplataObj.createdAt) }}</span>
            </div>
            <div class="card-number">
                <span>Номер карты:</span>
                <span>{{ getCard(oplataObj.recieverCard) }}</span>
            </div>
            <p data-p="ptext">Одноразовый код подтверждения транзакции был отправлен ваш на почту. Проверьте свой почтовый ящик и введите код ниже.</p>
            <my-input-card maxlength="6" placeholder="Одноразовый код" v-model.trim.number="code" class="text-center text-dark pt-1"></my-input-card>
            <my-button-reg data-button="button" type="submit" :disabled="loadingAccept">Отправить</my-button-reg>
        </form>
        <transition name="alert">
            <div 
                v-if="this.acceptMessage !== ''"
                class="alert text-center" 
                data-67cdadw 
                :class="this.acceptMessage === 'Операция подтверждена' ? 'alert-success' : 'alert-danger'">
                {{ acceptMessage }}
            </div>
        </transition>
    </div>
</template>

<script>
import axios from 'axios'
import dayjs from 'dayjs'
import {mapActions} from 'vuex'

    export default {
        mounted() {
            this.loadInfoOplata()
        },

        data() {
            return {
                oplataObj: {},
                code: '',
                acceptMessage: '',
                loadingAccept: undefined,
            }
        },

        computed: {
            checkObj() {
                return Object.keys(this.oplataObj).length != 0
            }
        },

        methods: {
            ...mapActions({
                loadUser: 'mainModule/loadUser'
            }),

            getDate(date) {
                let day = dayjs(date)
                return day.format('DD.MM.YY')
            },

            getCard(card) {
                let cardNum = card.toString().slice(12, 16)
                let modCard = `**** **** **** ${cardNum}`
                return modCard
            },

            async loadInfoOplata() {
                try {
                    let response = await axios.get('/oplata/get', {
                        params: {
                            path: this.$route.params.key
                        }
                    })

                    this.oplataObj = response.data.transaction
                } catch (error) {
                    if(error.response && error.response.data.message !== 'Транзакции не существует') {
                        console.log('Ошибка при отправке запроса на сервер:(', error.response.data)
                    } else if (error.response.data.message === 'Транзакции не существует') {
                        this.$router.push('/notfound')
                    } else {
                        return
                    }
                }
            },

            async acceptOplata() {
                let promReturn = async () => {
                    await new Promise(prom => setTimeout(prom, 1400)).then(() => {
                        this.$router.push('/transactions')
                    })
                }
                try {
                    if(this.code === '') {
                        return this.acceptMessage = 'Заполните поле ввода'
                    }

                    this.loadingAccept = true
                    await axios.post('/transaction/accept', {
                        path: this.$route.params.key,
                        code: this.code
                    }).then(async (response) => {
                        console.log(response.data);
                        if(response.data.data.payload && response.data.data.redirectTo && response.data.data.routePay) {
                            await axios.post(String(response.data.data.routePay), {
                                codePay: response.data.data.payload
                            }).then(() => {
                                window.location.href = String(response.data.data.redirectTo)
                            })
                        } else {
                            this.code = ''
                            this.acceptMessage = 'Операция подтверждена'
                            this.loadingAccept = false

                            await promReturn()

                            this.loadUser()
                        }
                    })
                } catch (error) {
                    if(error.response && error.response.data.message !== 'Транзакции не существует') {
                        console.log('Ошибка при отправке запроса на сервер:(\n', error.response.data)
                        this.acceptMessage = error.response.data.message
                    } else if (error.response.data.errors.length != 0) {
                        console.log('Ошибка при отправке запроса на сервер:(', error.response.data)
                        this.acceptMessage = error.response.data.errors.map(error => error.msg).join(', ')
                        await promReturn()
                    } else if(error.response.data.message === 'Транзакции не существует' || error.response.data.message === 'Операция больше недействительна, так как время на ввод кода закончилось') {
                        this.acceptMessage = error.response.data.message
                        await promReturn()
                    } else {
                        return
                    }
                } finally {
                    this.loadingAccept = false
                    await new Promise(prom => setTimeout(prom, 2400)).then(() => {
                        this.acceptMessage = ''
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/sass/oplata.scss';
    @import '@/assets/sass/alertElem.scss';

</style>