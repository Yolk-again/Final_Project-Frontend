"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

const STUDENT_PREFIX = "68306130";
const ADMIN_PREFIX = "77006131";
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{8,}$/;

type ToastType = "success" | "error";

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
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(
    null,
  );
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type });

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      setToast(null);
    }, 2500);
  };

  const normalizeDigits = (value: string) => value.replace(/\D/g, "").slice(0, 10);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "Please enter the name";

    if (!formData.email.trim()) {
      newErrors.email = "Please enter email address";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email)) {
        newErrors.email = "Please enter a valid email format";
      }
    }

    if (!formData.password) {
      newErrors.password = "Please enter the password";
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      newErrors.password =
        "Password must be at least 8 characters and include 1 lowercase letter, 1 uppercase letter, and 1 symbol";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (role === "student") {
      if (!formData.gender) newErrors.gender = "Please select the gender";

      if (!formData.studentId) {
        newErrors.studentId = "Please enter the student ID";
      } else if (!new RegExp(`^${STUDENT_PREFIX}\\d{2}$`).test(formData.studentId)) {
        newErrors.studentId = `Student ID must start with ${STUDENT_PREFIX} and end with exactly 2 digits`;
      }
    }

    if (role === "admin") {
      if (!formData.adminId) {
        newErrors.adminId = "Please enter the admin ID";
      } else if (!new RegExp(`^${ADMIN_PREFIX}\\d{2}$`).test(formData.adminId)) {
        newErrors.adminId = `Admin ID must start with ${ADMIN_PREFIX} and end with exactly 2 digits`;
      }
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      showToast(Object.values(newErrors)[0], "error");
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const payload =
        role === "student"
          ? {
              role: "student",
              gender: formData.gender,
              name: formData.name,
              email: formData.email,
              studentId: formData.studentId,
              password: formData.password,
            }
          : {
              role: "admin",
              name: formData.name,
              email: formData.email,
              adminId: formData.adminId,
              password: formData.password,
            };

      const res = await fetch("http://localhost:3001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      const message = Array.isArray(data?.message)
        ? data.message.join(", ")
        : data?.message;

      if (!res.ok) {
        showToast(message || "Registration failed", "error");
        return;
      }

      showToast("Registration successful", "success");

      setTimeout(() => {
        router.replace("/login");
      }, 900);
    } catch (error) {
      console.error(error);
      showToast("Something went wrong", "error");
    }
  };

  const inputClass =
    "w-full rounded-2xl border bg-white px-4 py-3 text-black placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:shadow-sm";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center px-6 py-10">
      {toast && (
        <div
          className={`fixed right-6 top-6 z-50 rounded-2xl border px-4 py-3 shadow-lg backdrop-blur-xl ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-700"
              : "border-red-200 bg-red-50 text-red-700"
          }`}
        >
          <p className="text-sm font-semibold">{toast.message}</p>
        </div>
      )}

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
        </div>

        <div className="rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
          <h2 className="mb-4 text-2xl font-bold text-slate-900">
            Create Your Account
          </h2>

          <div className="mb-6 flex rounded-lg bg-slate-100 p-1">
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

          <form onSubmit={handleRegister} className="space-y-4">
            {role === "student" && (
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">
                  Gender
                </label>
                <div className="flex gap-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="gender"
                      value="Boy"
                      className="h-4 w-4"
                      checked={formData.gender === "Boy"}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    />
                    Male
                  </label>
                  <label className="flex items-center gap-2 text-sm text-slate-700">
                    <input
                      type="radio"
                      name="gender"
                      value="Girl"
                      className="h-4 w-4"
                      checked={formData.gender === "Girl"}
                      onChange={(e) =>
                        setFormData({ ...formData, gender: e.target.value })
                      }
                    />
                    Female
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
                value={formData.name}
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
                value={formData.email}
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
                {role === "student" ? "Student ID Number" : "Admin ID Number"}
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={10}
                placeholder={
                  role === "student" ? "68306130XX" : "77006131XX"
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
                value={role === "student" ? formData.studentId : formData.adminId}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    [role === "student"
                      ? "studentId"
                      : "adminId"]: normalizeDigits(e.target.value),
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
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <p className="mt-1 text-xs text-slate-500">
                At least 8 characters, 1 lowercase letter, 1 uppercase letter,
                and 1 symbol.
              </p>
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
                value={formData.confirmPassword}
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
        </div>
      </div>
    </div>
  );
}