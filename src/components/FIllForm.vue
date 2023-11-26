<template>
    <teleport to="#app">
        <div class="fill-info" v-if="show" @click="hideMenu">
            <div class="block" @click.stop>
                <h2><b>Перед созданием карт введите ваши данные</b></h2>
                <form class="form-fill" @submit.prevent="fillData">
                    <my-input-card v-model.trim="surname" v-focus type="text" placeholder="Введите фамилию"></my-input-card>
                    <my-input-card v-model.trim="patronymic" type="text" placeholder="Введите отчество"></my-input-card>
                    <my-button-reg>Сохранить</my-button-reg>
                </form>
                <transition name="alert"><div v-if="this.fillMessage !== ''" class="alert text-center" data-67cdadw :class="this.fillMessage === 'Данные заполнены' ? 'alert-success' : 'alert-danger'">{{ fillMessage }}</div></transition>
            </div>
        </div>
    </teleport>
</template>

<script>
    import axios from 'axios'

    export default {
        name: 'fill-form',
        props: {
            show: {
                type: Boolean,
                default: false
            }
        },

        data() {
            return {
                surname: '',
                patronymic: '',
                fillMessage: ''
            }
        },

        emits: ['update:show'],

        methods: {
            hideMenu() {
                this.$emit('update:show', false)
            },

            async fillData() {
                try {
                    this.fillMessage = ''

                    if(this.surname === '' || this.patronymic === '' || !/[а-яА-ЯЁё]/.test(this.surname) || !/[а-яА-ЯЁё]/.test(this.patronymic)) {
                        return this.fillMessage = 'Ошибка в заполнении'
                    }

                    await axios.post('/user/fill', {
                        lastName: this.surname,
                        patronymic: this.patronymic
                    })

                    this.surname = ''
                    this.patronymic = ''

                    this.fillMessage = 'Данные заполнены'

                    await new Promise(prom => setTimeout(prom, 900)).then(() => {
                        this.hideMenu()
                        window.location.reload()
                    })

                } catch (error) {
                    if(error.response) {
                        this.loginMessage = error.response.data
                        console.log('Ошибка при отправке запроса на сервер:(', error)
                    } else {
                        return
                    }
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
@import '@/assets/sass/alertElem.scss';

    .fill-info {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 999;
    }

    .block {
        margin: auto;
        background-color: #fff;
        border-radius: 20px;
        padding: 20px 35px 30px 35px;
    }

    .block, .form-fill {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
</style>