<template>
    <div class="container">
        <fill-form v-if="checkData" v-model:show="formVisible"></fill-form>
        <div class="wrapper">
            <form class="create-card" @submit.prevent="createCard">
                <h2><b>Создание карты</b></h2>
                <div class="form-create">
                    <div v-if="!checkData" class="card-photo text-white">{{ user.firstName }} {{ user.lastName }}</div>
                    <my-input-card disabled type="text" placeholder="Имя" v-model="this.user.firstName"></my-input-card>
                    <my-input-card disabled type="text" placeholder="Фамилия" v-model="this.user.lastName"></my-input-card>
                    <my-input-card disabled type="text" placeholder="Отчество" v-model="this.user.patronymic"></my-input-card>
                    <my-input-card v-model="date" :disabled="checkData" type="date"></my-input-card>
                    <my-input-card v-model="tel" :disabled="checkData" type="tel" required pattern="[+][7][9][0-9]{9}" class="form-control" maxlength="16" placeholder="Номер телефона, например, +79001235566" />
                    <div class="alert alert-info">Все уведомления будут приходить вам на почту, указанную при регистрации</div>
                </div>
                <hr>
                <div class="submit">
                    <p class="text-secondary">Заполняя форму, я принимаю <a href="https://www.consultant.ru/document/cons_doc_LAW_34683/693c16ad10f7f494a958cb007737bd678c221d4c/">условия <br> передачи информации</a></p>
                    <span class="text-danger" v-if="checkData">Обновите страницу и введите свою фамилию и отчество в меню</span>
                    <my-button-reg :disabled="checkData || loadingCreate">Оформить</my-button-reg>
                </div>
                <transition name="alert"><div v-if="this.deleteMessage !== ''" class="alert text-center" data-67cdadw :class="this.deleteMessage === 'Карта успешно создана' ? 'alert-success' : 'alert-danger'">{{ deleteMessage }}</div></transition>
                <transition name="alert"><div v-if="this.createMessage !== ''" class="alert text-center" data-67cdadw :class="this.createMessage === 'Карта успешно создана' ? 'alert-success' : 'alert-danger'">{{ createMessage }}</div></transition>
            </form>
            <div class="cards-all" v-if="user.cards">
                <h2><b>Ваши карты</b></h2>
                <span v-if="user.cards.length == 0">Список ваших карт пуст</span>
                <transition-group name="cards-group" v-else-if="user.cards.length != 0">
                    <div class="card" v-for="(card, index) in user.cards" :key="index">
                        <div class="d-flex align-items-center gap-5">
                            <img src="@/assets/images/cardWallet.png" width="50" alt="">
                            <p>{{ getNumberCorrect(card.uniqueCardNumber) }}</p>
                        </div>
                        <my-button-reg :disabled="loadingDelete" class="btn-danger text-white" @click.prevent="deleteCard(card._id)">Закрыть карту</my-button-reg>
                    </div>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<script>
    import FillForm from '@/components/FillForm.vue'
    import axios from 'axios'
    import { mapState } from 'vuex'
    import { mapActions } from 'vuex'
    import cardMixin from '@/mixins/mixin.js'

    export default {
        mixins: [cardMixin],

        components: {
            FillForm
        },

        data() {
            return {
                formVisible: true,
                tel: '',
                date: '',
                createMessage: '',
                deleteMessage: '',
                loadingCreate: undefined,
                loadingDelete: undefined
            }
        },

        computed: {
            ...mapState({
                user: state => state.mainModule.user
            }),

            checkData() {
                return this.user.lastName === '' || this.user.patronymic === ''
            }
        },

        methods: {
            ...mapActions({
                loadUser: 'mainModule/loadUser'
            }),

            async deleteCard(id) {
                try {
                    this.loadingDelete = true
                    this.deleteMessage = ''

                    await axios.post('/card/delete', {
                        cardId: id
                    })
                    this.loadingDelete = false

                    this.deleteMessage = 'Карта закрыта'
                    this.loadUser()

                    await new Promise(prom => setTimeout(prom, 1300)).then(() => {
                        this.deleteMessage = ''
                    })

                } catch (error) {
                    if(error.response) {
                        this.deleteMessage = error.response.data
                        console.log('Ошибка при отправке запроса на сервер:(')
                        return this.loadingDelete = false
                    } else {
                        return
                    }
                }
            },

            async createCard() {
                try {
                    this.loadingCreate = true
                    this.createMessage = ''

                    let compareDate = Math.floor(((new Date().getTime() - new Date(this.date)) / (24 * 3600 * 365.25 * 1000)).toFixed(1))

                    if(this.date === '' || this.tel === '') {
                         this.createMessage = 'Произошла ошибка в заполнении'
                         return this.loadingCreate = false

                    } else if(compareDate < 14) {
                         this.createMessage = 'Вам недостаточно лет для оформления карты'
                         return this.loadingCreate = false

                    } else if(compareDate > 100) {
                         this.createMessage = 'Введите корректную дату рождения'
                         return this.loadingCreate = false
                    }

                    await axios.post('/card/create', {
                        name: this.user.firstName,
                        surname: this.user.lastName,
                        patronymic: this.user.patronymic,
                        date: this.date,
                        tel: this.tel
                    })

                    this.tel = ''
                    this.date = ''

                    this.loadingCreate = false
                    this.loadUser()
                    this.createMessage = 'Карта успешно создана'

                    await new Promise(prom => setTimeout(prom, 1300)).then(() => {
                        this.createMessage = ''
                    })
                } catch (error) {
                    if(error.response) {
                        this.createMessage = error.response.data
                        console.log('Ошибка при отправке запроса на сервер:(', error)
                        return this.loadingCreate = false
                    } else {
                        return
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/sass/cardpage.scss';
    // @import '@/assets/sass/blackmode.scss';
    @import '@/assets/sass/alertElem.scss';

    .card-photo {
        background: url('@/assets/images/cardWallet.png') no-repeat center center;
        border-radius: 10px;
        background-size: 100% 100%;
        width: 245px;
        height: 130px;
        margin: 15px 0px 10px 0px;
        padding: 10px;
    }

</style>