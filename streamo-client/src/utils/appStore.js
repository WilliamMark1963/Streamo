import {configureStore} from "@reduxjs/toolkit"
import menuReducer from'./menuSlice.js'
export const appStore = configureStore({
    reducer:{
        menu:menuReducer
    },  
})

export default appStore;