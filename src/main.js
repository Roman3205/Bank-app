import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import relativeTime from 'dayjs/plugin/relativeTime'
import axios from 'axios'
// const host = import.meta.env.VITE_BACKEND_HOST
// const port = import.meta.env.VITE_BACKEND_PORT
// axios.defaults.baseURL = 'http://localhost:3777/server'
axios.defaults.baseURL = 'https://microbank.onrender.com/server'
axios.defaults.withCredentials = true

axios.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('token')}`
    return config
})

axios.interceptors.response.use((config) => {
    return config
}, async (error) => {
    let originalRequest = error.config
    if(error.response.status == 401 && error.config && !error.config._isRetry) {
        originalRequest._isRetry = true
        try {
            let response = await axios.get('/refresh')
                $cookies.set('token', response.data.userData.refreshToken, '5d', '/', '', true, 'none')
                localStorage.removeItem('token')
                localStorage.setItem('token', response.data.userData.accessToken)

                return axios.request(originalRequest)
        } catch (error) {
            if(error.response && error.response.status === 400 && error.response.data.message === 'Такого токена не существует или его действие закончилось') {
                console.log('Вы не авторизованы');
                localStorage.removeItem('token')
                $cookies.remove('token')
            }
        }
    }
    
    throw error    
})
dayjs.extend(relativeTime)
dayjs.locale('ru')

import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router/router.js'
import store from '@/store/store.js'
import UI from '@/components/UI/ui.js'
import directives from '@/directives/directives'
import VueCookies from 'vue-cookies'

const app = createApp(App)

UI.forEach(componentUI => {
    app.component(componentUI.name, componentUI)
})

directives.forEach(directive => {
    app.directive(directive.name, directive)
})

app
    .use(router)
    .use(store)
    .use(VueCookies)
    .mount('#app')