"use client";

import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5500";

interface EquipmentCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (category: any) => void;
  mode?: "selection" | "view";
}

export default function EquipmentCategoriesModal({
  isOpen,
  onClose,
  onSelect,
  mode = "view",
}: EquipmentCategoriesModalProps) {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewRow, setShowNewRow] = useState(false);
  const [newCategory, setNewCategory] = useState({
    name: "",
    equipment_name: "",
    responsible: "",
    company_id: "",
  });
  const [companies, setCompanies] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
      fetchDropdownData();
    }
  }, [isOpen]);

  const fetchDropdownData = async () => {
    try {
      const [compRes, teamRes] = await Promise.all([
        fetch(`${API_BASE_URL}/companies`),
        fetch(`${API_BASE_URL}/teams`),
      ]);

      if (compRes.ok) {
        const data = await compRes.json();
        setCompanies(Array.isArray(data) ? data : []);
      }
      if (teamRes.ok) {
        const data = await teamRes.json();
        setTeams(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/equipment-categories`);
      if (res.ok) {
        const data = await res.json();
        setCategories(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNew = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/equipment-categories`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCategory.name,
        }),
      });

      if (res.ok) {
        setShowNewRow(false);
        setNewCategory({ name: "" });
        fetchData();
      }
    } catch (error) {
      console.error("Error creating category:", error);
    }
  };

  const handleRowClick = (category: any) => {
    if (mode === "selection" && onSelect) {
      onSelect(category);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-white rounded border-2 border-gray-300 flex items-center gap-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                New
              </button>
              <button className="px-4 py-2 bg-gray-800 text-white rounded">
                Equipment Categories
              </button>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-10 py-2 border-2 border-dashed rounded-lg w-64"
              />
              <svg
                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <svg
                className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6">
          {showNewRow && (
            <div className="mb-4 p-4 border-2 border-dashed rounded-lg bg-gray-50">
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Equipment Category Name
                  </label>
                  <input
                    type="text"
                    value={newCategory.name}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Enter category name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Responsible (Team)
                  </label>
                  <select
                    value={newCategory.responsible}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, responsible: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Team</option>
                    {Array.isArray(teams) &&
                      teams.map((team) => (
                        <option key={team.id} value={team.id}>
                          {team.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Company
                  </label>
                  <select
                    value={newCategory.company_id}
                    onChange={(e) =>
                      setNewCategory({ ...newCategory, company_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Company</option>
                    {Array.isArray(companies) &&
                      companies.map((comp) => (
                        <option key={comp.id} value={comp.id}>
                          {comp.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleSaveNew}
                  className="px-4 py-2 bg-gray-800 text-white rounded"
                >
                  Save
                </button>
                <button
                  onClick={() => {
                    setShowNewRow(false);
                    setNewCategory({ name: "", equipment_name: "", responsible: "", company_id: "" });
                  }}
                  className="px-4 py-2 border rounded"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {!showNewRow && (
            <button
              onClick={() => setShowNewRow(true)}
              className="mb-4 px-4 py-2 bg-gray-800 text-white rounded-lg"
            >
              + Add New Category
            </button>
          )}

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <div className="bg-white rounded-lg overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold">
                      Equipment Name
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Responsible
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Company
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr
                      key={category.id}
                      onClick={() => handleRowClick(category)}
                      className={`border-b border-gray-200 ${
                        onSelect
                          ? "hover:bg-gray-50 cursor-pointer"
                          : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-gray-800">
                        {category.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {category.responsible_teams || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {category.companies || "-"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="p-6 border-t flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-800 text-white rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

