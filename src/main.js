import axios from 'axios'
// const host = import.meta.env.VITE_BACKEND_HOST
// const port = import.meta.env.VITE_BACKEND_PORT

// axios.defaults.baseURL = 'http://localhost:3777'
// axios.defaults.baseURL =
axios.defaults.withCredentials = true

import dayjs from 'dayjs'
import 'dayjs/locale/ru'
import relativeTime from 'dayjs/plugin/relativeTime'

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