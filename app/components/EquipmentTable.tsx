"use client";

import { useState } from "react";
import EquipmentCategoriesModal from "./EquipmentCategoriesModal";

interface Equipment {
  id: number;
  name: string;
  employee_name: string | null;
  department: string | null;
  serial_number: string | null;
  technician_name: string | null;
  category_name: string | null;
  company_name: string | null;
}

interface EquipmentTableProps {
  data: Equipment[];
  onRowClick?: (equipment: Equipment) => void;
  isSelectionMode?: boolean;
}

export default function EquipmentTable({
  data,
  onRowClick,
  isSelectionMode = false,
}: EquipmentTableProps) {
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);

  return (
    <>
      <div className="bg-white rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="px-6 py-4 text-left font-semibold">
                Equipment Name
              </th>
              <th className="px-6 py-4 text-left font-semibold">Employee</th>
              <th className="px-6 py-4 text-left font-semibold">Department</th>
              <th className="px-6 py-4 text-left font-semibold">
                Serial Number
              </th>
              <th className="px-6 py-4 text-left font-semibold">Technician</th>
              <th className="px-6 py-4 text-left font-semibold">
                <button
                  onClick={() => setShowCategoriesModal(true)}
                  className="hover:underline cursor-pointer"
                >
                  Equipment Category
                </button>
              </th>
              <th className="px-6 py-4 text-left font-semibold">Company</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick && onRowClick(row)}
                className={`border-b border-gray-200 ${
                  onRowClick ? "hover:bg-gray-50 cursor-pointer" : ""
                }`}
              >
                <td className="px-6 py-4 text-gray-800">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRowClick && onRowClick(row);
                    }}
                    className="text-blue-600 hover:underline cursor-pointer"
                  >
                    {row.name}
                  </button>
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {row.employee_name || "-"}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {row.department || "-"}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {row.serial_number || "-"}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {row.technician_name || "-"}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {row.category_name || "-"}
                </td>
                <td className="px-6 py-4 text-gray-600">
                  {row.company_name || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <EquipmentCategoriesModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
        mode="view"
      />
    </>
  );
}
