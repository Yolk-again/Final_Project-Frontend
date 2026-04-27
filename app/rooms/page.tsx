/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/immutability */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const [roomList, setRoomList] = useState<any[]>([]);
  const [bookingRequests, setBookingRequests] = useState<any[]>([]);
  const [hiddenBookingIds, setHiddenBookingIds] = useState<number[]>([]);

  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [authChecked, setAuthChecked] = useState(false);
  const [roomNumberError, setRoomNumberError] = useState("");

  const [formData, setFormData] = useState({
    roomNumber: "",
    gender: "Male",
    type: "Single Room",
    furniture: "Fully Furnished",
    price: "",
  });

  const ROOM_NUMBER_REGEX = /^[A-Z]\d{3}$/;

  useEffect(() => {
    const role =
      sessionStorage.getItem("loggedInRole") ||
      localStorage.getItem("loggedInRole");

    if (!role || role !== "admin") {
      router.replace("/login");
      return;
    }

    const storedHidden = localStorage.getItem("hiddenBookingIds_admin");
    if (storedHidden) {
      try {
        const parsed = JSON.parse(storedHidden);
        if (Array.isArray(parsed)) {
          setHiddenBookingIds(parsed);
        }
      } catch {
        setHiddenBookingIds([]);
      }
    }

    setAuthChecked(true);
    refresh();
  }, [router]);

  useEffect(() => {
    localStorage.setItem(
      "hiddenBookingIds_admin",
      JSON.stringify(hiddenBookingIds),
    );
  }, [hiddenBookingIds]);

  const refresh = async () => {
    try {
      const roomsRes = await fetch("http://localhost:3001/rooms");
      const bookingsRes = await fetch("http://localhost:3001/bookings");

      const roomsData = await roomsRes.json();
      const bookingsData = await bookingsRes.json();

      setRoomList(roomsData);
      setBookingRequests(bookingsData);
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!ROOM_NUMBER_REGEX.test(formData.roomNumber)) {
      setRoomNumberError('Room number must be like "A101"');
      return;
    }

    try {
      const payload = {
        roomNumber: formData.roomNumber,
        gender: formData.gender,
        type: formData.type,
        furniture: formData.furniture,
        price: Number(formData.price),
      };

      if (isEditing && editId) {
        await fetch(`http://localhost:3001/rooms/${editId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch("http://localhost:3001/rooms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      setIsEditing(false);
      setEditId(null);
      setRoomNumberError("");
      setFormData({
        roomNumber: "",
        gender: "Male",
        type: "Single Room",
        furniture: "Fully Furnished",
        price: "",
      });

      await refresh();
    } catch (error) {
      console.error("Failed to save room:", error);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    sessionStorage.removeItem("loggedInRole");
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("loggedInRole");
    router.replace("/login");
  };

  const inputClass =
    "mt-1 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-black placeholder:text-slate-400 outline-none transition focus:border-blue-500 focus:shadow-sm";

  const labelClass = "block text-sm font-semibold text-slate-700";

  const getRoomStatus = (roomNumber: string) => {
    const roomBookings = bookingRequests.filter(
      (b) => b.roomNumber === roomNumber,
    );

    if (roomBookings.some((b) => b.status === "Approved")) {
      return "Occupied";
    }

    if (roomBookings.some((b) => b.status === "Pending")) {
      return "Reserved";
    }

    return "Available";
  };

  const visibleBookingRequests = bookingRequests.filter(
    (b) => !hiddenBookingIds.includes(b.id),
  );

  const handleHideBooking = (booking: any) => {
    setHiddenBookingIds((prev) => {
      if (prev.includes(booking.id)) return prev;

      const next = [...prev, booking.id];
      localStorage.setItem("hiddenBookingIds_admin", JSON.stringify(next));
      return next;
    });
  };

  const handleBookingStatus = async (booking: any, status: string) => {
    try {
      if (status === "Approved") {
        const alreadyOccupied = bookingRequests.some(
          (b) =>
            b.roomNumber === booking.roomNumber &&
            b.status === "Approved" &&
            b.id !== booking.id,
        );

        if (alreadyOccupied) {
          alert("This room is already occupied.");
          return;
        }
      }

      await fetch(`http://localhost:3001/bookings/${booking.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      await refresh();
    } catch (error) {
      console.error("Failed to update booking:", error);
    }
  };

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-6 py-8 text-slate-900">
        <div className="mx-auto flex min-h-[60vh] max-w-7xl items-center justify-center">
          <div className="rounded-2xl border border-white/60 bg-white/80 px-6 py-4 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-slate-200 px-6 py-8 text-slate-900">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 rounded-[2rem] border border-white/60 bg-white/80 p-6 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold tracking-[0.35em] text-blue-600 uppercase">
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
            onClick={handleLogout}
            className="rounded-2xl bg-red-600 px-5 py-3 font-semibold text-white shadow-lg shadow-red-200 transition hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="h-fit rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
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
                  placeholder="A101"
                  maxLength={4}
                  value={formData.roomNumber}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      roomNumber: e.target.value.toUpperCase().slice(0, 4),
                    })
                  }
                  onBlur={() => {
                    if (
                      formData.roomNumber &&
                      !ROOM_NUMBER_REGEX.test(formData.roomNumber)
                    ) {
                      setRoomNumberError('Use format like "A101"');
                    } else {
                      setRoomNumberError("");
                    }
                  }}
                  required
                />
                {roomNumberError && (
                  <p className="mt-1 text-xs font-medium text-red-500">
                    {roomNumberError}
                  </p>
                )}
              </div>

              <div>
                <label className={labelClass}>Room Gender</label>
                <select
                  className={inputClass}
                  value={formData.gender}
                  onChange={(e) =>
                    setFormData({ ...formData, gender: e.target.value })
                  }
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
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

          <div className="space-y-10 lg:col-span-2">
            <section className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900">
                    Current Rooms
                  </h2>
                  <p className="text-sm text-slate-500">
                    Rooms currently stored in the system.
                  </p>
                </div>
              </div>

              <div className="mt-6 grid gap-4 md:grid-cols-2">
                {roomList.map((r) => {
                  const locked = getRoomStatus(r.roomNumber) !== "Available";
                  const roomStatus = getRoomStatus(r.roomNumber);

                  return (
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
                            {r.gender} • {r.type} • {r.furniture}
                          </p>
                          <p className="mt-2 text-sm font-semibold text-blue-600">
                            {Number(r.price).toLocaleString()} THB
                          </p>

                          {roomStatus !== "Available" && (
                            <span
                              className={`mt-3 inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                                roomStatus === "Occupied"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-amber-100 text-amber-700"
                              }`}
                            >
                              {roomStatus}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              if (locked) return;
                              setIsEditing(true);
                              setEditId(r.id);
                              setRoomNumberError("");
                              setFormData({
                                roomNumber: r.roomNumber,
                                gender: r.gender || "Male",
                                type: r.type,
                                furniture: r.furniture,
                                price: String(r.price),
                              });
                            }}
                            disabled={locked}
                            className={`text-sm font-semibold ${
                              locked
                                ? "cursor-not-allowed text-slate-300"
                                : "text-blue-600 hover:text-blue-700"
                            }`}
                          >
                            Edit
                          </button>

                          <button
                            onClick={async () => {
                              if (locked) return;

                              try {
                                await fetch(`http://localhost:3001/rooms/${r.id}`, {
                                  method: "DELETE",
                                });
                                refresh();
                              } catch (error) {
                                console.error("Failed to delete room:", error);
                              }
                            }}
                            disabled={locked}
                            className={`text-sm font-semibold ${
                              locked
                                ? "cursor-not-allowed text-slate-300"
                                : "text-red-500 hover:text-red-600"
                            }`}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section className="rounded-[2rem] border border-white/60 bg-white/80 p-8 shadow-[0_20px_60px_rgba(15,23,42,0.10)] backdrop-blur-xl">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-slate-900">
                  Booking Requests
                </h2>
                <p className="text-sm text-slate-500">
                  Review and respond to student booking requests.
                </p>
              </div>

              <div className="space-y-4">
                {visibleBookingRequests.map((b) => (
                  <div
                    key={b.id}
                    className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
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
                    </div>

                    <div className="absolute right-4 top-4 flex items-center gap-2">
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

                      {b.status !== "Pending" && (
                        <button
                          onClick={() => handleHideBooking(b)}
                          className="grid h-8 w-8 place-items-center rounded-full bg-red-100 text-sm font-bold text-red-600 transition hover:bg-red-200 hover:text-red-700"
                          aria-label="Hide request"
                          title="Hide request"
                        >
                          ×
                        </button>
                      )}
                    </div>

                    <div className="mt-4 flex gap-3">
                      <button
                        onClick={() => handleBookingStatus(b, "Approved")}
                        className="rounded-xl bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleBookingStatus(b, "Rejected")}
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