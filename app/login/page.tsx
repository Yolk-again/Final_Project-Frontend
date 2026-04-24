"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [role, setRole] = useState("student");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (role === "admin") {
      router.push("/admin/dashboard");
    } else {
      router.push("/rooms");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl grid items-center gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <p className="text-sm font-semibold tracking-[0.25em] text-blue-600 uppercase">
            Unidorm
          </p>
          <h1 className="text-5xl font-bold leading-tight text-slate-900">
            Welcome back to
            <span className="block text-blue-600">your dorm system</span>
          </h1>
          <p className="max-w-md text-base leading-7 text-slate-600">
            Log in to access your personalized dashboard, manage your bookings,
            and continue where you left off.
          </p>

          <div className="grid gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Student and admin access
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Secure sign in
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Fast navigation to your dashboard
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">Login</h2>
            <p className="mt-1 text-sm text-slate-500">
              Choose your role and sign in.
            </p>
          </div>

          <div className="flex rounded-lg bg-slate-100 p-1 mb-6">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${
                role === "student"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => setRole("admin")}
              className={`flex-1 rounded-md py-2 text-sm font-semibold transition ${
                role === "admin"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700">
                {role === "student" ? "Student ID Number" : "Admin ID Number"}
              </label>
              <input
                type="text"
                required
                placeholder={
                  role === "student" ? "Student ID Number" : "Admin ID Number"
                }
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-black outline-none transition focus:border-blue-500 focus:shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                required
                placeholder="Password"
                className="mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-black outline-none transition focus:border-blue-500 focus:shadow-sm"
              />
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Login as {role === "student" ? "Student" : "Admin"}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-200 pt-5 text-center">
            <p className="text-sm text-slate-500">
              Don&apos;t have an account yet?{" "}
              <button
                onClick={() => router.push("/register")}
                className="font-semibold text-blue-600 hover:underline"
              >
                Register
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}