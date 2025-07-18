import React, { useState, useEffect } from "react";
import styles from "./BlacklistManagement.module.scss";
import GlassCard from "../../components/GlassCard/GlassCard";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import useAuth from "../../hooks/useAuth";
import SearchIcon from "@mui/icons-material/Search";

const BlacklistManagement = ({
  allBlacklistEntries,
  setAllBlacklistEntries,
  currentSubsidiary,
  allEmployees,
}) => {
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterReason, setFilterReason] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [isRevokeModalOpen, setIsRevokeModalOpen] = useState(false);
  const [isAddBlacklistModalOpen, setIsAddBlacklistModalOpen] = useState(false);
  const [newBlacklistEntry, setNewBlacklistEntry] = useState({
    employeeId: "",
    reason: "",
    date: new Date().toISOString().split("T")[0],
    subsidiary: currentSubsidiary,
    status: "Active",
  });

  const { userRole } = useAuth();

  useEffect(() => {
    let currentFiltered =
      userRole === "super_admin"
        ? allBlacklistEntries
        : allBlacklistEntries.filter(
            (entry) => entry.subsidiary.toLowerCase() === currentSubsidiary
          );

    if (searchTerm) {
      currentFiltered = currentFiltered.filter(
        (entry) =>
          entry.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
          entry.reason.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterReason !== "All") {
      currentFiltered = currentFiltered.filter(
        (entry) => entry.reason === filterReason
      );
    }

    if (filterStatus !== "All") {
      currentFiltered = currentFiltered.filter(
        (entry) => entry.status === filterStatus
      );
    }

    setFilteredEntries(currentFiltered);
  }, [
    allBlacklistEntries,
    searchTerm,
    filterReason,
    filterStatus,
    currentSubsidiary,
    userRole,
  ]);

  useEffect(() => {
    setNewBlacklistEntry((prev) => ({
      ...prev,
      subsidiary: currentSubsidiary,
    }));
  }, [currentSubsidiary]);

  const handleRevokeClick = (entryId) => {
    const entryToRevoke = allBlacklistEntries.find(
      (entry) => entry.id === entryId
    );
    setSelectedEntry(entryToRevoke);
    setIsRevokeModalOpen(true);
  };

  const confirmRevoke = () => {
    setAllBlacklistEntries((prevEntries) =>
      prevEntries.map((entry) =>
        entry.id === selectedEntry.id ? { ...entry, status: "Revoked" } : entry
      )
    );
    setIsRevokeModalOpen(false);
    setSelectedEntry(null);
  };

  const handleEditBlacklist = (entryId) => {
    alert(`Editing blacklist entry for ID: ${entryId}`);
  };

  const handleAddBlacklistClick = () => {
    setIsAddBlacklistModalOpen(true);
  };

  const handleNewEntryChange = (e) => {
    const { name, value } = e.target;
    setNewBlacklistEntry((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewEntry = (e) => {
    e.preventDefault();
    const employee = allEmployees.find(
      (emp) => emp.employeeId === newBlacklistEntry.employeeId
    );

    if (!employee) {
      alert("Employee ID not found in the directory.");
      return;
    }

    const newEntry = {
      id: Math.random().toString(36).substr(2, 9),
      employeeId: newBlacklistEntry.employeeId,
      employeeName: employee.name,
      reason: newBlacklistEntry.reason,
      date: new Date(newBlacklistEntry.date).toISOString(),
      subsidiary: newBlacklistEntry.subsidiary,
      status: "Active",
    };

    setAllBlacklistEntries((prev) => [...prev, newEntry]);
    setIsAddBlacklistModalOpen(false);
    setNewBlacklistEntry({
      employeeId: "",
      reason: "",
      date: new Date().toISOString().split("T")[0],
      subsidiary: currentSubsidiary,
      status: "Active",
    });
    alert("Blacklist entry added successfully!");
  };

  const uniqueReasons = [
    "All",
    ...new Set(allBlacklistEntries.map((entry) => entry.reason)),
  ];

  return (
    <div className={styles.blacklistManagement}>
      <div className={styles.controls}>
        <div className={styles.searchAndFilters}>
          <div className={styles.searchBar}>
            <SearchIcon className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className={styles.filters}>
            <div className={styles.filterGroup}>
              <label htmlFor="reasonFilter">Reason</label>
              <select
                id="reasonFilter"
                value={filterReason}
                onChange={(e) => setFilterReason(e.target.value)}
              >
                {uniqueReasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label htmlFor="statusFilter">Status</label>
              <select
                id="statusFilter"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="All">All</option>
                <option value="Active">Active</option>
                <option value="Revoked">Revoked</option>
              </select>
            </div>
          </div>
        </div>

        {(userRole === "admin" || userRole === "super_admin") && (
          <button className={styles.addButton} onClick={handleAddBlacklistClick}>
            + Add New Blacklist
          </button>
        )}
      </div>

      {filteredEntries.length > 0 ? (
        <div className={styles.tableContainer}>
          <table className={styles.blacklistTable}>
            <thead>
              <tr>
                <th>Employee ID</th>
                <th>Name</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Subsidiary</th>
                <th>Status</th>
                {userRole !== "viewer" && <th>Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id}>
                  <td>{entry.employeeId}</td>
                  <td>{entry.employeeName}</td>
                  <td>{entry.reason}</td>
                  <td>{new Date(entry.date).toLocaleDateString()}</td>
                  <td>{entry.subsidiary}</td>
                  <td>{entry.status}</td>
                  {userRole !== "viewer" && (
                    <td>
                      <button
                        onClick={() => handleEditBlacklist(entry.id)}
                        className={styles.tableActionBtn}
                      >
                        Edit
                      </button>
                      {entry.status !== "Revoked" && (
                        <button
                          onClick={() => handleRevokeClick(entry.id)}
                          className={styles.tableActionBtn}
                        >
                          Revoke
                        </button>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <GlassCard className={styles.noEntries}>
          <p>No blacklist entries found for the current filters.</p>
        </GlassCard>
      )}

      <ConfirmationModal
        isOpen={isRevokeModalOpen}
        title="Confirm Revoke Blacklist"
        message={`Are you sure you want to revoke the blacklist entry for ${selectedEntry?.employeeName} (${selectedEntry?.reason})? This action cannot be undone.`}
        onConfirm={confirmRevoke}
        onCancel={() => setIsRevokeModalOpen(false)}
      />

      {isAddBlacklistModalOpen && (
        <div className={styles.modalOverlay}>
          {/* Add entry form goes here if needed */}
        </div>
      )}
    </div>
  );
};

export default BlacklistManagement;
