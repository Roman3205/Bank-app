import axios from "axios"

let mainModule = {
    state: () => ({
        user: {}
    }),

    mutations: {
        setUser(state, user) {
            state.user = user
        }
    },

    actions: {
        async loadUser({commit}) {
            try {
                let response = await axios.get('/user/main')
                commit('setUser', response?.data)
            } catch (error) {
                console.log(error.response?.data)
            }
        }
    },

    namespaced: true
}

export default mainModule