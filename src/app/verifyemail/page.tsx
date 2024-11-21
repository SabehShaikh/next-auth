"use client";
import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import Link from "next/link";

export default function VerifyEmailPage() {
  const [token, setToken] = useState("");
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);

  // Stable function using useCallback to avoid re-creation in useEffect
  const verifyUserEmail = useCallback(async () => {
    try {
      await axios.post("/api/users/verifyemail", { token });
      setVerified(true);
      setError(false);
    } catch (err: unknown) { // Use 'unknown' instead of 'any'
      setError(true);
      if (axios.isAxiosError(err)) {
        console.log(err.response?.data?.message || err.message);
      } else {
        console.error("An unexpected error occurred:", err);
      }
    }
  }, [token]); // Add 'token' as a dependency

  useEffect(() => {
    setError(false);
    const urlToken = new URLSearchParams(window.location.search).get("token");
    setToken(urlToken || "");
  }, []);

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail();
    }
  }, [token, verifyUserEmail]); // Include 'verifyUserEmail' in dependencies

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl">Verify Email</h1>
      <h2 className="p-2 bg-orange-500 text-black">
        {token ? `${token}` : "No token found"}
      </h2>

      {verified && (
        <div>
          <h2 className="text-2xl">Email Verified</h2>
          <Link href="/login">Login</Link>
        </div>
      )}
      {error && (
        <div>
          <h2 className="text-2xl bg-red-500 text-black">Verification Failed</h2>
        </div>
      )}
    </div>
  );
}
