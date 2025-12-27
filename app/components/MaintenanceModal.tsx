"use client";

import { useState, useEffect } from "react";
import EquipmentModal from "./EquipmentModal";
import TeamsModal from "./TeamsModal";
import WorkCentersModal from "./WorkCentersModal";

const API_BASE_URL = "http://localhost:5500";

interface MaintenanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "view";
  requestId?: number;
  onSuccess: () => void;
  userId?: number | null;
}

interface FormData {
  subject: string;
  created_by: number | null;
  equipment_id: number | null;
  category_id: number | null;
  request_date: string;
  maintenance_type: "Corrective" | "Preventive";
  team_id: number | null;
  technician_id: number | null;
  scheduled_date: string;
  duration: string;
  priority: "Low" | "Medium" | "High";
  status_id: number;
  company_id: number | null;
  notes: string;
  instructions: string;
}

export default function MaintenanceModal({
  isOpen,
  onClose,
  mode,
  requestId,
  onSuccess,
  userId,
}: MaintenanceModalProps) {
  const [formData, setFormData] = useState<FormData>({
    subject: "",
    created_by: null,
    equipment_id: null,
    category_id: null,
    request_date: "",
    maintenance_type: "Corrective",
    team_id: null,
    technician_id: null,
    scheduled_date: "",
    duration: "",
    priority: "Low",
    status_id: 1,
    company_id: null,
    notes: "",
    instructions: "",
  });

  const [equipment, setEquipment] = useState<any[]>([]);
  const [teams, setTeams] = useState<any[]>([]);
  const [technicians, setTechnicians] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [statuses, setStatuses] = useState<any[]>([]);
  const [workCenters, setWorkCenters] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "details" | "notes" | "instructions"
  >("details");
  const [maintenanceForType, setMaintenanceForType] = useState<
    "Equipment" | "Workcentre" | ""
  >("");
  const [showEquipmentModal, setShowEquipmentModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<any>(null);
  const [showTeamsModal, setShowTeamsModal] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [showWorkCentersModal, setShowWorkCentersModal] = useState(false);
  const [selectedWorkCenter, setSelectedWorkCenter] = useState<any>(null);

  useEffect(() => {
    if (isOpen) {
      fetchDropdownData();
      if (mode === "view" && requestId) {
        fetchRequestData();
      } else {
        resetForm();
      }
    }
  }, [isOpen, mode, requestId]);

  const fetchDropdownData = async () => {
    try {
      const [equipRes, teamsRes, techRes, catRes, wcRes] = await Promise.all([
        fetch(`${API_BASE_URL}/equipment`),
        fetch(`${API_BASE_URL}/teams`),
        fetch(`${API_BASE_URL}/users?role=technician`),
        fetch(`${API_BASE_URL}/equipment-categories`),
        fetch(`${API_BASE_URL}/work-centers`),
      ]);

      let equipmentData = [];
      let teamsData = [];
      let techniciansData = [];
      let categoriesData = [];
      let workCentersData = [];

      if (equipRes.ok) {
        const data = await equipRes.json();
        equipmentData = Array.isArray(data) ? data : [];
      }

      if (teamsRes.ok) {
        const data = await teamsRes.json();
        teamsData = Array.isArray(data) ? data : [];
      }

      if (techRes.ok) {
        const data = await techRes.json();
        techniciansData = Array.isArray(data) ? data : [];
      }

      if (catRes.ok) {
        const data = await catRes.json();
        categoriesData = Array.isArray(data) ? data : [];
      }

      if (wcRes.ok) {
        const data = await wcRes.json();
        workCentersData = Array.isArray(data) ? data : [];
      }

      setEquipment(equipmentData);
      setTeams(teamsData);
      setTechnicians(techniciansData);
      setCategories(categoriesData);
      setWorkCenters(workCentersData);
      setStatuses([
        { id: 1, name: "New" },
        { id: 2, name: "In Progress" },
        { id: 3, name: "Repaired" },
        { id: 4, name: "Scrap" },
      ]);
    } catch (error) {
      console.error("Error fetching dropdown data:", error);
      setEquipment([]);
      setTeams([]);
      setTechnicians([]);
      setCategories([]);
      setWorkCenters([]);
    }
  };

  const handleEquipmentSelect = (equipment: any) => {
    setSelectedEquipment(equipment);
    setMaintenanceForType("Equipment");
    setFormData({
      ...formData,
      equipment_id: equipment.id,
      category_id: equipment.category_id || formData.category_id,
      technician_id: equipment.technician_id || formData.technician_id,
      company_id: equipment.company_id || formData.company_id,
    });
    setShowEquipmentModal(false);
  };

  const fetchRequestData = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/maintenance/${requestId}`);
      const data = await res.json();
      setFormData({
        subject: data.subject || "",
        created_by: data.created_by || null,
        equipment_id: data.equipment_id || null,
        category_id: data.category_id || null,
        request_date: data.request_date || "",
        maintenance_type: data.maintenance_type || "Corrective",
        team_id: data.team_id || null,
        technician_id: data.technician_id || null,
        scheduled_date: data.scheduled_date || "",
        duration: data.duration?.toString() || "",
        priority: data.priority || "Low",
        status_id: data.status_id || 1,
        company_id: data.company_id || null,
        notes: data.notes || "",
        instructions: data.instructions || "",
      });
      if (data.equipment_id) {
        setMaintenanceForType("Equipment");
        const selectedEq = Array.isArray(equipment)
          ? equipment.find((eq) => eq.id === data.equipment_id)
          : null;
        if (selectedEq) {
          setSelectedEquipment(selectedEq);
        } else {
          try {
            const equipRes = await fetch(
              `${API_BASE_URL}/equipment/${data.equipment_id}`
            );
            if (equipRes.ok) {
              const equipData = await equipRes.json();
              setSelectedEquipment(equipData);
            }
          } catch (err) {
            console.error("Error fetching equipment details:", err);
          }
        }
      }
    } catch (error) {
      console.error("Error fetching request data:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      subject: "",
      created_by: userId || null,
      equipment_id: null,
      category_id: null,
      request_date: "",
      maintenance_type: "Corrective",
      team_id: null,
      technician_id: null,
      scheduled_date: "",
      duration: "",
      priority: "Low",
      status_id: 1,
      company_id: null,
      notes: "",
      instructions: "",
    });
    setMaintenanceForType("");
    setSelectedEquipment(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        duration: formData.duration ? parseInt(formData.duration) : null,
        request_date: formData.request_date || null,
        scheduled_date: formData.scheduled_date || null,
      };

      const res = await fetch(`${API_BASE_URL}/maintenance`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        onSuccess();
        onClose();
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const currentStatus = statuses.find((s) => s.id === formData.status_id);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <div className="flex items-center gap-4 mb-4">
            <button className="px-4 py-2 bg-gray-100 rounded border-2 border-dashed">
              New
            </button>
            <span className="text-gray-600">Maintenance Requests</span>
            <button className="px-4 py-2 border-2 border-dashed rounded">
              Worksheet
            </button>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <span>New Requests</span>
            <span>&gt;</span>
            <span
              className={
                formData.status_id === 2
                  ? "border-2 border-dashed px-2 py-1 rounded relative"
                  : ""
              }
            >
              In Progress
              {formData.status_id === 2 && (
                <span className="absolute -top-1 -right-1 w-2 h-2 bg-pink-500 rounded-full"></span>
              )}
            </span>
            <span>&gt;</span>
            <span>Repaired</span>
            <span>&gt;</span>
            <span>Scrap</span>
          </div>
          <h2 className="text-2xl font-bold mt-4">
            {formData.subject || "New Maintenance Request"}
          </h2>
        </div>

        <div className="p-6">
          <div className="flex gap-2 mb-6 border-b">
            <button
              onClick={() => setActiveTab("details")}
              className={`px-4 py-2 ${
                activeTab === "details" ? "border-b-2 border-gray-800" : ""
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab("notes")}
              className={`px-4 py-2 border-2 border-dashed rounded ${
                activeTab === "notes" ? "border-gray-800" : ""
              }`}
            >
              Notes
            </button>
            <button
              onClick={() => setActiveTab("instructions")}
              className={`px-4 py-2 border-2 border-dashed rounded ${
                activeTab === "instructions" ? "border-gray-800" : ""
              }`}
            >
              Instructions
            </button>
          </div>

          {activeTab === "details" && (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">
                  Subject
                </label>
                <input
                  type="text"
                  value={formData.subject}
                  onChange={(e) =>
                    setFormData({ ...formData, subject: e.target.value })
                  }
                  disabled={mode === "view"}
                  className="w-full px-3 py-2 border rounded"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Created By -
                  </label>
                  <input
                    type="text"
                    value={
                      formData.created_by && Array.isArray(technicians)
                        ? technicians.find((t) => t.id === formData.created_by)
                            ?.full_name || ""
                        : ""
                    }
                    disabled
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Maintenance For -
                  </label>
                  <select
                    value={maintenanceForType}
                    onChange={(e) => {
                      const value = e.target.value as
                        | "Equipment"
                        | "Workcentre"
                        | "";
                      setMaintenanceForType(value);
                      if (value === "Equipment") {
                        // Equipment will be selected via the Equipment button field
                        setShowWorkCentersModal(false);
                      } else if (value === "Workcentre") {
                        setFormData({ ...formData, equipment_id: null });
                        setSelectedEquipment(null);
                        setShowWorkCentersModal(true);
                      } else {
                        setFormData({ ...formData, equipment_id: null });
                        setSelectedEquipment(null);
                        setShowWorkCentersModal(false);
                      }
                    }}
                    disabled={mode === "view"}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Type</option>
                    <option value="Equipment">Equipment</option>
                    <option value="Workcentre">Workcentre</option>
                  </select>
                  {maintenanceForType === "Workcentre" &&
                    selectedWorkCenter && (
                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-sm text-gray-600">
                          {selectedWorkCenter.name}
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowWorkCentersModal(true)}
                          className="text-sm text-blue-600 hover:underline"
                          disabled={mode === "view"}
                        >
                          Change
                        </button>
                      </div>
                    )}
                  {maintenanceForType === "Workcentre" &&
                    !selectedWorkCenter && (
                      <button
                        type="button"
                        onClick={() => setShowWorkCentersModal(true)}
                        disabled={mode === "view"}
                        className={`w-full px-3 py-2 border rounded text-left mt-2 ${
                          mode === "view"
                            ? "bg-gray-100 text-gray-500"
                            : "bg-white hover:bg-gray-50 cursor-pointer"
                        }`}
                      >
                        Click to select work center
                      </button>
                    )}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Equipment -
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setMaintenanceForType("Equipment");
                      setShowEquipmentModal(true);
                    }}
                    disabled={mode === "view"}
                    className={`w-full px-3 py-2 border rounded text-left ${
                      mode === "view"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-white hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    {selectedEquipment
                      ? selectedEquipment.name
                      : formData.equipment_id && Array.isArray(equipment)
                      ? equipment.find((e) => e.id === formData.equipment_id)
                          ?.name || ""
                      : "Click to select equipment"}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Category -
                  </label>
                  <select
                    value={formData.category_id || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category_id: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    disabled={mode === "view"}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Category</option>
                    {Array.isArray(categories) &&
                      categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Request Date -
                  </label>
                  <input
                    type="date"
                    value={formData.request_date}
                    onChange={(e) =>
                      setFormData({ ...formData, request_date: e.target.value })
                    }
                    disabled={mode === "view"}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Maintenance Type -
                  </label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="maintenance_type"
                        value="Corrective"
                        checked={formData.maintenance_type === "Corrective"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maintenance_type: e.target.value as
                              | "Corrective"
                              | "Preventive",
                          })
                        }
                        disabled={mode === "view"}
                        className="mr-2"
                      />
                      Corrective
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="maintenance_type"
                        value="Preventive"
                        checked={formData.maintenance_type === "Preventive"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            maintenance_type: e.target.value as
                              | "Corrective"
                              | "Preventive",
                          })
                        }
                        disabled={mode === "view"}
                        className="mr-2"
                      />
                      Preventive
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Team-
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowTeamsModal(true)}
                    disabled={mode === "view"}
                    className={`w-full px-3 py-2 border rounded text-left ${
                      mode === "view"
                        ? "bg-gray-100 text-gray-500"
                        : "bg-white hover:bg-gray-50 cursor-pointer"
                    }`}
                  >
                    {selectedTeam
                      ? selectedTeam.name
                      : formData.team_id && Array.isArray(teams)
                      ? teams.find((t) => t.id === formData.team_id)?.name ||
                        "Click to select team"
                      : "Click to select team"}
                  </button>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Technician -
                  </label>
                  <select
                    value={formData.technician_id || ""}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        technician_id: e.target.value
                          ? parseInt(e.target.value)
                          : null,
                      })
                    }
                    disabled={mode === "view"}
                    className="w-full px-3 py-2 border rounded"
                  >
                    <option value="">Select Technician</option>
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
                    Scheduled Date -
                  </label>
                  <input
                    type="date"
                    value={formData.scheduled_date}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        scheduled_date: e.target.value,
                      })
                    }
                    disabled={mode === "view"}
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Duration -
                  </label>
                  <input
                    type="text"
                    value={formData.duration}
                    onChange={(e) =>
                      setFormData({ ...formData, duration: e.target.value })
                    }
                    disabled={mode === "view"}
                    placeholder="2 Hours"
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Priority -
                  </label>
                  <div className="flex gap-4 mt-2">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="Low"
                        checked={formData.priority === "Low"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priority: e.target.value as
                              | "Low"
                              | "Medium"
                              | "High",
                          })
                        }
                        disabled={mode === "view"}
                        className="mr-2"
                      />
                      Low
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="Medium"
                        checked={formData.priority === "Medium"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priority: e.target.value as
                              | "Medium"
                              | "Low"
                              | "High",
                          })
                        }
                        disabled={mode === "view"}
                        className="mr-2"
                      />
                      Medium
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="priority"
                        value="High"
                        checked={formData.priority === "High"}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            priority: e.target.value as
                              | "High"
                              | "Low"
                              | "Medium",
                          })
                        }
                        disabled={mode === "view"}
                        className="mr-2"
                      />
                      High
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">
                    Company -
                  </label>
                  <input
                    type="text"
                    value={formData.company_id ? "My Company" : ""}
                    disabled
                    className="w-full px-3 py-2 border rounded"
                  />
                </div>
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
                    disabled={loading}
                    className="px-4 py-2 bg-gray-800 text-white rounded"
                  >
                    {loading ? "Creating..." : "Create"}
                  </button>
                </div>
              )}
            </form>
          )}

          {activeTab === "notes" && (
            <div>
              <textarea
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                disabled={mode === "view"}
                className="w-full h-64 px-3 py-2 border rounded"
                placeholder="Add notes..."
              />
            </div>
          )}

          {activeTab === "instructions" && (
            <div>
              <textarea
                value={formData.instructions}
                onChange={(e) =>
                  setFormData({ ...formData, instructions: e.target.value })
                }
                disabled={mode === "view"}
                className="w-full h-64 px-3 py-2 border rounded"
                placeholder="Add instructions..."
              />
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

      <EquipmentModal
        isOpen={showEquipmentModal}
        onClose={() => setShowEquipmentModal(false)}
        onSelect={handleEquipmentSelect}
        mode="selection"
      />

      <TeamsModal
        isOpen={showTeamsModal}
        onClose={() => setShowTeamsModal(false)}
        onSelect={(team) => {
          setSelectedTeam(team);
          setFormData({ ...formData, team_id: team.id });
          setShowTeamsModal(false);
        }}
        mode="selection"
      />

      <WorkCentersModal
        isOpen={showWorkCentersModal}
        onClose={() => setShowWorkCentersModal(false)}
        onSelect={(workCenter) => {
          setSelectedWorkCenter(workCenter);
          setFormData({ ...formData, equipment_id: workCenter.id }); // Using equipment_id field for work center ID
          setShowWorkCentersModal(false);
        }}
        mode="selection"
      />
    </div>
  );
}
