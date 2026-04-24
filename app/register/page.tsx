"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const [role, setRole] = useState<"student" | "admin">("student");

  const [formData, setFormData] = useState({
    gender: "",
    name: "",
    email: "",
    studentId: "",
    adminId: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Please enter the name";
    if (!formData.password) newErrors.password = "Please enter the password";

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords are not match";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (role === "student") {
      if (!formData.gender) newErrors.gender = "Please select the gender";

      if (!formData.email) {
        newErrors.email = "Please enter email address";
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email format";
      }

      if (!formData.studentId) {
        newErrors.studentId = "Please enter the student id number";
      }
    }

    if (role === "admin") {
      if (!formData.email) {
        newErrors.email = "Please enter email address";
      } else if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email format";
      }

      if (!formData.adminId) {
        newErrors.adminId = "Please enter admin id";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setErrors({});
      router.push("/login");
    }
  };

  const inputClass =
    "w-full rounded-2xl border bg-white px-4 py-3 text-black placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:shadow-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-6xl grid items-center gap-12 md:grid-cols-2">
        <div className="space-y-6">
          <p className="text-sm font-semibold tracking-[0.25em] text-blue-600 uppercase">
            Unidorm
          </p>

          <h1 className="text-5xl font-bold leading-tight text-slate-900">
            Create your
            <span className="block text-blue-600">account today</span>
          </h1>

          <p className="max-w-md text-base leading-7 text-slate-600">
            Register as a student or administrator to manage dorm rooms,
            bookings, and system access efficiently.
          </p>

          <div className="grid gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Student & admin accounts
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Secure authentication
            </div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-blue-600" />
              Fast system access
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Create Your Account
          </h2>

          <div className="mb-6 flex rounded-lg bg-slate-200 p-1">
            <button
              type="button"
              onClick={() => setRole("student")}
              className={`flex-1 py-2 rounded-md text-sm font-semibold ${
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
              className={`flex-1 py-2 rounded-md text-sm font-semibold ${
                role === "admin"
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600"
              }`}
            >
              Admin
            </button>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {role === "student" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Gender
                </label>
                <div
                  className={`flex gap-6 rounded-2xl border p-4 ${
                    errors.gender
                      ? "border-red-400 bg-red-50"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="gender"
                      value="Boy"
                      className="h-4 w-4"
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    />
                    Boy
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="gender"
                      value="Girl"
                      className="h-4 w-4"
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    />
                    Girl
                  </label>
                </div>
                {errors.gender && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {errors.gender}
                  </p>
                )}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter your full name"
                className={`${inputClass} ${
                  errors.name ? "border-red-400" : "border-slate-200"
                }`}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              {errors.name && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Email Address
              </label>
              <input
                type="text"
                placeholder="Enter your email address"
                className={`${inputClass} ${
                  errors.email ? "border-red-400" : "border-slate-200"
                }`}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
              {errors.email && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.email}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                {role === "student" ? "Student ID Number" : "Admin ID"}
              </label>
              <input
                type="text"
                placeholder={
                  role === "student"
                    ? "Enter your student ID number"
                    : "Enter your admin ID"
                }
                className={`${inputClass} ${
                  role === "student"
                    ? errors.studentId
                      ? "border-red-400"
                      : "border-slate-200"
                    : errors.adminId
                      ? "border-red-400"
                      : "border-slate-200"
                }`}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [role === "student" ? "studentId" : "adminId"]:
                      e.target.value,
                  })
                }
              />
              {(errors.studentId || errors.adminId) && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.studentId || errors.adminId}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Password
              </label>
              <input
                type="password"
                placeholder="Enter your password"
                className={`${inputClass} ${
                  errors.password ? "border-red-400" : "border-slate-200"
                }`}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              {errors.password && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="Confirm your password"
                className={`${inputClass} ${
                  errors.confirmPassword ? "border-red-400" : "border-slate-200"
                }`}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              {errors.confirmPassword && (
                <p className="mt-1 text-xs font-medium text-red-500">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="mt-2 w-full rounded-2xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
            >
              Register Now
            </button>
          </form>

          <div className="mt-8 border-t border-slate-200 pt-5 text-center">
            <p className="text-sm text-slate-500">
              Alread&apos;y have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="font-semibold text-blue-600 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}