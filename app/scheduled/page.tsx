"use client";

import { useState, useEffect, Suspense } from "react";
import Sidebar from "../components/Sidebar";

const API_BASE_URL = "http://localhost:5500";

function ScheduledContent() {
  const [user, setUser] = useState<any>(null);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedRequests, setSelectedRequests] = useState<any[]>([]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchMaintenanceRequests();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const filtered = maintenanceRequests.filter((req) => {
        if (!req.scheduled_date) return false;
        const reqDate = new Date(req.scheduled_date);
        return (
          reqDate.getDate() === selectedDate.getDate() &&
          reqDate.getMonth() === selectedDate.getMonth() &&
          reqDate.getFullYear() === selectedDate.getFullYear()
        );
      });
      setSelectedRequests(filtered);
    } else {
      setSelectedRequests([]);
    }
  }, [selectedDate, maintenanceRequests]);

  const fetchMaintenanceRequests = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/maintenance`);
      if (res.ok) {
        const data = await res.json();
        setMaintenanceRequests(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching maintenance requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: (Date | null)[] = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }
    
    return days;
  };

  const getRequestsForDate = (date: Date | null) => {
    if (!date) return [];
    return maintenanceRequests.filter((req) => {
      if (!req.scheduled_date) return false;
      const reqDate = new Date(req.scheduled_date);
      return (
        reqDate.getDate() === date.getDate() &&
        reqDate.getMonth() === date.getMonth() &&
        reqDate.getFullYear() === date.getFullYear()
      );
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(currentDate);
    if (direction === "prev") {
      newDate.setMonth(newDate.getMonth() - 1);
    } else {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    setCurrentDate(newDate);
    setSelectedDate(null);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar activeRoute="/scheduled" />
        <div className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeRoute="/scheduled" />
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
            <div>
              <div className="font-semibold text-gray-800">
                {user?.full_name || "User"}
              </div>
              <div className="text-sm text-gray-600">
                {user?.role || "Maintenance Manager"}
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Scheduled Maintenance</h2>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigateMonth("prev")}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Previous
                </button>
                <span className="text-lg font-semibold min-w-[200px] text-center">
                  {formatDate(currentDate)}
                </span>
                <button
                  onClick={() => navigateMonth("next")}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 py-2 bg-gray-800 text-white rounded"
                >
                  Today
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-4">
              {days.map((day) => (
                <div
                  key={day}
                  className="p-2 text-center font-semibold text-gray-700"
                >
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 gap-2">
              {getDaysInMonth(currentDate).map((date, index) => {
                const requests = getRequestsForDate(date);
                const isSelected =
                  selectedDate &&
                  date &&
                  date.getTime() === selectedDate.getTime();
                const isToday =
                  date &&
                  date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={index}
                    onClick={() => date && setSelectedDate(date)}
                    className={`min-h-[100px] p-2 border rounded cursor-pointer ${
                      isSelected
                        ? "bg-blue-100 border-blue-500"
                        : "hover:bg-gray-50"
                    } ${!date ? "bg-gray-100" : ""} ${
                      isToday ? "border-2 border-blue-400" : ""
                    }`}
                  >
                    {date && (
                      <>
                        <div
                          className={`font-semibold mb-1 ${
                            isToday ? "text-blue-600" : "text-gray-800"
                          }`}
                        >
                          {date.getDate()}
                        </div>
                        <div className="space-y-1">
                          {requests.slice(0, 2).map((req) => (
                            <div
                              key={req.id}
                              className="text-xs bg-blue-500 text-white px-1 py-0.5 rounded truncate"
                              title={req.subject}
                            >
                              {req.subject}
                            </div>
                          ))}
                          {requests.length > 2 && (
                            <div className="text-xs text-gray-500">
                              +{requests.length - 2} more
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>

            {selectedDate && (
              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-4">
                  Scheduled Tasks for {selectedDate.toLocaleDateString()}
                </h3>
                {selectedRequests.length > 0 ? (
                  <div className="space-y-2">
                    {selectedRequests.map((req) => (
                      <div
                        key={req.id}
                        className="p-3 bg-white border rounded-lg hover:shadow-md"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-gray-800">
                              {req.subject}
                            </div>
                            <div className="text-sm text-gray-600">
                              Equipment: {req.equipment_name || "N/A"} | Status:{" "}
                              {req.status_name || "N/A"}
                            </div>
                            {req.priority && (
                              <span
                                className={`inline-block mt-1 px-2 py-1 text-xs rounded ${
                                  req.priority === "High"
                                    ? "bg-red-100 text-red-800"
                                    : req.priority === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {req.priority}
                              </span>
                            )}
                          </div>
                          <div className="text-sm text-gray-500">
                            {req.duration ? `${req.duration} hours` : ""}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No scheduled tasks for this date.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ScheduledPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen">
        <Sidebar activeRoute="/scheduled" />
        <div className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      </div>
    }>
      <ScheduledContent />
    </Suspense>
  );
}

