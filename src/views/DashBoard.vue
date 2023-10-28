<script>
import { mapState } from 'vuex'
import axios from 'axios'
import dayjs from 'dayjs'
import cardMixin from '@/mixins/mixin.js'

export default {
    mixins: [cardMixin],

    data() {
        return {
            moneyStatValues: [9000, 7500, 6000, 4500, 3000, 1500, 0],
            month: [
                {
                    name: dayjs().month(dayjs().month()).format('MMMM'),
                },
                {
                    name: dayjs().month(dayjs().month() - 1).format('MMMM'),
                },
                {
                    name: dayjs().month(dayjs().month() - 2).format('MMMM'),
                },
            ],
            selectedCard: '',
            card: {}
        }
    },

    methods: {
        getDateEx(date) {
            let day = dayjs(date)
            return day.format('MM/YY')
        },

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
                        compressed: true
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

        getStatistics(month, status) {
            if (this.checkObj) {
                let dateNow = dayjs().month()
                let filteredDates = this.card.transactions.filter(elem => {
                    let date = dayjs(elem.createdAt).month()
                    return date == Number(dateNow) - month
                })

                let money
                if (status === 'spent') {
                    let spentTransactions = filteredDates.filter(elem => {
                        return this.card.uniqueCardNumber == elem.senderCard
                    })

                    let moneySpent = spentTransactions.reduce((a, i) => a + i.money, 0)

                    money = moneySpent
                } else if (status === 'recieve') {
                    let recieveTransactions = filteredDates.filter(elem => {
                        return this.card.uniqueCardNumber != elem.senderCard
                    })

                    let moneyRecieve = recieveTransactions.reduce((a, i) => a + i.money, 0)

                    money = moneyRecieve
                }

                return money
            }
        },

        getStatPercent(max, current) {
            let singlePer = Number(max) / 100
            let result = Number(current) / singlePer
            if (result == 0) {
                result = 1
            }
            return result
        },

        getSpentStat(type) {
            if (this.checkObj) {
                let dateNow = dayjs().month()
                let transactionDates = this.card.transactions.filter(elem => {
                    let date = dayjs(elem.createdAt).month()
                    return date == Number(dateNow) - 0
                })

                let spentTransactions = transactionDates.filter(elem => {
                    return this.card.uniqueCardNumber == elem.senderCard
                })

                let typedSpentTransactions = spentTransactions.filter(elem => elem.type == type)

                console.log(spentTransactions.length, typedSpentTransactions.length);
                let percentOfTransactions = spentTransactions.length / 100
                
                return typedSpentTransactions.length /  percentOfTransactions
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

        checkObj() {
            return Object.keys(this.card).length != 0
        }
    }
 }

</script>

<template>
    <div class="container">
        <div class="left">
                <div class="finance">
                    <h2><b>Финансовый отчет</b></h2>
                    <div class="blocks">
                        <div class="balance me-2">
                            <p>Пополнения</p>
                            <p class="rub-m"><b>{{ user.depositsAll }}</b><b><i class="fa fa-rub"></i></b></p>
                        </div>
                        <div class="spent me-2">
                            <p>Траты</p>
                            <p class="rub-m"><b>{{ user.expensesAll }}</b><b><i class="fa fa-rub"></i></b></p>
                        </div>
                        <div class="saving">
                            <p>Сбережения</p>
                            <p class="rub-m"><b>{{ user.savingsAll }}</b><b><i class="fa fa-rub"></i></b></p>
                        </div>
                    </div>
                </div>
                <div class="wallet-block" v-if="user.cards">
                    <h2><b>Мой кошелек</b></h2>
                    <my-select v-model.trim="selectedCard" @update:modelValue="getSelectedCard" :cards="user.cards"></my-select>
                    <div class="card" v-if="checkObj">
                        <p>{{ card.holdersName }} {{ card.holdersSurname }}</p>
                        <p>{{ getDateEx(card.expirationDate) }}</p>
                        <p><b>{{ getNumberCorrect(card.uniqueCardNumber) }}</b></p>
                    </div>
                    <h5><b>Счет карты</b></h5>
                    <span v-if="user.cards.length == 0">У вас нет ни одной карты</span>
                    <span v-else-if="user.cards.length != 0 && !checkObj">Карта не выбрана</span>
                    <div v-if="checkObj" class="money-wallet align-items-center"><div class="rub"><i class="fa fa-rub"></i></div><p class="rub-m" style="font-size: 22px; margin: 0;"><b>{{ card.balance }}</b> <i class="fa fa-rub"></i></p></div>
                </div>
        </div>
        <div class="right">
            <div class="block-top">
                <div class="statistics">
                    <h2><b>Статистика</b></h2>
                    <div class="blocks">
                        <div class="count">
                            <p v-for="value, index in moneyStatValues" :key="index">{{ value }}</p>
                        </div>
                        <div class="time">
                            <div class="month" v-for="(item, index) in month" :key="index">
                                <div class="stat">
                                    <div class="top-up" :style="this.checkObj && this.card.transactions.length > 0 ? {height: this.getStatPercent(this.moneyStatValues[0], this.getStatistics(index, 'recieve')) + '%'} : {height: '1%'}"></div>
                                    <div class="withdrawals" :style="this.checkObj && this.card.transactions.length > 0 ? {height: this.getStatPercent(this.moneyStatValues[0], this.getStatistics(index, 'spent')) + '%'} : {height: '1%'}"></div>
                                </div>
                                <p>{{ item.name }}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="spent-diagram">
                    <h2><b>Диаграмма расходов</b><br><span class="text-secondary">в этом месяце</span></h2>
                    <div class="blocks">
                        <div class="percent">
                            <svg viewBox="0 0 38 38" class="circular-chart pt-1" v-if="this.checkObj">
                                <path class="circle" stroke-dasharray="0, 100" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path class="circle" stroke-dasharray="0, 100" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path class="circle" :stroke-dasharray="String(getSpentStat('shifting'))" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path class="circle" stroke-dasharray="0, 100" d="M18 2.0845
                                    a 15.9155 15.9155 0 0 1 0 31.831
                                    a 15.9155 15.9155 0 0 1 0 -31.831" />
                            </svg>
                            <div class="text-block-info w-50" v-if="this.checkObj">
                                <h3 class="text-center w-100"><b :style="this.getStatistics(0, 'spent') <= 9999 ? {fontSize: '25px'} : this.getStatistics(0, 'spent') >= 10000 && this.getStatistics(0, 'spent') <= 99999 ? {fontSize: '21px'} : this.getStatistics(0, 'spent') >= 100000 ? {fontSize: '18px'} : {}">{{ getStatistics(0, 'spent') }}</b><b><i class="fa fa-rub" style="font-size: 20px; padding-left: 5px;"></i></b></h3>
                            </div>
                        </div>
                        <div class="withdraw">
                            <div class="category">
                                <div class="one"></div><p>ЖКХ, связь, интернет</p>
                            </div>
                            <div class="category">
                                <div class="two"></div><p>Супермаркеты</p>
                            </div>
                            <div class="category">
                                <div class="three"></div><p>Переводы</p>
                            </div>
                            <div class="category">
                                <div class="four"></div><p>Подписки</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="transactions-history">
                <h2><b>Операции</b></h2>
                <p class="text-secondary">Последнии 3 операции по счету за 2023 год</p>
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
                                <p><b>{{ transaction.reciever.firstName }}</b></p>
                            </div>
                            <div class="date">
                                {{ getTime(transaction.createdAt) }}
                            </div>
                            <div class="id">
                                {{ transaction.uniqueNumber }}
                            </div>
                            <div class="money rub-m">
                                <b>{{ transaction.money }}</b><i class="fa fa-rub"></i>
                            </div>
                            <div class="status">
                                <p class="text-success" v-text="transaction.type === 'shifting' ? 'Выполнено' : ''"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import '@/assets/sass/dashboard.scss';
    @import '@/assets/sass/blackmode.scss';
    .finance, .statistics, .transactions-history, .wallet-block, .spent-diagram {
        background-color: v-bind(backgroundBlock);
    }

</style>
