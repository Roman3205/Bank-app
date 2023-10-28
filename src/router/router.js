import { createRouter, createWebHistory } from "vue-router";
import CardPage from '@/views/CardPage.vue'
import DashBoard from '@/views/DashBoard.vue'
import SupportPage from '@/views/SupportPage.vue'
import TransactionsPage from '@/views/TransactionsPage.vue'
import LoginPage from '@/views/LoginPage.vue'
import SingUpPage from '@/views/SignUpPage.vue'
import NotFoundPage from '@/views/NotFoundPage.vue'
import RestorePage from '@/views/RestorePage.vue'

let router = createRouter({
    history: createWebHistory(),

    routes: [
        {
            path: '/',
            redirect: '/statistics/dashboard'
        },
        {
            path: '/statistics/dashboard',
            name: 'dashboard',
            component: DashBoard
        },
        {
            path: '/restore-password',
            name: 'restore',
            component: RestorePage
        },
        {
            path: '/cards',
            name: 'cards',
            component: CardPage
        },
        {
            path: '/support',
            name: 'support',
            component: SupportPage
        },
        {
            path: '/transactions',
            name: 'transactions',
            component: TransactionsPage
        },
        {
            path: '/login',
            name: 'login',
            component: LoginPage
        },
        {
            path: '/sign-up',
            name: 'register',
            component: SingUpPage
        },
        {
            path: '/:pathMatch(.*)',
            name: 'notfound',
            component: NotFoundPage
        },
        {
            path: '/oplata/:key',
            name: 'oplata',
            component: () => import('@/views/OplataPage.vue')
        }
    ]
})

let avoidRoutes = [
    'dashboard',
    'cards',
    'support',
    'transactions',
    'oplata'
]

router.beforeEach((from, to, next) => {
    if(!window.$cookies.isKey('cookie-auth') && avoidRoutes.includes(from.name)) {
        router.push('/login')
    } else {
        next()
    }
})

export default router