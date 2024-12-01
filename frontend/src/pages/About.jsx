import React from 'react';
import { useSelector } from 'react-redux';

export default function About() {
  const isAuthenticated= useSelector((state) => state.user.isAuthenticated); // Get the isAuthenticated field from the user slice

  return (
    <div>
      {
        isAuthenticated ? ( // Directly check isAuthenticated
          <h1>Logged in</h1>
        ) : (
          <h1>Not logged in</h1>
        )
      }
    </div>
  );
}
