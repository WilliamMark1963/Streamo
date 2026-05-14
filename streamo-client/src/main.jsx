import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Home from './Components/Home.jsx'
import { Provider } from 'react-redux'
import appStore from "./utils/appStore";
import SignIn from './Components/SignIn.jsx'
import Channel from './Components/Channel.jsx'
import Register from './Components/Register.jsx'
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      { path: "/signin", element: <SignIn/> },
      { path: "/channel", element: <Channel/> },
      {
        path: "/register",
        element: <Register />
      }
    ]
  }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={appStore}>
      <RouterProvider router={router} />
    </Provider>
  </StrictMode>
)
