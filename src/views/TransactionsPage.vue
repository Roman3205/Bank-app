<script>

export default {
    data() {
        return {
            paymentWayTel: false,
            paymentWayCard: true,
            payTelFrom: '',
            payTelTo: '',
            payCardFrom: '',
            payCardTo: ''
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
        }
    }
}

</script>

<template>
    <div class="container">
        <form class="payments">
            <h2><b>Платежи</b></h2>
            <div class="choice">
                <label class="with-card" for="checkCard" @click="selectPaymentWay('card')">
                    <div class="top">
                        <img src="../assets/images/card.png" alt="">
                        <div class="form-check">
                            <input class="form-check-input" name="choice" type="radio" id="checkCard" :checked="paymentWayCard">
                        </div>
                    </div>
                    <p>По номеру карты</p>
                </label>
                <label class="with-tel" for="checkTel" @click="selectPaymentWay('tel')">
                    <div class="top">
                        <img src="../assets/images/tel.png" alt="">
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
                    <input v-model="payCardFrom" type="tel" required pattern="[0-9]{16}" class="form-control" maxlength="16" placeholder="Номер вашей карты">
                </div>
                <i class="fa fa-chevron-right"></i>
                <div class="to">
                    <h3><b>На карту</b></h3>
                    <input v-model="payCardTo" type="tel" required pattern="[0-9]{16}" class="form-control" maxlength="16" placeholder="Номер карты получателя">
                </div>
            </div>
            <div class="payment-to" v-if="paymentWayTel">
                <div class="from">
                    <h3><b>С карты (по телефону)</b></h3>
                    <input v-model="payTelFrom" type="tel" required pattern="[0-9]{16}" class="form-control" maxlength="16" placeholder="Номер привязанного телефона">
                </div>
                <i class="fa fa-chevron-right"></i>
                <div class="to">
                    <h3><b>На карту (по телефону)</b></h3>
                    <input v-model="payTelTo" type="tel" required pattern="[0-9]{16}" class="form-control" maxlength="16" placeholder="Номер телефона получателя">
                </div>
            </div>
            <input type="number" class="form-control" min="5" max="10000" placeholder="Сумма, руб.">
            <hr>
            <div class="submit">
                <p class="text-secondary">Нажимая на кнопку «Перевести», вы соглашаетесь<br> с условиями публичной оферты</p>
                <button class="btn btn-outline-primary">Перевести</button>
            </div>
        </form>
        <div class="transactions-history">
            <div class="nav-info">
                <h2 class="mb-3"><b>Операции</b><h5 class="text-secondary">(всего 3 операции по данной карте)</h5></h2>
                <h4>По карте: <img src="../assets/images/cardWallet.png" width="50" alt=""> <select>
                        <option>2022 2013 8847 2819</option>
                        <option>3212 2013 8237 2819</option>
                    </select>
                </h4>
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
                            <img src="../assets/images/user.png" width="30" alt="">
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
    @import '../assets/sass/transaction.scss';

</style>
