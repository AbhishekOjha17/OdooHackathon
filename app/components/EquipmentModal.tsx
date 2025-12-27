"use client";

import { useState, useEffect } from "react";
import EquipmentTable from "./EquipmentTable";
import EquipmentCategoriesModal from "./EquipmentCategoriesModal";
import EquipmentDetailsModal from "./EquipmentDetailsModal";

const API_BASE_URL = "http://localhost:5500";

interface EquipmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect?: (equipment: any) => void;
  mode?: "selection" | "view";
}

export default function EquipmentModal({ isOpen, onClose, onSelect, mode = "view" }: EquipmentModalProps) {
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewRow, setShowNewRow] = useState(false);
  const [newEquipment, setNewEquipment] = useState({
    name: "",
    serial_number: "",
    category_id: "",
    employee_id: "",
    department: "",
    technician_id: "",
    company_id: "",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [showEquipmentDetailsModal, setShowEquipmentDetailsModal] = useState(false);
  const [selectedEquipmentId, setSelectedEquipmentId] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [equipmentDetailsMode, setEquipmentDetailsMode] = useState<"create" | "view">("view");

  useEffect(() => {
    if (isOpen) {
      fetchData();
      fetchDropdownData();
    }
  }, [isOpen]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/equipment`);
      if (res.ok) {
        const data = await res.json();
        setEquipment(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching equipment:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [catRes, empRes, techRes] = await Promise.all([
        fetch(`${API_BASE_URL}/equipment-categories`),
        fetch(`${API_BASE_URL}/users?role=employee`),
        fetch(`${API_BASE_URL}/users?role=technician`),
      ]);

      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(Array.isArray(data) ? data : []);
      }
      if (empRes.ok) {
        const data = await empRes.json();
        setEmployees(Array.isArray(data) ? data : []);
      }
      if (techRes.ok) {
        const data = await techRes.json();
        setTechnicians(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const handleSaveNew = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/equipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newEquipment.name,
          serial_number: newEquipment.serial_number || null,
          category_id: newEquipment.category_id ? parseInt(newEquipment.category_id) : null,
          employee_id: newEquipment.employee_id ? parseInt(newEquipment.employee_id) : null,
          department: newEquipment.department || null,
          technician_id: newEquipment.technician_id ? parseInt(newEquipment.technician_id) : null,
          company_id: newEquipment.company_id ? parseInt(newEquipment.company_id) : null,
        }),
      });

      if (res.ok) {
        setShowNewRow(false);
        setNewEquipment({
          name: "",
          serial_number: "",
          category_id: "",
          employee_id: "",
          department: "",
          technician_id: "",
          company_id: "",
        });
        fetchData();
      }
    } catch (error) {
      console.error("Error creating equipment:", error);
    }
  };

  const handleRowClick = (equipment: any) => {
    if (mode === "selection" && onSelect) {
      onSelect(equipment);
      onClose();
    } else {
      // View mode - open equipment details
      setEquipmentDetailsMode("view");
      setSelectedEquipmentId(equipment.id);
      setShowEquipmentDetailsModal(true);
    }
  };

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    setNewEquipment({ ...newEquipment, category_id: category.id.toString() });
    setShowCategoriesModal(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button className="px-4 py-2 bg-gray-100 rounded">New</button>
              <span className="text-gray-600">Equipments</span>
            </div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-10 py-2 border-2 border-dashed rounded-lg w-64"
              />
              <svg className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <svg className="w-4 h-4 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        <div className="p-6">
          {showNewRow && (
            <div className="mb-4 p-4 border-2 border-dashed rounded-lg bg-gray-50">
              <div className="grid grid-cols-4 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Equipment Name</label>
                  <input
                    type="text"
                    value={newEquipment.name}
                    onChange={(e) => setNewEquipment({ ...newEquipment, name: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="Epson Printer"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={newEquipment.serial_number}
                    onChange={(e) => setNewEquipment({ ...newEquipment, serial_number: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="MT/122/11112222"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <button
                    type="button"
                    onClick={() => setShowCategoriesModal(true)}
                    className="w-full px-3 py-2 border rounded text-left bg-white hover:bg-gray-50"
                  >
                    {selectedCategory
                      ? selectedCategory.name
                      : newEquipment.category_id && Array.isArray(categories)
                      ? categories.find((cat) => cat.id.toString() === newEquipment.category_id)?.name || "Click to select category"
                      : "Click to select category"}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Employee</label>
                  <select
                    value={newEquipment.employee_id}
                    onChange={(e) => setNewEquipment({ ...newEquipment, employee_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Employee</option>
                    {Array.isArray(employees) && employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>{emp.full_name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Department</label>
                  <input
                    type="text"
                    value={newEquipment.department}
                    onChange={(e) => setNewEquipment({ ...newEquipment, department: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="HR"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Technician</label>
                  <select
                    value={newEquipment.technician_id}
                    onChange={(e) => setNewEquipment({ ...newEquipment, technician_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Technician</option>
                    {Array.isArray(technicians) && technicians.map((tech) => (
                      <option key={tech.id} value={tech.id}>{tech.full_name}</option>
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
                    setSelectedCategory(null);
                    setNewEquipment({
                      name: "",
                      serial_number: "",
                      category_id: "",
                      employee_id: "",
                      department: "",
                      technician_id: "",
                      company_id: "",
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
              + Add New Equipment
            </button>
          )}

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <EquipmentTable
              data={equipment}
              onRowClick={handleRowClick}
              isSelectionMode={mode === "selection"}
            />
          )}
        </div>

        <div className="p-6 border-t flex justify-end">
          <button onClick={onClose} className="px-4 py-2 bg-gray-800 text-white rounded">
            Close
          </button>
        </div>
      </div>

      <EquipmentCategoriesModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
        onSelect={handleCategorySelect}
        mode="selection"
      />

      <EquipmentDetailsModal
        isOpen={showEquipmentDetailsModal}
        onClose={() => {
          setShowEquipmentDetailsModal(false);
          setSelectedEquipmentId(null);
          setEquipmentDetailsMode("view");
          fetchData();
        }}
        equipmentId={selectedEquipmentId}
        mode={equipmentDetailsMode}
      />
    </div>
  );
}

