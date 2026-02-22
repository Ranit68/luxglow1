"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {

  const router = useRouter();
  const { user } = useAuth();

  const searchParams = useSearchParams();
const redirect = searchParams.get("redirect") || "/";
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  /* ✅ Prevent logged users */
  useEffect(() => {
    if (user) {
      router.replace(redirect);
    }
  }, [user, router]);

  /* ✅ Login */
  const handleLogin = async (e) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.replace("/");
    } catch {
      setError("Invalid email or password");
    }

    setLoading(false);
  };

  /* ✅ Skip Login */
  const handleSkip = () => {
    router.replace("/");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#FAF6F0] px-4">

      <form
        onSubmit={handleLogin}
        className="relative bg-white p-10 rounded-3xl shadow-xl w-full max-w-md"
      >

        {/* ✅ Skip Button */}
        <button
          type="button"
          onClick={handleSkip}
          className="absolute top-5 right-6 text-sm text-gray-500 hover:text-[#5A0F1C]"
        >
          Skip →
        </button>

        <h1 className="text-3xl text-[#5A0F1C] mb-6 font-semibold text-center">
          Welcome Back
        </h1>

        {/* EMAIL */}
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          className="w-full border p-3 rounded-xl mb-4 outline-none
          focus:ring-2 focus:ring-[#5A0F1C]"
        />

        {/* PASSWORD WITH EYE ICON */}
        <div className="relative mb-4">

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full border p-3 rounded-xl pr-12 outline-none
            focus:ring-2 focus:ring-[#5A0F1C]"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"
          >
            {showPassword ? <EyeOff size={20}/> : <Eye size={20}/>}
          </button>

        </div>

        {/* ERROR */}
        {error && (
          <p className="text-red-500 mb-3 text-sm text-center">
            {error}
          </p>
        )}

        {/* LOGIN BUTTON */}
        <button
          disabled={loading}
          className="w-full py-3 rounded-full text-white
          bg-gradient-to-r from-[#5A0F1C] to-[#D4AF37]
          hover:opacity-90 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/* SIGNUP */}
        <p className="mt-6 text-sm text-center">
          No account?{" "}
          <span
            onClick={()=>router.replace("/signup")}
            className="text-[#5A0F1C] cursor-pointer font-medium"
          >
            Sign up
          </span>
        </p>

      </form>

    </main>
  );
}