import {configureStore} from "@reduxjs/toolkit"
import menuReducer from'./menuSlice.js'
import userReducer from './userSlice.js'
export const appStore = configureStore({
    reducer:{
        menu: menuReducer,
        user: userReducer
    },  
})

export default appStore;