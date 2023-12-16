<template>
    <div class="container">
        <form class="oplata-block" @submit.prevent="goToOplata">
            <div class="logo">
                <img src="@/assets/images/logo-main.png" width="300" alt="">
            </div>
            <h2><b>Введите данные карты</b></h2>
            <my-input-card  maxlength="16" v-model.number="cardNum" placeholder="Номер карты"></my-input-card>
            <div class="card-text d-flex gap-3 flex-row-reverse">
                <input class="form-control" v-model="dateExp" type="month" placeholder="Срок действия" v-date/>
                <my-input-card maxlength="3" placeholder="CVV" v-model.number="cvv"></my-input-card>
            </div>
            <p data-p="ptext">Далее вам перенаправит на страницу подтверждения платежа.</p>
            <my-button-reg data-button="button" type="submit" :disabled="loadingLoad">Оплатить</my-button-reg>
        </form>
        <transition name="alert">
            <div 
                v-if="this.loadingMessage !== ''"
                class="alert text-center" 
                data-67cdadw 
                :class="this.loadingMessage === 'Данные введены корректно, перенаправляем вас' ? 'alert-success' : 'alert-danger'">
                {{ loadingMessage }}
            </div>
        </transition>
    </div>
</template>

<script>
import dayjs from 'dayjs'
import axios from 'axios'

export default {
    directives: {
        date: {
            mounted(el) {
                let month = dayjs().month()
                let year = dayjs().year() + 1
                el.value = `${year}-${month}`
            }
        }
    },

    data() {
        return {
            cvv: '',
            cardNum: '',
            dateExp: '',
            loadingLoad: undefined,
            loadingMessage: ''
        }
    },

    methods: {
        async goToOplata() {
                try {
                    if(this.cvv === '' || this.cardNum === '' || this.dateExp === '') {
                        return this.loadingMessage = 'Заполните поле ввода'
                    }

                    this.loadingLoad = true
                    let response = await axios.post('/payment/create', {
                        cardNum: this.cardNum,
                        dateExp: this.dateExp,
                        cvv: this.cvv,
                        payload: this.$route.params.crypt
                    })

                    this.code = ''
                    this.loadingMessage = 'Данные введены корректно, перенаправляем вас'

                    await new Promise(prom => setTimeout(prom, 1400)).then(() => {
                        this.$router.push({name: 'oplata', params: {key: response.data.oplata}})
                    })
                } catch (error) {
                    if(error.response) {
                        this.loadingMessage = error.response.data.message
                        console.log('Ошибка при отправке запроса на сервер:(', error)
                    } else if (error.response.data.errors.length != 0) {
                        this.loadingMessage = error.response.data.errors.map(error => error.msg).join(', ')
                        console.log('Ошибка при отправке запроса на сервер:(', error)
                    }else {
                        return
                    }
                } finally {
                    this.loadingLoad = false
                    await new Promise(prom => setTimeout(prom, 2400)).then(() => {
                        this.loadingMessage = ''
                    })
                }
            }
    }
}
</script>

<style lang="scss" scoped>
    @import '@/assets/sass/oplata.scss';
    @import '@/assets/sass/alertElem.scss';
    input[type="month"] {
    height: 60px;
    width: 100%;
    font-size: 20px;
    border-width: 2.5px;
  }

</style>