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
import ForgotPassword from './pages/ForgotPassword.jsx';
import NotFound from './pages/NotFound.jsx'; // 404 Page

export default function App() {
  const { currentUser } = useSelector((state) => state.user); // Adjust to your Redux-persist structure

  return (
    <BrowserRouter>
      <Header />
      <main>
        <Routes>
          {/* Public Routes */}
          <Route
            path="/signup"
            element={currentUser ? <Navigate to="/dashboard" /> : <SignUp />}
          />
          <Route
            path="/signin"
            element={currentUser ? <Navigate to="/dashboard" /> : <SignIn />}
          />
          <Route path="/about" element={<About />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/" element={<Dashboard />} /> {/* Default protected route */}
          </Route>

          {/* Catch-all Route for 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}
