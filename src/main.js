import axios from 'axios'
axios.defaults.baseURL = 'http://localhost:3007'

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)
dayjs.locale('ru')

import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store.js'

createApp(App).use(router).use(store).mount('#app')