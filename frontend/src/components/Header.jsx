import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'; // Import the icon
import { useSelector } from 'react-redux';
import {signOutSuccess} from '../redux/user/userSlice';
// import { useNavigate } from 'react-router-dom';
// import { signInSuccess } from '../redux/user/userSlice';
import { useDispatch } from 'react-redux';
export default function Header() {
  const {currentUser} = useSelector(state=>state.user)
  // const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async() => {
    try {
      const response = await fetch('/api/user/signout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if(response.ok){

      const data = await response.json();
        dispatch(signOutSuccess());
        console.log('Logged out',data);
      }else{
        console.log('Failed to logout');
      }

    } catch (error) {
      console.log(error);
    }
    // dispatch(signInSuccess(null));
    // localStorage.removeItem('user');
    // navigate('/signin');
  }

  return (
    <header className="bg-gray-900 text-white body-font shadow-md">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <span className="ml-3 text-xl text-white font-bold">SHEET EVALUATOR</span>
        </a>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          {currentUser ? (
            <>
              <Link
                to="/"
                className="mr-5 hover:underline hover:text-blue-300 transition duration-300"
              >
                Dashboard
              </Link>
              <Link
                to="/about"
                className="mr-5 hover:underline hover:text-blue-300 transition duration-300"
              >
                About
              </Link>
              <button
                className="flex items-center text-white hover:underline hover:text-red-600 transition duration-300"
                onClick={handleLogout}
              >
                <ArrowLeftEndOnRectangleIcon className="h-5 w-5 ml-10 mr-2" /> {/* Icon added here */}
                Log Out
              </button>
            </>
          ) : (
            <>
            <Link
                to="/about"
                className="mr-5 hover:underline hover:text-blue-300 transition duration-300"
              >
                About
              </Link>
              
              <Link
                to="/signin"
                className="mr-5 hover:underline hover:text-blue-300 transition duration-300"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="mr-5 hover:underline hover:text-blue-300 transition duration-300"
              >
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
