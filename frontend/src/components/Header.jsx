import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'; // Import the icon

export default function Header() {
  const login = true; // Change this to `false` to test logged-out state

  return (
    <header className="bg-gray-300 text-gray-800 body-font shadow-md">
      <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
        <a href="/" className="flex title-font font-medium items-center text-gray-900 mb-4 md:mb-0">
          <span className="ml-3 text-xl text-black font-bold">SHEET EVALUATOR</span>
        </a>
        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center">
          {login ? (
            <>
              <Link
                to="/"
                className="mr-5 hover:underline hover:text-black transition duration-300"
              >
                Home
              </Link>
              <Link
                to="/about"
                className="mr-5 hover:underline hover:text-black transition duration-300"
              >
                About
              </Link>
              <button
                className="flex items-center text-gray-800 hover:underline hover:text-black transition duration-300"
              >
                <ArrowLeftEndOnRectangleIcon className="h-5 w-5 ml-10 mr-2" /> {/* Icon added here */}
                Log Out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/signin"
                className="mr-5 hover:underline hover:text-black transition duration-300"
              >
                Log In
              </Link>
              <Link
                to="/signup"
                className="mr-5 hover:underline hover:text-black transition duration-300"
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
