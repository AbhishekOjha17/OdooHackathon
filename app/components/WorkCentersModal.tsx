"use client";

import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5500";

interface WorkCentersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (workCenter: any) => void;
  mode?: "selection" | "view";
}

export default function WorkCentersModal({
  isOpen,
  onClose,
  onSelect,
  mode = "view",
}: WorkCentersModalProps) {
  const [workCenters, setWorkCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewRow, setShowNewRow] = useState(false);
  const [newWorkCenter, setNewWorkCenter] = useState({
    name: "",
    code: "",
    tag: "",
    alternative_workcenter_id: "",
    cost_per_hour: "",
    capacity: "",
    time_efficiency: "",
    oee_target: "",
  });
  const [allWorkCenters, setAllWorkCenters] = useState<any[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/work-centers`);
      if (res.ok) {
        const data = await res.json();
        setWorkCenters(Array.isArray(data) ? data : []);
        setAllWorkCenters(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching work centers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveNew = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/work-centers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newWorkCenter.name,
          code: newWorkCenter.code || null,
          tag: newWorkCenter.tag || null,
          alternative_workcenter_id: newWorkCenter.alternative_workcenter_id ? parseInt(newWorkCenter.alternative_workcenter_id) : null,
          cost_per_hour: newWorkCenter.cost_per_hour ? parseFloat(newWorkCenter.cost_per_hour) : null,
          capacity: newWorkCenter.capacity || null,
          time_efficiency: newWorkCenter.time_efficiency ? parseFloat(newWorkCenter.time_efficiency) : null,
          oee_target: newWorkCenter.oee_target ? parseFloat(newWorkCenter.oee_target) : null,
        }),
      });

      if (res.ok) {
        setShowNewRow(false);
        setNewWorkCenter({
          name: "",
          code: "",
          tag: "",
          alternative_workcenter_id: "",
          cost_per_hour: "",
          capacity: "",
          time_efficiency: "",
          oee_target: "",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error creating work center:", error);
    }
  };

  const handleRowClick = (workCenter: any) => {
    if (mode === "selection" && onSelect) {
      onSelect(workCenter);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
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
                Work Center
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
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Work Center
                  </label>
                  <input
                    type="text"
                    value={newWorkCenter.name}
                    onChange={(e) =>
                      setNewWorkCenter({ ...newWorkCenter, name: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Assembly Line 1"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Code</label>
                  <input
                    type="text"
                    value={newWorkCenter.code}
                    onChange={(e) =>
                      setNewWorkCenter({ ...newWorkCenter, code: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    placeholder="ASB-01"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Tag</label>
                  <input
                    type="text"
                    value={newWorkCenter.tag}
                    onChange={(e) =>
                      setNewWorkCenter({ ...newWorkCenter, tag: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Assembly"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Alternative Workcenters
                  </label>
                  <select
                    value={newWorkCenter.alternative_workcenter_id}
                    onChange={(e) =>
                      setNewWorkCenter({ ...newWorkCenter, alternative_workcenter_id: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Work Center</option>
                    {Array.isArray(allWorkCenters) &&
                      allWorkCenters.map((wc) => (
                        <option key={wc.id} value={wc.id}>
                          {wc.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Cost per Hour
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newWorkCenter.cost_per_hour}
                    onChange={(e) =>
                      setNewWorkCenter({ ...newWorkCenter, cost_per_hour: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    placeholder="25.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Capacity
                  </label>
                  <input
                    type="text"
                    value={newWorkCenter.capacity}
                    onChange={(e) =>
                      setNewWorkCenter({ ...newWorkCenter, capacity: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Printer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Time Efficiency
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newWorkCenter.time_efficiency}
                    onChange={(e) =>
                      setNewWorkCenter({ ...newWorkCenter, time_efficiency: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    placeholder="85.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    OEE Target
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={newWorkCenter.oee_target}
                    onChange={(e) =>
                      setNewWorkCenter({ ...newWorkCenter, oee_target: e.target.value })
                    }
                    className="w-full px-3 py-2 border rounded"
                    placeholder="90.00"
                  />
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
                    setNewWorkCenter({
                      name: "",
                      code: "",
                      tag: "",
                      alternative_workcenter_id: "",
                      cost_per_hour: "",
                      capacity: "",
                      time_efficiency: "",
                      oee_target: "",
                    });
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
              + Add New Work Center
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
                      Work Center
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">Code</th>
                    <th className="px-6 py-4 text-left font-semibold">Tag</th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Alternative Workcenters
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Cost per Hour
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Capacity
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      Time Efficiency
                    </th>
                    <th className="px-6 py-4 text-left font-semibold">
                      OEE Target
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {workCenters.map((wc) => (
                    <tr
                      key={wc.id}
                      onClick={() => handleRowClick(wc)}
                      className={`border-b border-gray-200 ${
                        onSelect ? "hover:bg-gray-50 cursor-pointer" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-gray-800">{wc.name}</td>
                      <td className="px-6 py-4 text-gray-600">{wc.code || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">{wc.tag || "-"}</td>
                      <td className="px-6 py-4 text-gray-600">
                        {wc.alternative_workcenter_name || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {wc.cost_per_hour || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {wc.capacity || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {wc.time_efficiency || "-"}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {wc.oee_target || "-"}
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

