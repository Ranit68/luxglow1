"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function SignupPage() {

  const router = useRouter();
  const { user } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /* Redirect logged user */
  useEffect(() => {
    if (user) router.replace("/");
  }, [user, router]);

  /* Signup */
  const handleSignup = async (e) => {
    e.preventDefault();

    setError("");

    if (password !== confirmPassword) {
      return setError("Passwords do not match");
    }

    if (password.length < 6) {
      return setError("Password must be at least 6 characters");
    }

    setLoading(true);

    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // ✅ Save user name in Firebase Auth
      await updateProfile(res.user, {
        displayName: name,
      });

      router.replace("/");

    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF6F0] px-4">

      <form
        onSubmit={handleSignup}
        className="bg-white p-10 rounded-3xl shadow-xl w-full max-w-md space-y-4"
      >

        <h1 className="text-3xl text-[#5A0F1C] font-semibold text-center mb-4">
          Create Account
        </h1>

        {/* NAME */}
        <input
          type="text"
          placeholder="Full Name"
          required
          value={name}
          onChange={(e)=>setName(e.target.value)}
          className="input-modern"
        />

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="input-modern"
        />

        {/* PASSWORD */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="input-modern pr-12"
          />

          <button
            type="button"
            onClick={()=>setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
          </button>
        </div>

        {/* CONFIRM PASSWORD */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(e)=>setConfirmPassword(e.target.value)}
            className="input-modern pr-12"
          />

          <button
            type="button"
            onClick={()=>setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
          </button>
        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 text-sm text-center">
            {error}
          </p>
        )}

        {/* BUTTON */}
        <button
          disabled={loading}
          className="w-full py-3 rounded-full text-white
          bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37]
          hover:opacity-90 transition"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="text-sm text-center mt-4">
          Already have an account?{" "}
          <span
            onClick={()=>router.replace("/login")}
            className="text-[#5A0F1C] cursor-pointer font-medium"
          >
            Login
          </span>
        </p>

      </form>

    </main>
  );
}