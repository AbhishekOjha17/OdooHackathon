"use client";

interface DashboardCardsProps {
  criticalEquipment: number;
  technicalLoad: number;
  openRequests: number;
  overdueRequests: number;
}

export default function DashboardCards({
  criticalEquipment,
  technicalLoad,
  openRequests,
  overdueRequests,
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-3 gap-6 mb-8">
      <div className="bg-pink-50 rounded-xl p-6">
        <div className="text-gray-800 font-bold text-xl mb-2">Critical Equipment</div>
        <div className="text-gray-600 text-sm">{criticalEquipment} Units</div>
      </div>
      <div className="bg-blue-50 rounded-xl p-6">
        <div className="text-gray-800 font-bold text-xl mb-2">Technical Load</div>
        <div className="text-gray-600 text-sm">{technicalLoad}% Utilised</div>
      </div>
      <div className="bg-green-50 rounded-xl p-6">
        <div className="text-gray-800 font-bold text-xl mb-2">Open Requests</div>
        <div className="text-gray-600 text-sm">{openRequests} Pending</div>
        <div className="text-gray-600 text-sm">{overdueRequests} Overdue</div>
      </div>
    </div>
  );
}

