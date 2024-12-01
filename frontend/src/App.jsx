import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import SignUp from './pages/SignUp.jsx';
import SignIn from './pages/SignIn.jsx';
import Header from './components/Header.jsx';
import Footer from './components/Footer.jsx';
import About from './pages/About.jsx';
import PrivateRoute from './components/PrivateRoute.jsx';
import Dashboard from './pages/Dashboard.jsx';

export default function App() {
  const {currentUser} = useSelector((state) => state.user); // Adjust to your Redux-persist structure

  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          {/* Redirect from SignUp/SignIn if user is logged in */}
          <Route 
          path='/*'
          element={currentUser ? <Navigate to="/dashboard" /> : <SignIn />}
          >
            
          </Route>
          <Route
            path="/signup"
            element={currentUser ? <Navigate to="/dashboard" /> : <SignUp />}
          />
          <Route
            path="/signin"
            element={currentUser ? <Navigate to="/dashboard" /> : <SignIn />}
          />
          <Route path="/about" element={<About />} />

          {/* Protected routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
