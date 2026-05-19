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
import CreateChannel from './Components/createChannel.jsx'
import UploadVideoForm from './Components/UploadVideoForm.jsx'
import VideoPlayerPage from './Components/VideoPlayerPage.jsx'
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
      { path: "/register", element: <Register />},
      { path: "/channel/:id", element: <Channel/> },
      { path: "/createChannel", element:<CreateChannel/> },
      {
        path:"/upload-video",
        element: <UploadVideoForm/>
      },
      {
        path:"/watch/:videoId", element: <VideoPlayerPage/>
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
