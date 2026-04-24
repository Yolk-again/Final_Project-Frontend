/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getRooms, createBooking, getBookings } from "../lib/store";

export default function StudentPage() {
  const router = useRouter();
  const [view, setView] = useState<"available" | "my">("available");
  const [myBookings, setMyBookings] = useState<any[]>([]);
  const studentId = "68101123";

  useEffect(() => {
    const interval = setInterval(
      () =>
        setMyBookings(getBookings().filter((b) => b.studentId === studentId)),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-10 flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.25em] text-blue-600 uppercase">
              Unidorm
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Student Portal
            </h1>
            <p className="text-sm text-slate-500">
              Browse rooms and manage your bookings
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex rounded-lg bg-slate-200 p-1">
              <button
                onClick={() => setView("available")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                  view === "available"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600"
                }`}
              >
                Available
              </button>
              <button
                onClick={() => setView("my")}
                className={`px-4 py-2 rounded-md text-sm font-semibold transition ${
                  view === "my"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-slate-600"
                }`}
              >
                My Bookings
              </button>
            </div>

            <button
              onClick={() => router.push("/")}
              className="rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        {/* CONTENT */}
        {view === "available" ? (
          <div className="grid gap-6 md:grid-cols-2">
            {getRooms().map((r) => (
              <div
                key={r.id}
                className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl"
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-slate-900">
                    Room {r.roomNumber}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {r.type} • {r.furniture}
                  </p>
                  <p className="mt-2 text-sm font-semibold text-blue-600">
                    {Number(r.price).toLocaleString()} THB
                  </p>
                </div>

                <button
                  onClick={() => {
                    createBooking({
                      id: Date.now(),
                      studentId,
                      roomNumber: r.roomNumber,
                      type: r.type,
                      furniture: r.furniture,
                      price: r.price,
                      status: "Pending",
                    });
                    setView("my");
                  }}
                  className="mt-4 w-full rounded-2xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700"
                >
                  Book Now
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-slate-900">
                My Bookings
              </h2>
              <p className="text-sm text-slate-500">
                Track your booking requests and statuses
              </p>
            </div>

            <div className="space-y-4">
              {myBookings.map((b) => (
                <div
                  key={b.id}
                  className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
                >
                  <div>
                    <p className="text-lg font-bold text-slate-800">
                      Room {b.roomNumber}
                    </p>
                    <p className="text-sm text-slate-500">
                      {b.type} • {b.furniture} •{" "}
                      {Number(b.price).toLocaleString()} THB
                    </p>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1 text-xs font-bold ${
                      b.status === "Approved"
                        ? "bg-green-100 text-green-700"
                        : b.status === "Rejected"
                        ? "bg-red-100 text-red-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {b.status}
                  </span>
                </div>
              ))}

              {myBookings.length === 0 && (
                <p className="text-slate-400 italic">
                  No bookings yet.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}