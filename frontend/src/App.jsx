import React from 'react'
import { BrowserRouter,Routes,Route } from 'react-router-dom'
import SignUp from './pages/SignUp.jsx'
import SignIn from './pages/SignIn.jsx'
import Home from './pages/Home.jsx'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import About from './pages/About.jsx'

export default function App() {
  return (
    <div >
      <BrowserRouter>
        <Header/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <Footer/>
      </BrowserRouter>
    </div>
  )
}
