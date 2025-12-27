"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5500/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        setError("Server error. Please check backend connection.");
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError(data.message || data.error || "Login failed");
        setLoading(false);
        return;
      }

      // Login successful
      setLoading(false);
      // You can store user data in localStorage or state management here
      localStorage.setItem("user", JSON.stringify(data.user));
      router.push("/dashboard"); // Redirect to dashboard (create this page later)
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gray-100 bg-cover bg-center"
      style={{ backgroundImage: "url(/image1.png)" }}
    >
      <div className="w-full max-w-6xl mx-4">
        <div className="bg-black rounded-3xl overflow-hidden shadow-2xl flex">
          {/* Left Panel - Dark with Image */}
          <div className="w-1/2 relative bg-black flex flex-col justify-between p-8 min-h-[600px]">
            <div className="text-white text-2xl font-sans font-semibold z-10">
              GearGaurd
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/image2.png"
                alt="Abstract shapes"
                className="max-w-full max-h-full object-contain opacity-80"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <div className="text-white text-5xl font-sans font-bold z-10">
              Welcome Back!
            </div>
          </div>

          {/* Right Panel - Login Form */}
          <div className="w-1/2 bg-white rounded-r-3xl p-12 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-black mb-8 font-sans">
              Log in
            </h1>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email Address"
                    className="w-full pl-12 pr-4 py-3 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 placeholder-gray-500"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                      />
                    </svg>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className="w-full pl-12 pr-12 py-3 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 placeholder-gray-500"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg
                      className="w-5 h-5 text-gray-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && <div className="text-red-500 text-sm">{error}</div>}

              {/* Remember Me and Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="mr-2 w-4 h-4 rounded border-gray-300"
                  />
                  <span className="text-sm">Remember Me</span>
                </label>
                <button
                  type="button"
                  onClick={() => router.push("/forgot-password")}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Forgot Password?
                </button>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "Logging in..." : "Log in"}
              </button>

              {/* Or Separator */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Or</span>
                </div>
              </div>

              {/* Sign Up Button */}
              <button
                type="button"
                onClick={() => router.push("/signup")}
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
