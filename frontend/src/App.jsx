import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Home from './pages/Home.jsx'
import Header from './components/Header.jsx'
export default function App() {
  return (
    <div >
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-in" element={<SignIn />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}
