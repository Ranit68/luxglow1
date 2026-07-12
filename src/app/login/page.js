"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const redirect = searchParams.get("redirect") || "/";
  const encodedRedirect = encodeURIComponent(redirect);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) router.replace(redirect);
  }, [redirect, router, user]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace(redirect);
    } catch {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FAF6F0] px-4">
      <form
        onSubmit={handleLogin}
        className="relative w-full max-w-md rounded-3xl bg-white p-10 shadow-xl"
      >
        <Link
          href="/"
          className="absolute right-6 top-5 text-sm text-gray-500 transition hover:text-[#5A0F1C]"
        >
          Browse only
        </Link>

        <h1 className="mb-2 text-center text-3xl font-semibold text-[#5A0F1C]">
          Welcome Back
        </h1>
        <p className="mb-6 text-center text-sm text-[#6B4A42]">
          Login to access saved products, cart, and checkout.
        </p>

        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="mb-4 w-full rounded-xl border p-3 outline-none focus:ring-2 focus:ring-[#5A0F1C]"
        />

        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border p-3 pr-12 outline-none focus:ring-2 focus:ring-[#5A0F1C]"
          />

          <button
            type="button"
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>

        {error && <p className="mb-3 text-center text-sm text-red-500">{error}</p>}

        <button
          disabled={loading}
          className="w-full rounded-full bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37] py-3 text-white transition hover:opacity-90"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <p className="mt-6 text-center text-sm">
          No account?{" "}
          <Link href={`/signup?redirect=${encodedRedirect}`} className="font-medium text-[#5A0F1C]">
            Sign up
          </Link>
        </p>
      </form>
    </main>
  );
}
