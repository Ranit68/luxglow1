"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const redirect = searchParams.get("redirect") || "/";
  const encodedRedirect = encodeURIComponent(redirect);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (user) router.replace(redirect);
  }, [redirect, router, user]);

  const handleSignup = async (event) => {
    event.preventDefault();
    setError("");

    if (password !== confirmPassword) return setError("Passwords do not match");
    if (password.length < 6) return setError("Password must be at least 6 characters");

    setLoading(true);
    try {
      const response = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(response.user, { displayName: name });
      router.replace(redirect);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF6F0] px-4">
      <form
        onSubmit={handleSignup}
        className="w-full max-w-md space-y-4 rounded-3xl bg-white p-10 shadow-xl"
      >
        <h1 className="mb-2 text-center text-3xl font-semibold text-[#5A0F1C]">
          Create Account
        </h1>
        <p className="mb-4 text-center text-sm text-[#6B4A42]">
          Register to save products, keep your cart, and place orders.
        </p>

        <input
          type="text"
          placeholder="Full Name"
          required
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="input-modern"
        />

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="input-modern"
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="input-modern pr-12"
          />
          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm Password"
            required
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            className="input-modern pr-12"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword((value) => !value)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="text-center text-sm text-red-500">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] py-3 text-white transition hover:opacity-90"
        >
          {loading ? "Creating Account..." : "Sign Up"}
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href={`/login?redirect=${encodedRedirect}`} className="font-medium text-[#5A0F1C]">
            Login
          </Link>
        </p>
      </form>
    </main>
  );
}
