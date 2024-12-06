import React, { useState } from "react";
import Oauth from "../components/Oauth";
import { Link,useNavigate } from "react-router-dom";

export default function SignUp() { // Fixed component name capitalization
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async(e) => {
    e.preventDefault(); // Prevent page reload on form submission
    
    try {
      const response= await fetch("api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
      const data = await response.json();
      setMessage(data.message);
      console.log(message);
  
  
  
      // Clear form fields after submission
      setFormData({
        name: "",
        email: "",
        password: "",
      });
  
  
      if(response.ok){
        navigate('/signin')
      }
     
    } catch (error) {
        console.log("somthing eroor in fetch func")      
    }
   
  };

  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto flex flex-wrap items-center">
        {/* Left Content */}
        <div className="lg:w-3/5 md:w-1/2 md:pr-16 lg:pr-0 pr-0">
          <h1 className="title-font font-medium text-3xl text-gray-900">
            AUTOMATED ANSWER SHEET ASSESSMENT SYSTEM
          </h1>
          <p className="leading-relaxed mt-4">
            Sign up now to effortlessly analyze handwritten papers and receive
            instant, accurate results. Streamline your grading process with
            precision and ease. Your smarter assessment tool is just a click
            away!
          </p>
        </div>

        {/* Signup Form */}
        <div className="lg:w-2/6 md:w-1/2 bg-gray-100 rounded-lg p-8 flex flex-col md:ml-auto w-full mt-10 md:mt-0">
          <h2 className="text-gray-900 text-lg font-medium title-font mb-5">
            Sign up
          </h2>

          {/* Full Name Field */}
          <div className="relative mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              onChange={handleChange}
              value={formData.name}
            />
          </div>

          {/* Email Field */}
          <div className="relative mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              onChange={handleChange}
              value={formData.email}
            />
          </div>

          {/* Password Field */}
          <div className="relative mb-4">
            <label
              htmlFor="password"
              className="leading-7 text-sm text-gray-600"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
              onChange={handleChange}
              value={formData.password}
            />
          </div>

          {/* Submit Button */}
          <button
            className="text-white bg-gray-600 border-0 py-2 px-8 focus:outline-none hover:bg-gray-900 rounded text-lg"
            onClick={handleSubmit}
          >
            Sign up
          </button>

          {/* Google Signup Button */}
          <Oauth/>
          {
            message && (
              <div className="text-orange-800 text-sm mt-3">
                {message}
              </div>
            )
          }

          {/* Link to Sign In */}
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account?</span>
            <Link to="/signin" className="text-blue-500">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
