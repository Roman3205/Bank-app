<template>
    <div class="container">
        <fill-form v-if="checkData" v-model:show="formVisible"></fill-form>
        <Transition name="warning">
            <div v-if="showWarning" class="warning">
                <i class="fa fa-times" @click.prevent="closeWarningFunc()" style="font-size: 22px; cursor: pointer; position: absolute; top: 5px; right: 5px;"></i>
                <p>Вы действительно желаете удалить карту <span style="font-size: large;"><b>{{ warningCard }}</b></span>?</p>
                <my-button-reg class="w-100" :disabled="loadingDelete" @click.prevent="deleteCard(warningCard)">Удалить</my-button-reg>
            </div>
        </Transition>
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
                        <my-button-reg class="btn-danger text-white" @click.prevent="showWarningFunc(card.uniqueCardNumber)">Закрыть карту</my-button-reg>
                    </div>
                </transition-group>
            </div>
        </div>
    </div>
</template>

<script>
    import FillForm from '@/components/FIllForm.vue'
    import axios from 'axios'
    import { mapState, mapActions } from 'vuex'
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
                loadingDelete: false,
                showWarning: false,
                warningCard: ''
            }
        },

        computed: {
            ...mapState({
                user: state => state.mainModule.user,
                color: state => state.color,
                backgroundBlock: state => state.backgroundBlock,
                background: state => state.background
            }),

            checkData() {
                return this.user.lastName === '' || this.user.patronymic === ''
            }
        },

        methods: {
            showWarningFunc(id) {
                this.showWarning = true
                this.warningCard = id
            },
            
            closeWarningFunc() {
                this.showWarning = false
                this.warningCard = ''
            },

            ...mapActions({
                loadUser: 'mainModule/loadUser'
            }),

            async deleteCard(id) {
                try {
                    this.closeWarningFunc()
                    this.deleteMessage = ''
                    this.loadingDelete = true
                    if(!id) {
                        return
                    }
                    await axios.delete('/card/delete', {
                        params: {
                            cardId: id
                        }
                    })
                    this.deleteMessage = 'Карта закрыта'
                    this.loadUser()
                    await new Promise(prom => setTimeout(prom, 1300)).then(() => {
                        this.deleteMessage = ''
                        this.loadingDelete = false
                    })

                } catch (error) {
                    if(error.response) {
                        this.deleteMessage = error.response.data.message
                        console.log('Ошибка при отправке запроса на сервер:(', error)
                        return this.loadingDelete = false
                    } else if (error.response.data.errors.length != 0) {
                        this.deleteMessage = error.response.data.errors.map(error => error.msg).join(', ')
                        console.log('Ошибка при отправке запроса на сервер:(', error)
                        return this.loadingDelete = false
                    }else {
                        return
                    }
                } finally {
                    await new Promise(prom => setTimeout(prom, 2400)).then(() => {
                        this.deleteMessage = ''
                    })
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
                        this.createMessage = error.response.data.message
                        console.log('Ошибка при отправке запроса на сервер:(', error)
                        return this.loadingCreate = false
                    } else if (error.response.data.errors.length != 0) {
                        this.createMessage = error.response.data.errors.map(error => error.msg).join(', ')
                        console.log('Ошибка при отправке запроса на сервер:(', error)
                        return this.loadingCreate = false
                    }else {
                        return
                    }
                } finally {
                    await new Promise(prom => setTimeout(prom, 2400)).then(() => {
                        this.createMessage = ''
                    })
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import '@/assets/sass/cardpage.scss';
    @import '@/assets/sass/alertElem.scss';

    .warning {
        position: fixed;
        top: 40px;
        left: calc(50% - 165px);
        right: 50%;
        background-color: rgb(190, 190, 190);
        border: 2px solid gray;
        padding: 30px 10px 10px 10px;
        border-radius: 10px;
        z-index: 990;
        width: 320px;
        text-align: center;
    }

    .warning-enter-from {
        opacity: 0;
        transition: all .7s ease-out;
        transform: translateY(-50px);
    }

    .warning-enter-to {
        opacity: 1;
        transition: all .7s ease-out;
    }

    .warning-leave-from {
        transition: all .7s ease-in;
        opacity: 0;
    }

    .warning-leave-to {
        opacity: 0;
        transition: all .7s ease-in;
        transform: translateY(-50px);
    }

    .card-photo {
        background: url('@/assets/images/cardWallet.png') no-repeat center center;
        border-radius: 10px;
        background-size: 100% 100%;
        width: 245px;
        height: 130px;
        margin: 15px 0px 10px 0px;
        padding: 10px;
    }

    .create-card, .cards-all, .card {
        background-color: v-bind(backgroundBlock);
    }

    .card {
        background-color: v-bind(background);
    }

    p {
        color: v-bind(color)!important;
    }

</style>