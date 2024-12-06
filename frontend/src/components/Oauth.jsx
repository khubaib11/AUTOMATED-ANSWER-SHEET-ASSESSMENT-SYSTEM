import React from "react";
import { FaGoogle } from "react-icons/fa";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { app } from "../firebase.js";
import { signInSuccess } from "../redux/user/userSlice.js";
import { useDispatch } from "react-redux";

export default function Oauth() {
  const dispatch = useDispatch();
  const auth = getAuth(app);
  const navigate = useNavigate();

  const handleGoogleClick = async () => {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      // Sign in with Google
      const googleResult = await signInWithPopup(auth, provider);
      console.log("Google sign-in result:", googleResult);

      // Extract user information
      const { displayName, email } = googleResult.user;

      // Send user data to the backend
      const response = await fetch("/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: displayName,
          email
        }),
      });

      // Check backend response
      if (response.ok) {
        const data = await response.json();
        console.log("Server response:", data);
        dispatch(signInSuccess(data));
        navigate("/");
      } else {
        console.error("Failed to authenticate with backend:", response.statusText);
      }
    } catch (error) {
      console.error("Error during Google sign-in:", error);
    }
  };

  return (
    <button
      type="button"
      className="text-white bg-gray-600 border-0 mt-3 py-2 px-8 focus:outline-none hover:bg-gray-900 rounded text-lg flex justify-center items-center space-x-2"
      onClick={handleGoogleClick}
    >
      <FaGoogle />
      <span>Continue with Google</span>
    </button>
  );
}
