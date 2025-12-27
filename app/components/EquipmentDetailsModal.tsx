"use client";

import { useState, useEffect } from "react";
import EquipmentCategoriesModal from "./EquipmentCategoriesModal";

const API_BASE_URL = "http://localhost:5500";

interface EquipmentDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  equipmentId?: number | null;
  mode?: "create" | "view";
}

export default function EquipmentDetailsModal({
  isOpen,
  onClose,
  equipmentId,
  mode = "view",
}: EquipmentDetailsModalProps) {
  const [equipment, setEquipment] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    company_id: "",
    employee_id: "",
    maintenance_team_id: "",
    assigned_date: "",
    technician_id: "",
    department: "",
    scrap_date: "",
    used_in_location: "",
    work_center_id: "",
    description: "",
  });
  const [categories, setCategories] = useState<any[]>([]);
  const [companies, setCompanies] = useState<any[]>([]);
  const [employees, setEmployees] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [workCenters, setWorkCenters] = useState<any[]>([]);
  const [showCategoriesModal, setShowCategoriesModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      if (mode === "view" && equipmentId) {
        fetchEquipmentDetails();
      } else if (mode === "create") {
        resetForm();
      }
      fetchDropdownData();
    }
  }, [isOpen, equipmentId, mode]);

  const fetchEquipmentDetails = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/equipment/${equipmentId}`);
      if (res.ok) {
        const data = await res.json();
        setEquipment(data);
        setFormData({
          name: data.name || "",
          category_id: data.category_id || "",
          company_id: data.company_id || "",
          employee_id: data.employee_id || "",
          maintenance_team_id: data.maintenance_team_id || "",
          assigned_date: data.assigned_date || "",
          technician_id: data.technician_id || "",
          department: data.department || "",
          scrap_date: data.scrap_date || "",
          used_in_location: data.used_in_location || "",
          work_center_id: data.work_center_id || "",
          description: data.description || "",
        });
      }
    } catch (error) {
      console.error("Error fetching equipment details:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDropdownData = async () => {
    try {
      const [catRes, compRes, empRes, teamRes, techRes, wcRes] =
        await Promise.all([
          fetch(`${API_BASE_URL}/equipment-categories`),
          fetch(`${API_BASE_URL}/teams`)
            .then((r) => (r.ok ? r.json() : []))
            .catch(() => []),
          fetch(`${API_BASE_URL}/users?role=employee`),
          fetch(`${API_BASE_URL}/teams`),
          fetch(`${API_BASE_URL}/users?role=technician`),
          fetch(`${API_BASE_URL}/work-centers`),
        ]);

      if (catRes.ok) {
        const data = await catRes.json();
        setCategories(Array.isArray(data) ? data : []);
      }
      if (compRes.ok) {
        const data = await compRes.json();
        setCompanies(Array.isArray(data) ? data : []);
      }
      if (empRes.ok) {
        const data = await empRes.json();
        setEmployees(Array.isArray(data) ? data : []);
      }
      if (teamRes.ok) {
        const data = await teamRes.json();
        setTeams(Array.isArray(data) ? data : []);
      }
      if (techRes.ok) {
        const data = await techRes.json();
        setTechnicians(Array.isArray(data) ? data : []);
      }
      if (wcRes.ok) {
        const data = await wcRes.json();
        setWorkCenters(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category_id: "",
      company_id: "",
      employee_id: "",
      maintenance_team_id: "",
      assigned_date: "",
      technician_id: "",
      department: "",
      scrap_date: "",
      used_in_location: "",
      work_center_id: "",
      description: "",
    });
    setSelectedCategory(null);
  };

  const handleCategorySelect = (category: any) => {
    setSelectedCategory(category);
    setFormData({ ...formData, category_id: category.id.toString() });
    setShowCategoriesModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_BASE_URL}/equipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name || equipment?.name,
          category_id: formData.category_id
            ? parseInt(formData.category_id)
            : null,
          company_id: formData.company_id
            ? parseInt(formData.company_id)
            : null,
          employee_id: formData.employee_id
            ? parseInt(formData.employee_id)
            : null,
          maintenance_team_id: formData.maintenance_team_id
            ? parseInt(formData.maintenance_team_id)
            : null,
          assigned_date: formData.assigned_date || null,
          technician_id: formData.technician_id
            ? parseInt(formData.technician_id)
            : null,
          department: formData.department || null,
          scrap_date: formData.scrap_date || null,
          used_in_location: formData.used_in_location || null,
          work_center_id: formData.work_center_id
            ? parseInt(formData.work_center_id)
            : null,
          description: formData.description || null,
        }),
      });

      if (res.ok) {
        onClose();
        resetForm();
      }
    } catch (error) {
      console.error("Error creating equipment:", error);
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
                Equipments Name
              </button>
              {mode === "create" && (
                <button
                  onClick={() => {
                    resetForm();
                    fetchDropdownData();
                  }}
                  className="px-4 py-2 bg-white rounded border-2 border-gray-300 flex items-center gap-2"
                >
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
              )}
              {mode === "view" && (
                <button className="px-4 py-2 bg-gray-800 text-white rounded flex items-center gap-2">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  Maintenance
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="p-6">
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : (
            <form onSubmit={handleSubmit}>
              <h2 className="text-2xl font-bold mb-6">
                {mode === "view" && equipment
                  ? equipment.name
                  : "New Equipment"}
              </h2>

              <div className="grid grid-cols-2 gap-4 mb-4">
                {mode === "create" && (
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Equipment Name -
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border rounded"
                      placeholder="Epson Printer"
                      required
                    />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Equipment Category -
                  </label>
                  {mode === "view" ? (
                    <input
                      type="text"
                      value={equipment?.category_name || ""}
                      disabled
                      className="w-full px-3 py-2 border rounded bg-gray-100"
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowCategoriesModal(true)}
                      className="w-full px-3 py-2 border rounded text-left bg-white hover:bg-gray-50"
                    >
                      {selectedCategory
                        ? selectedCategory.name
                        : formData.category_id && Array.isArray(categories)
                        ? categories.find(
                            (cat) => cat.id.toString() === formData.category_id
                          )?.name || "Click to select category"
                        : "Click to select category"}
                    </button>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Company -
                  </label>
                  {mode === "view" ? (
                    <input
                      type="text"
                      value={equipment?.company_name || ""}
                      disabled
                      className="w-full px-3 py-2 border rounded bg-gray-100"
                    />
                  ) : (
                    <select
                      value={formData.company_id}
                      onChange={(e) =>
                        setFormData({ ...formData, company_id: e.target.value })
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
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Used by -
                  </label>
                  <select
                    value={formData.employee_id}
                    onChange={(e) =>
                      setFormData({ ...formData, employee_id: e.target.value })
                    }
                    disabled={mode === "view"}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">
                      {equipment?.employee_name || "Select Employee"}
                    </option>
                    {Array.isArray(employees) &&
                      employees.map((emp) => (
                        <option key={emp.id} value={emp.id}>
                          {emp.full_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Maintenance Team -
                  </label>
                  <select
                    value={formData.maintenance_team_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        maintenance_team_id: e.target.value,
                      })
                    }
                    disabled={mode === "view"}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">
                      {equipment?.maintenance_team_name || "Select Team"}
                    </option>
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
                    Assigned Date -
                  </label>
                  <input
                    type="date"
                    value={formData.assigned_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        assigned_date: e.target.value,
                      })
                    }
                    disabled={mode === "view"}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Technician -
                  </label>
                  <select
                    value={formData.technician_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        technician_id: e.target.value,
                      })
                    }
                    disabled={mode === "view"}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">
                      {equipment?.technician_name || "Select Technician"}
                    </option>
                    {Array.isArray(technicians) &&
                      technicians.map((tech) => (
                        <option key={tech.id} value={tech.id}>
                          {tech.full_name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Employee -
                  </label>
                  <input
                    type="text"
                    value={formData.department || equipment?.department || ""}
                    onChange={(e) =>
                      setFormData({ ...formData, department: e.target.value })
                    }
                    disabled={mode === "view"}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="HR Department"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Scrap Date -
                  </label>
                  <input
                    type="date"
                    value={formData.scrap_date}
                    onChange={(e) =>
                      setFormData({ ...formData, scrap_date: e.target.value })
                    }
                    disabled={mode === "view"}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Used In Location -
                  </label>
                  <input
                    type="text"
                    value={
                      formData.used_in_location ||
                      equipment?.used_in_location ||
                      ""
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        used_in_location: e.target.value,
                      })
                    }
                    disabled={mode === "view"}
                    className="w-full px-3 py-2 border rounded"
                    placeholder="HR Office - 2nd Floor"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Work Center -
                  </label>
                  <select
                    value={formData.work_center_id}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        work_center_id: e.target.value,
                      })
                    }
                    disabled={mode === "view"}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">
                      {equipment?.work_center_name || "Select Work Center"}
                    </option>
                    {Array.isArray(workCenters) &&
                      workCenters.map((wc) => (
                        <option key={wc.id} value={wc.id}>
                          {wc.name}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Description -
                </label>
                <textarea
                  value={formData.description || equipment?.description || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  disabled={mode === "view"}
                  className="w-full px-3 py-2 border rounded h-24"
                  placeholder="Office printer used for daily document printing..."
                />
              </div>

              {mode === "create" && (
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 border rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-gray-800 text-white rounded"
                  >
                    Save
                  </button>
                </div>
              )}
            </form>
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

      <EquipmentCategoriesModal
        isOpen={showCategoriesModal}
        onClose={() => setShowCategoriesModal(false)}
        onSelect={handleCategorySelect}
        mode="selection"
      />
    </div>
  );
}
