'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:5500/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ full_name: fullName, email, password }),
      });

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        setError('Server error. Please check backend connection.');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        setError(data.message || data.error || 'Signup failed');
        setLoading(false);
        return;
      }

      // Signup successful
      setLoading(false);
      router.push('/login'); // Redirect to login page
    } catch (err) {
      setError('Network error. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 bg-cover bg-center" style={{ backgroundImage: 'url(/image1.png)' }}>
      <div className="w-full max-w-6xl mx-4">
        <div className="bg-black rounded-3xl overflow-hidden shadow-2xl flex">
          {/* Left Panel - Dark with Image */}
          <div className="w-1/2 relative bg-black flex flex-col justify-between p-8 min-h-[600px]">
            <div className="text-white text-2xl font-sans font-semibold z-10">GearGaurd</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src="/image2.png"
                alt="Abstract shapes"
                className="max-w-full max-h-full object-contain opacity-80"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <div className="text-white text-5xl font-sans font-bold z-10">Welcome!</div>
          </div>

          {/* Right Panel - Signup Form */}
          <div className="w-1/2 bg-white rounded-r-3xl p-12 flex flex-col justify-center">
            <h1 className="text-4xl font-bold text-black mb-8 font-sans">Sign up</h1>

            <form onSubmit={handleSignup} className="space-y-6">
              {/* Full Name Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Full Name</label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Daniel Gallego"
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 placeholder-gray-400"
                  required
                />
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@reallygreatsite.com"
                  className="w-full px-4 py-3 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 placeholder-gray-400"
                  required
                />
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 placeholder-gray-400"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Confirm Password Field */}
              <div>
                <label className="block text-gray-700 text-sm font-medium mb-2">Confirm Password</label>
                <div className="relative">
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
                    className="w-full px-4 py-3 pr-12 bg-gray-100 rounded-lg border-none focus:outline-none focus:ring-2 focus:ring-gray-300 text-gray-700 placeholder-gray-400"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}

              {/* Create Account Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gray-800 text-white py-3 rounded-lg font-semibold hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating Account...' : 'Create Account'}
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

              {/* Log in Button */}
              <button
                type="button"
                onClick={() => router.push('/login')}
                className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
              >
                Log in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

