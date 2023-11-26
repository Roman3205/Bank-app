<script>

import axios from 'axios'
import dayjs from 'dayjs'
import { mapState } from 'vuex';

export default {
    computed: {
        ...mapState({
            colorChat: state =>  state.colorChat,
            backgroundBlock: state => state.backgroundBlock,
            background: state => state.background,
        })
    },
    
    data() {
        return {
            textPrompt: '',
            loadingReq: false,
            messages: []
        }
    },

    mounted() {
        this.loadMessages()
    },

    methods: {
        getDateMessage(date) {
            let day = dayjs(date)
            return day.format('HH:mm D MMMM')
        },

        scrollBottom() {
            let el = document.querySelector('.messages-container')
            el.scrollTop = el.scrollHeight
        },

        async postMessage() {
            try {
                if (this.textPrompt !== '') {
                    this.loadingReq = true
                    await axios.post('/support/ask', {
                        prompt: this.textPrompt
                    }).then(() => {
                        this.loadMessages()
                        this.textPrompt = ''
                    })
                }
            } catch (error) {
                if(error.response) {
                    console.log('Ошибка при отправке запроса на сервер:(', error)
                } else {
                    return
                }
            } finally {
                this.loadingReq = false
            }
        },

        async loadMessages() {
            try {
                axios.get('/support/messages').then((response) => {
                    this.messages = response.data.messages
                    this.$nextTick(() => {
                    this.scrollBottom()
                })
                })
            } catch (error) {
                if(error.response) {
                    console.log('Ошибка при отправке запроса на сервер:(', error)
                } else {
                    return
                }
            }
        }
    }
}

</script>

<template>
    <div class="container">
        <div class="wrapper">
            <div class="block-box">
                <div class="info-user">
                    <div class="user-chat">
                        Ассистент
                    </div>
                </div>
                <div class="messages-container">
                    <h5 style="text-align: center;" v-if="this.messages.length == 0">Сообщений пока нет</h5>
                    <section v-for="message, index in messages" :key="index">
                        <div class="message-r">
                            <div class="writer">
                                <img src="@/assets/images/user.png" width="50" alt="">
                            </div>
                            <div class="text-message">
                                <div>{{ message.question }}</div>
                                <div class="date left"><p><sub>{{ getDateMessage(message.createdAt) }}</sub></p></div>
                            </div>
                        </div>
                        <div class="message-l">
                            <div class="writer">
                                <img src="@/assets/images/assistant.png" width="40" alt="">
                            </div>
                            <div class="text-message">
                                <div>{{ message.answer }}</div>
                                <div class="date left"><p><sub>{{ getDateMessage(message.createdAt) }}</sub></p></div>
                            </div>
                        </div>
                    </section>
                </div>
                <div class="send-message-form">
                    <form @submit.prevent="postMessage">
                        <input type="text" placeholder="Введите ваш вопрос" v-model.trim="textPrompt" class="form-control" >
                        <div class="button-sender-block text-center">
                            <my-button-reg type="submit" class="w-100 btn-outline-primary" v-if="!loadingReq">Отправить</my-button-reg>
                            <svg v-else class="spinner" viewBox="0 0 66 66">
                                <circle class="path" cy="33" cx="33" r="30" fill="none" stroke-linecap="rounded" stroke-width="6"></circle>
                            </svg>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
    @import '@/assets/sass/support.scss';

    * {
        color: v-bind(colorChat);
    }

    .block-box, .message-r, .message-l {
        background-color: v-bind(backgroundBlock);
    }
</style>