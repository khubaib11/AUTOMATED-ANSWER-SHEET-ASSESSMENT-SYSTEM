import React from "react";
import { FaGoogle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function SignIn() {
  return (
    <section className="text-gray-600 body-font  ">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <h1 className="title-font font-medium text-3xl text-gray-900">
            Automated Answer Sheet Assessment System
          </h1>
          <p className="leading-relaxed mt-4">
            Welcome! Log in to effortlessly analyze handwritten papers and receive instant, accurate results. Streamline your grading process with precision and ease. Your smarter assessment tool is here!
          </p>
        </div>
        <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
            Log in
          </h2>

          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>

          <div className="relative mb-4">
            <label htmlFor="password" className="leading-7 text-sm text-gray-600">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>

          <button
            type="button"
            className="text-white bg-gray-400 border-0 py-2 px-8 focus:outline-none hover:bg-gray-600 rounded text-lg"
          >
            Log in
          </button>
          <button
            type="button"
            className="text-white bg-gray-400 border-0 mt-3 py-2 px-8 focus:outline-none hover:bg-gray-600 rounded text-lg flex justify-center items-center space-x-2"
          >
            <FaGoogle />
            <span>Continue with Google</span>
          </button>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/signup" className="text-blue-500">
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
