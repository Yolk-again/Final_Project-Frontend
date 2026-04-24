"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  getRooms,
  addRoom,
  deleteRoom,
  updateRoom,
  getBookings,
  updateBookingStatus,
} from "../../lib/store";

export default function AdminDashboard() {
  const router = useRouter();
  const [roomList, setRoomList] = useState(getRooms());
  const [bookingRequests, setBookingRequests] = useState(getBookings());

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    roomNumber: "",
    type: "Single Room",
    furniture: "Fully Furnished",
    price: "",
  });

  const refresh = () => {
    setRoomList(getRooms());
    setBookingRequests(getBookings());
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isEditing && editId) {
      updateRoom(editId, formData);
    } else {
      addRoom({ id: Date.now(), ...formData });
    }

    setIsEditing(false);
    setEditId(null);
    setFormData({
      roomNumber: "",
      type: "Single Room",
      furniture: "Fully Furnished",
      price: "",
    });
    refresh();
  };

  const inputClass =
    "mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-black placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:shadow-sm";

  const labelClass = "block text-sm font-semibold text-slate-700";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        {/* TOP BAR */}
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/75 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.25em] text-blue-600 uppercase">
              Unidorm
            </p>
            <h1 className="mt-1 text-3xl font-bold text-slate-900">
              Admin Dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage rooms and review booking requests.
            </p>
          </div>

          <button
            onClick={() => router.push("/")}
            className="rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {/* ROOM MANAGEMENT FORM */}
          <div className="h-fit rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            <h2 className="mb-2 text-2xl font-bold text-slate-900">
              {isEditing ? "Edit Room" : "Add New Room"}
            </h2>
            <p className="mb-6 text-sm text-slate-500">
              Fill in the room details below.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className={labelClass}>Room Number</label>
                <input
                  className={inputClass}
                  placeholder="Enter room number"
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, roomNumber: e.target.value })
                  }
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Room Type</label>
                <select
                  className={inputClass}
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                >
                  <option>Single Room</option>
                  <option>Studio Room</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Furniture</label>
                <select
                  className={inputClass}
                  value={formData.furniture}
                  onChange={(e) =>
                    setFormData({ ...formData, furniture: e.target.value })
                  }
                >
                  <option>Fully Furnished</option>
                  <option>Basic Type</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Price (THB)</label>
                <input
                  type="number"
                  className={inputClass}
                  placeholder="Enter price"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: e.target.value })
                  }
                  required
                />
              </div>

              <button className="mt-2 w-full rounded-2xl bg-blue-600 py-3.5 font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700">
                {isEditing ? "Update Room" : "Create Room"}
              </button>
            </form>
          </div>

          {/* LISTS SECTION */}
          <div className="space-y-10 lg:col-span-2">
            {/* CURRENT ROOMS */}
            <section className="rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Current Rooms
                  </h2>
                  <p className="text-sm text-slate-500">
                    Rooms currently stored in the system.
                  </p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {roomList.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-bold text-slate-800">
                          Room {r.roomNumber}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          {r.type} • {r.furniture}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-blue-600">
                          {Number(r.price).toLocaleString()} THB
                        </p>
                      </div>

                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setIsEditing(true);
                            setEditId(r.id);
                            setFormData(r);
                          }}
                          className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            deleteRoom(r.id);
                            refresh();
                          }}
                          className="text-sm font-semibold text-red-500 hover:text-red-600"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* BOOKING REQUESTS */}
            <section className="rounded-[2rem] border border-white/60 bg-white/75 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Booking Requests
                </h2>
                <p className="text-sm text-slate-500">
                  Review and respond to student booking requests.
                </p>
              </div>

              <div className="space-y-4">
                {bookingRequests.map((b) => (
                  <div
                    key={b.id}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <p className="font-bold text-slate-800">
                          Student: {b.studentId}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-blue-600">
                          Room {b.roomNumber}
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
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

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => {
                          updateBookingStatus(b.id, "Approved");
                          refresh();
                        }}
                        className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => {
                          updateBookingStatus(b.id, "Rejected");
                          refresh();
                        }}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}