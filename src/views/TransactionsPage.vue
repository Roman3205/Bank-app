<script>
import axios from 'axios'
import {mapState} from 'vuex'

export default {
    data() {
        return {
            paymentWayTel: false,
            paymentWayCard: true,
            payTelFrom: '',
            payTelTo: '',
            payCardFrom: '',
            payCardTo: '',
            createMessage: '',
            loadingCreate: undefined,
            money: '',
        }
    },

    methods: {
        selectPaymentWay(way) {
            if(way === 'card') {
                this.paymentWayTel = false
                this.payTelFrom = ''
                this.payTelTo = ''
                this.paymentWayCard = true
            } else if(way === 'tel') {
                this.paymentWayCard = false
                this.payCardFrom = ''
                this.payCardTo = ''
                this.paymentWayTel = true
            } else {
                return
            }
        },

        async createTransaction() {
            try {
                this.createMessage = ''
                this.loadingCreate = true

                if(this.createValid) {
                    this.createMessage = 'Произошла ошибка в заполнении'
                    return this.loadingCreate = false
                }

                let response = await axios.post('/transaction/create', {
                    money: this.money,
                    fromCard: this.payCardFrom,
                    toCard: this.payCardTo
                })
                
                let cookieRoute = response.data.oplata

                this.money = ''
                this.payCardFrom = ''
                this.payCardTo = ''

                this.loadingCreate = false
                this.createMessage = 'Перенаправляем вас на страницу подтверждения'
                await new Promise(prom => setTimeout(prom, 1200)).then(() => {
                    this.$router.push({
                        name: 'oplata',
                        params: {
                            key: cookieRoute
                        }
                    })
                })

            } catch (error) {
                if(error.response) {
                    this.createMessage = error.response.data
                    console.log('Ошибка при отправке запроса на сервер:(', error)
                    return this.loadingCreate = false
                } else {
                    return this.loadingCreate = false
                }
            }
        }
    },

    computed: {
        ...mapState({
            user: state => state.mainModule.user
        }),

        createValid() {
            return this.payCardFrom === '' || this.payCardTo === '' || this.money === ''
        }
    }
}

</script>

<template>
    <div class="container">
        <form class="payments" @submit.prevent="createTransaction">
            <h2><b>Платежи</b></h2>
            <div class="choice">
                <label class="with-card" for="checkCard" @click="selectPaymentWay('card')">
                    <div class="top">
                        <img src="@/assets/images/card.png" alt="">
                        <div class="form-check">
                            <input class="form-check-input" name="choice" type="radio" id="checkCard" :checked="paymentWayCard">
                        </div>
                    </div>
                    <p>По номеру карты</p>
                </label>
                <label class="with-tel" for="checkTel" @click="selectPaymentWay('tel')">
                    <div class="top">
                        <img src="@/assets/images/tel.png" alt="" style="width: 23.5px;">
                        <div class="form-check">
                            <input class="form-check-input" name="choice" type="radio" id="checkTel" :checked="paymentWayTel">
                        </div>
                    </div>
                    <p>По номеру телефона</p>
                </label>
            </div>
            <h3 class="mt-4"><b>Оформление перевода</b></h3>
            <div class="payment-to" v-if="paymentWayCard">
                <div class="from">
                    <h3><b>С карты</b></h3>
                    <input v-model.trim="payCardFrom" type="number" required pattern="[0-9]{16}" class="form-control" maxlength="16" placeholder="Номер вашей карты">
                </div>
                <i class="fa fa-chevron-right"></i>
                <div class="to">
                    <h3><b>На карту</b></h3>
                    <input v-model.trim="payCardTo" type="number" required pattern="[0-9]{16}" class="form-control" maxlength="16" placeholder="Номер карты получателя">
                </div>
            </div>
            <div class="payment-to" v-if="paymentWayTel">
                <div class="from">
                    <h3><b>С карты (по телефону)</b></h3>
                    <input v-model.trim.number="payTelFrom" type="tel" required pattern="[0-9]{16}" class="form-control" maxlength="16" placeholder="Номер привязанного телефона">
                </div>
                <i class="fa fa-chevron-right"></i>
                <div class="to">
                    <h3><b>На карту (по телефону)</b></h3>
                    <input v-model.trim="payTelTo" type="tel" required pattern="[0-9]{16}" class="form-control" maxlength="16" placeholder="Номер телефона получателя">
                </div>
            </div>
            <my-input-card min="5" max="10000" v-model.trim.number="money" placeholder="Сумма, руб." type="number"></my-input-card>
            <hr>
            <div class="submit">
                <p class="text-secondary">Нажимая на кнопку «Перевести», вы соглашаетесь<br> с условиями публичной оферты</p>
                <my-button-reg type="submit" :disabled="loadingCreate">Перевести</my-button-reg>
            </div>
            <transition name="alert"><div v-if="this.createMessage !== ''" class="alert text-center" data-67cdadw :class="this.createMessage === 'Перенаправляем вас на страницу подтверждения' ? 'alert-success' : 'alert-danger'">{{ createMessage }}</div></transition>
        </form>
        <div class="transactions-history">
            <div class="nav-info">
                <h2 class="mb-3"><b>Операции</b><h5 class="text-secondary">(всего 3 операции по данной карте)</h5></h2>
                <div class="d-block"><div class="d-flex gap-3 align-items-center"><h4 style="margin: 0;">По карте:</h4><img src="@/assets/images/cardWallet.png" width="50" alt=""></div>
                    <my-select class="mt-1" v-model.trim="selectedCard" @update:modelValue="getSelectedCard" :cards="user.cards"></my-select>
                </div>
            </div>
            <div class="blocks">
                <div class="titles">
                    <p>Имя</p>
                    <p>Дата</p>
                    <p>Номер транзакции</p>
                    <p>Переведено</p>
                    <p>Статус</p>
                </div>
                <div class="transactions-block">
                    <div class="transaction" v-for="index in 3">
                        <div class="name">
                            <img src="@/assets/images/user.png" width="30" alt="">
                            <p><b>Роман</b></p>
                        </div>
                        <div class="date">
                            5 авг. в 19:30 2023
                        </div>
                        <div class="id">
                            ASF3213221FS
                        </div>
                        <div class="money rub-m">
                            <b>13213</b><i class="fa fa-rub"></i>
                        </div>
                        <div class="status">
                            <p class="text-success">Выполнено</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import '@/assets/sass/transaction.scss';
    @import '@/assets/sass/blackmode.scss';
    @import '@/assets/sass/alertElem.scss';

</style>
