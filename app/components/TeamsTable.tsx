"use client";

import { useState, useEffect } from "react";

const API_BASE_URL = "http://localhost:5500";

export default function TeamsTable() {
  const [teams, setTeams] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [showNewRow, setShowNewRow] = useState(false);
  const [newTeam, setNewTeam] = useState({
    name: "",
    company_id: "",
    member_ids: [] as number[],
  });
  const [companies, setCompanies] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
    fetchCompanies();
    fetchUsers();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE_URL}/teams`);
      if (res.ok) {
        const data = await res.json();
        setTeams(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/companies`);
      if (res.ok) {
        const data = await res.json();
        setCompanies(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching companies:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/users`);
      if (res.ok) {
        const data = await res.json();
        setUsers(Array.isArray(data) ? data : []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSaveNew = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/teams`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTeam.name,
          company_id: newTeam.company_id ? parseInt(newTeam.company_id) : null,
          member_ids: newTeam.member_ids,
        }),
      });

      if (res.ok) {
        setShowNewRow(false);
        setNewTeam({ name: "", company_id: "", member_ids: [] });
        fetchData();
      }
    } catch (error) {
      console.error("Error creating team:", error);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
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
            Teams
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

      {showNewRow && (
        <div className="mb-4 p-4 border-2 border-dashed rounded-lg bg-gray-50">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                Team Name
              </label>
              <input
                type="text"
                value={newTeam.name}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
                placeholder="IT Support Team"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Company
              </label>
              <select
                value={newTeam.company_id}
                onChange={(e) =>
                  setNewTeam({ ...newTeam, company_id: e.target.value })
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
            <div className="col-span-2">
              <label className="block text-sm font-medium mb-1">
                Team Members
              </label>
              <select
                multiple
                value={newTeam.member_ids.map(String)}
                onChange={(e) => {
                  const selectedIds = Array.from(e.target.selectedOptions, option => parseInt(option.value));
                  setNewTeam({ ...newTeam, member_ids: selectedIds });
                }}
                className="w-full px-3 py-2 border rounded min-h-[100px]"
              >
                {Array.isArray(users) &&
                  users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.full_name}
                    </option>
                  ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Hold Ctrl (or Cmd on Mac) to select multiple members
              </p>
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
                setNewTeam({ name: "", company_id: "", member_ids: [] });
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
          + Add New Team
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
                  Team Name
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Team Members
                </th>
                <th className="px-6 py-4 text-left font-semibold">
                  Company
                </th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr
                  key={team.id}
                  className="border-b border-gray-200 hover:bg-gray-50"
                >
                  <td className="px-6 py-4 text-gray-800">{team.name}</td>
                  <td className="px-6 py-4 text-gray-600">
                    {team.team_members || "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {team.company_name || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

