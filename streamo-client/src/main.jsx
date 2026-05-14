import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {createBrowserRouter, RouterProvider} from "react-router-dom"
import Home from './Components/Home.jsx'
import { Provider } from 'react-redux'
import appStore from "./utils/appStore";
const router = createBrowserRouter([
  {
  path: "/",
    element: <App/>,
    children:[
      {
        path:"/",
        element: <Home/>
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
    <RouterProvider router = {router}/>
    </Provider>
  </StrictMode>
)
