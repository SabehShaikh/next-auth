"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  // State to hold the user input data (email, password, username)
  const [user, setUser] = useState({
    email: "",
    password: "",
    username: "",
  });

  // State to control button disable state based on input validation
  const [buttonDisabled, setButtonDisabled] = useState(false);

  // State to show loading spinner or disable UI during the signup process
  const [loading, setLoading] = useState(false);

  // Function to handle signup when the user submits the form
  const onSignup = async () => {
    try {
      setLoading(true); // Set loading to true when signup starts
      const response = await axios.post("/api/users/signup", user); // Send signup request with user data
      console.log("Signup Success", response.data);
      // toast.success("Signup Success");
      router.push("/login"); // Redirect to login page upon success
    } catch (error: any) {
      console.log("Signup Failed");
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Effect to enable/disable the submit button based on input field completion
  useEffect(() => {
    if (
      user.email.length > 0 &&
      user.password.length > 0 &&
      user.username.length > 0
    ) {
      setButtonDisabled(false); // Enable button when all fields have data
    } else {
      setButtonDisabled(true); // Disable button if any field is empty
    }
  }, [user]); // Re-run this effect whenever user state changes

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>{loading ? "Processing" : "Signup"}</h1>
      <hr />
      <label htmlFor="username">username</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="username"
        type="text"
        value={user.username}
        onChange={(e) => setUser({ ...user, username: e.target.value })}
        placeholder="username"
      />
      <label htmlFor="email">email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="email"
        type="text"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="email"
      />
      <label htmlFor="password">password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600 text-black"
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="password"
      />

      <button
        onClick={onSignup}
        className="p-2 border border-gray-300 rounded-lg mb-4 focus:outline-none focus:border-gray-600"
      >
        {buttonDisabled ? "No signup" : "Signup"}
      </button>
      <Link href="/login">Visit login page</Link>
    </div>
  );
}
