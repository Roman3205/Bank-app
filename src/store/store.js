import { createStore } from "vuex";
import mainModule from './mainModule'

let store = createStore({
    state: {
        backgroundBlock: '#fff',
        color: 'rgb(22, 21, 21)',
        colorChat: 'rgb(22, 21, 21)',
        background: 'lightgray',
        sideBarColor: '#3B71CA'
    },
    mutations: {
        changeThemeFunc(state, changes) {
            state.backgroundBlock = changes.backgroundBlock
            state.color = changes.color
            state.background = changes.background
            state.sideBarColor = changes.sideBarColor
        }
    },
    actions: {
        changeTheme({commit}) {
            commit('changeThemeFunc', {
                backgroundBlock: 'rgb(78, 78, 78)',
                color: '#fff',
                background: 'rgb(22, 21, 21)',
                sideBarColor: '#fff',
            })
        },

        changeThemeDefault({commit}) {
            commit('changeThemeFunc', {
                backgroundBlock: '#fff',
                color: 'rgb(22, 21, 21)',
                colorChat: 'rgb(22, 21, 21)',
                background: 'lightgray',
                sideBarColor: '#3B71CA'
            })
        }
    },
    modules: {
        mainModule: mainModule
    }
})

export default store