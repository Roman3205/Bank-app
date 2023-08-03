import { createRouter, createWebHistory } from "vue-router";
import CardPage from './views/CardPage.vue'
import DashBoard from './views/DashBoard.vue'
import SupportPage from './views/SupportPage.vue'
import WalletPage from './views/WalletPage.vue'
import TransactionsPage from './views/TransactionsPage.vue'
import LoginPage from './views/LoginPage.vue'
import SingUpPage from './views/SignUpPage.vue'
import NotFoundPage from './views/NotFoundPage.vue'

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
            path: '/wallet',
            name: 'wallet',
            component: WalletPage
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
        }
    ]
})

export default router