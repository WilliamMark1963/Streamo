import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Components/Header'
import Sidebar from './Components/Sidebar'


function App() {
  return (
<div className='bg-[#0f0f0f] min-h-screen'>
      <Header />
      <div className='flex'>
        <Sidebar />
        <div className='flex-1'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default App
