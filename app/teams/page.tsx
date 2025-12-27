"use client";

import { useState, useEffect, Suspense } from "react";
import Sidebar from "../components/Sidebar";
import TeamsTable from "../components/TeamsTable";

function TeamsContent() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeRoute="/teams" />
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
          <TeamsTable />
        </div>
      </div>
    </div>
  );
}

export default function TeamsPage() {
  return (
    <Suspense fallback={
      <div className="flex h-screen">
        <Sidebar activeRoute="/teams" />
        <div className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      </div>
    }>
      <TeamsContent />
    </Suspense>
  );
}

