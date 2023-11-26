<script>
import axios from 'axios'
import {mapState} from 'vuex'
import dayjs from 'dayjs'

export default {
    data() {
        return {
            payCardFrom: '',
            payCardTo: '',
            createMessage: '',
            loadingCreate: undefined,
            money: '',
            selectedCard: '',
            card: {}
        }
    },

    methods: {
        getTime(date) {
            let day = dayjs(date)
            return day.format('D MMMM H:mm')
        },

        async getSelectedCard() {
            try {
                if(this.selectedCard === '') {
                    return
                }

                let response = await axios.get('/card/get', {
                    params: {
                        cardNumber: this.selectedCard,
                        compressed: false
                    }
                })

                this.card = {...response.data}
            } catch (error) {
                if(error.response) {
                    console.log('Ошибка при отправке запроса на сервер:(', error.response)
                } else {
                    return
                }
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
            } finally {
                await new Promise(prom => setTimeout(prom, 2400)).then(() => {
                    this.createMessage = ''
                })
            }
        }
    },

    computed: {
        ...mapState({
            user: state => state.mainModule.user,
            color: state => state.color,
            backgroundBlock: state => state.backgroundBlock,
            background: state => state.background
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
                <label class="with-card" for="checkCard">
                    <div class="top">
                        <img src="@/assets/images/card.png" alt="">
                        <div class="form-check">
                            <input class="form-check-input" name="choice" type="radio" id="checkCard" checked>
                        </div>
                    </div>
                    <p>По номеру карты</p>
                </label>
            </div>
            <h3 class="mt-4"><b>Оформление перевода</b></h3>
            <div class="payment-to">
                <div class="from">
                    <h3><b>С карты</b></h3>
                    <input v-model.trim="payCardFrom" type="number" required pattern="[0-9]{16}" class="form-control" placeholder="Номер вашей карты">
                </div>
                <i class="fa fa-chevron-right"></i>
                <div class="to">
                    <h3><b>На карту</b></h3>
                    <input v-model.trim="payCardTo" type="number" required pattern="[0-9]{16}" class="form-control" placeholder="Номер карты получателя">
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
        <div class="transactions-history" v-if="user.cards">
            <div class="nav-info">
                <h2 class="mb-3"><b>Операции</b><h5 v-if="card.transactions" class="text-secondary">(всего {{ card.transactions.length }} операции по данной карте)</h5></h2>
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
                <div class="transactions-block" v-if="card.transactions">
                    <span v-if="card.transactions.length == 0">По выбранной карте нет транзакций</span>
                    <div class="transaction" v-for="transaction in card.transactions" :key="transaction._id">
                        <div class="name">
                        <img src="@/assets/images/user.png" width="30" alt="">
                            <p><b v-text="user._id == transaction.reciever._id ? 'Пополнение' : transaction.reciever.firstName"></b></p>
                        </div>
                        <div class="date">
                            {{ getTime(transaction.createdAt) }}
                        </div>
                        <div class="id">
                            {{ transaction.uniqueNumber }}
                        </div>
                        <div class="money rub-m" :style="transaction.senderCard == card.uniqueNumber ? {color: 'green'} : {color: 'red'}">
                            <b><i v-text="transaction.senderCard == card.uniqueNumber ? '+' : '-'"></i>{{ transaction.money }}</b><i class="fa fa-rub"></i>
                        </div>
                        <div class="status">
                            <p class="text-success" v-text="transaction.type === 'shifting' ? 'Выполнено' : ''"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import '@/assets/sass/transaction.scss';
    @import '@/assets/sass/alertElem.scss';

    .payments, .transactions-history {
        background-color: v-bind(backgroundBlock);
    }

    .from, .to, .with-card, .transaction {
        background-color: v-bind(background);
    }

    .transactions-history .nav-info h5, .payments p {
        color: v-bind(color)!important;
    }
</style>
