"use client";

import { useState } from "react";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email,setEmail] = useState("");
  const [password,setPassword] = useState("");
  const [loading,setLoading] = useState(false);
  const [error,setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createUserWithEmailAndPassword(auth,email,password);
      router.push("/");
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF6F0] pt-24">
      <form onSubmit={handleSignup}
        className="bg-white p-10 rounded-3xl shadow-xl w-[400px]">

        <h1 className="text-3xl text-[#5A0F1C] mb-6 font-semibold">
          Create Account
        </h1>

        <input
          type="email"
          placeholder="Email"
          required
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full border p-3 rounded-xl mb-4"
        />

        <input
          type="password"
          placeholder="Password"
          required
          onChange={(e)=>setPassword(e.target.value)}
          className="w-full border p-3 rounded-xl mb-4"
        />

        {error && <p className="text-red-500 mb-3 text-sm">{error}</p>}

        <button
          disabled={loading}
          className="w-full py-3 rounded-full text-white 
          bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37]">
          {loading ? "Creating..." : "Sign Up"}
        </button>

        <p className="mt-5 text-sm text-center">
          Already have account? <a href="/login" className="text-[#5A0F1C]">Login</a>
        </p>
      </form>
    </main>
  );
}
