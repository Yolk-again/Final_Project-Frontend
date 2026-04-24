"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 flex items-center justify-center px-6">
      <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-center">

        {/* LEFT SIDE (TEXT) */}
        <div className="space-y-6">
          <p className="text-sm font-semibold text-blue-600 tracking-wide">
            Unidorm - Dorm Management System
          </p>

          <h2 className="text-5xl font-bold text-slate-900 leading-tight">
            Manage Your <br />
            <span className="text-blue-600">University Dorm</span> Easily
          </h2>

          <p className="text-slate-600 text-base leading-relaxed max-w-md">
            CoC Unidorm helps students and administrators manage room bookings,
            availability, and accommodation records in a clean and efficient way.
          </p>

          {/* FEATURES */}
          <div className="space-y-2 text-sm text-slate-600">
            <p>✔ Smart room booking system</p>
            <p>✔ Real-time availability tracking</p>
            <p>✔ Admin dashboard control</p>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-4">
            <button
              onClick={() => router.push("/login")}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold shadow-md hover:bg-blue-700"
            >
              Login
            </button>

            <button
              onClick={() => router.push("/register")}
              className="px-6 py-3 bg-white border border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-100"
            >
              Register
            </button>
          </div>
        </div>

        {/* RIGHT SIDE (CARD UI) */}
        <div className="bg-white/70 backdrop-blur-lg border border-slate-200 rounded-3xl shadow-xl p-8 space-y-6">

          <h2 className="text-xl font-semibold text-slate-800">
            Quick Overview
          </h2>

          {/* CARD ITEMS */}
          <div className="space-y-4">

            <div className="p-4 rounded-xl bg-slate-100 border">
              <h3 className="font-semibold text-slate-800">
                Student Access
              </h3>
              <p className="text-sm text-slate-600">
                Browse available rooms and make bookings in seconds.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 border">
              <h3 className="font-semibold text-slate-800">
                Admin Control
              </h3>
              <p className="text-sm text-slate-600">
                Manage rooms, approvals, and student data easily.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-100 border">
              <h3 className="font-semibold text-slate-800">
                Organized System
              </h3>
              <p className="text-sm text-slate-600">
                Keep all dorm-related operations in one place.
              </p>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}