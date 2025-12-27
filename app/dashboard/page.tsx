"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Sidebar from "../components/Sidebar";
import DashboardCards from "../components/DashboardCards";
import ActivityTable from "../components/ActivityTable";
import MaintenanceModal from "../components/MaintenanceModal";

const API_BASE_URL = "http://localhost:5500";

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [user, setUser] = useState<any>(null);
  const [maintenanceRequests, setMaintenanceRequests] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"create" | "view">("create");
  const [selectedRequestId, setSelectedRequestId] = useState<
    number | undefined
  >();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchData();
  }, []);

  useEffect(() => {
    const openModal = searchParams.get("openModal");
    const requestId = searchParams.get("requestId");
    if (openModal === "true") {
      if (requestId) {
        setModalMode("view");
        setSelectedRequestId(parseInt(requestId));
      } else {
        setModalMode("create");
        setSelectedRequestId(undefined);
      }
      setModalOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [maintenanceRes, equipmentRes] = await Promise.all([
        fetch(`${API_BASE_URL}/maintenance`),
        fetch(`${API_BASE_URL}/equipment`),
      ]);

      let maintenanceData = [];
      let equipmentData = [];

      if (maintenanceRes.ok) {
        const data = await maintenanceRes.json();
        maintenanceData = Array.isArray(data) ? data : [];
      } else {
        console.error("Maintenance API error:", maintenanceRes.status);
      }

      if (equipmentRes.ok) {
        const data = await equipmentRes.json();
        equipmentData = Array.isArray(data) ? data : [];
      } else {
        console.error("Equipment API error:", equipmentRes.status);
      }

      setMaintenanceRequests(maintenanceData);
      setEquipment(equipmentData);
    } catch (error) {
      console.error("Error fetching data:", error);
      setMaintenanceRequests([]);
      setEquipment([]);
    } finally {
      setLoading(false);
    }
  };

  const handleNewClick = () => {
    router.push("/maintenance?openModal=true");
  };

  const handleRowClick = (id: number) => {
    router.push(`/maintenance?openModal=true&requestId=${id}`);
  };

  const handleModalSuccess = () => {
    fetchData();
    router.push("/dashboard");
  };

  const handleModalClose = () => {
    setModalOpen(false);
    router.push("/dashboard");
  };

  const criticalEquipment = Array.isArray(equipment) ? equipment.length : 0;
  const technicalLoad =
    Array.isArray(maintenanceRequests) && maintenanceRequests.length > 0
      ? Math.round(
          (maintenanceRequests.filter((r) => r.status_name === "In Progress")
            .length /
            maintenanceRequests.length) *
            100
        )
      : 0;
  const openRequests = Array.isArray(maintenanceRequests)
    ? maintenanceRequests.filter(
        (r) => r.status_name !== "Repaired" && r.status_name !== "Scrap"
      ).length
    : 0;
  const overdueRequests = 0;

  if (loading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar activeRoute="/dashboard" />
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
          <div className="flex items-center gap-4">
            <button
              onClick={handleNewClick}
              className="px-4 py-2 bg-gray-800 text-white rounded-lg flex items-center gap-2"
            >
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
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              New
            </button>
            <div className="relative">
              <input
                type="text"
                placeholder="Search here..."
                className="pl-10 pr-10 py-2 border rounded-lg w-64"
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

        <div className="flex-1 overflow-y-auto p-8">
          <DashboardCards
            criticalEquipment={criticalEquipment}
            technicalLoad={technicalLoad}
            openRequests={openRequests}
            overdueRequests={overdueRequests}
          />
          <ActivityTable
            data={maintenanceRequests}
            onRowClick={handleRowClick}
          />
        </div>
      </div>

      <MaintenanceModal
        isOpen={modalOpen}
        onClose={handleModalClose}
        mode={modalMode}
        requestId={selectedRequestId}
        onSuccess={handleModalSuccess}
        userId={user?.id || null}
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen">
          <Sidebar activeRoute="/dashboard" />
          <div className="flex-1 flex items-center justify-center">
            <div>Loading...</div>
          </div>
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
