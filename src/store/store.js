import { createStore } from "vuex";
import mainModule from './mainModule'

let store = createStore({
    modules: {
        mainModule: mainModule
    }
})

export default store