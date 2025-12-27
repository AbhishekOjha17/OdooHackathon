"use client";

import { useState, useEffect } from "react";

interface MaintenanceRequest {
  id: number;
  subject: string;
  employee_name: string | null;
  technician_name: string | null;
  category_name: string | null;
  status_name: string | null;
  company_name: string | null;
}

interface ActivityTableProps {
  data: MaintenanceRequest[];
  onRowClick: (id: number) => void;
}

export default function ActivityTable({ data, onRowClick }: ActivityTableProps) {
  const [currentUserName, setCurrentUserName] = useState<string>("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUserName(user.full_name || "");
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);
  return (
    <div className="bg-white rounded-lg overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-800 text-white">
          <tr>
            <th className="px-6 py-4 text-left font-semibold">Subjects</th>
            <th className="px-6 py-4 text-left font-semibold">Created By</th>
            <th className="px-6 py-4 text-left font-semibold">Employee</th>
            <th className="px-6 py-4 text-left font-semibold">Technician</th>
            <th className="px-6 py-4 text-left font-semibold">Category</th>
            <th className="px-6 py-4 text-left font-semibold">Stage</th>
            <th className="px-6 py-4 text-left font-semibold">Company</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr
              key={row.id}
              onClick={() => onRowClick(row.id)}
              className="border-b border-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              <td className="px-6 py-4 text-gray-800">{row.subject}</td>
              <td className="px-6 py-4 text-gray-600">{currentUserName || row.employee_name || "-"}</td>
              <td className="px-6 py-4 text-gray-600">{row.employee_name || "-"}</td>
              <td className="px-6 py-4 text-gray-600">{row.technician_name || "-"}</td>
              <td className="px-6 py-4 text-gray-600">{row.category_name || "-"}</td>
              <td className="px-6 py-4 text-gray-600">{row.status_name || "-"}</td>
              <td className="px-6 py-4 text-gray-600">{row.company_name || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

