import React, { useState, useEffect } from "react";
import styles from "./BlacklistManagement.module.scss";
import BlacklistCard from "../../components/BlacklistCard/BlacklistCard";
import GlassCard from "../../components/GlassCard/GlassCard";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import useAuth from "../../hooks/useAuth";
import SearchIcon from "@mui/icons-material/Search";
import FilterListIcon from "@mui/icons-material/FilterList";


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
    date: new Date().toISOString().split("T")[0], // YYYY-MM-DD
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
    // In a real app, this would navigate to an edit form
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
      id: Math.random().toString(36).substr(2, 9), // Simple ID for dummy data
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
  const uniqueEmployeeIds = allEmployees.map((emp) => emp.employeeId);

  return (
    <div className={styles.blacklistManagement}>
      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search by name, ID, or reason..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className={styles.filters}>
          <div className={styles.filterGroup}>
            <FilterListIcon className={styles.filterIcon} />
            <label htmlFor="reasonFilter">Reason:</label>
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
            <FilterListIcon className={styles.filterIcon} />
            <label htmlFor="statusFilter">Status:</label>
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
        {(userRole === "admin" || userRole === "super_admin") && (
          <button
            className={styles.addButton}
            onClick={handleAddBlacklistClick}
          >
            + Add New Blacklist
          </button>
        )}
      </div>

      <div className={styles.blacklistGrid}>
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry) => (
            <BlacklistCard
              key={entry.id}
              entry={entry}
              onRevoke={handleRevokeClick}
              onEdit={handleEditBlacklist}
              userRole={userRole}
            />
          ))
        ) : (
          <GlassCard className={styles.noEntries}>
            <p>No blacklist entries found for the current filters.</p>
          </GlassCard>
        )}
      </div>

      <ConfirmationModal
        isOpen={isRevokeModalOpen}
        title="Confirm Revoke Blacklist"
        message={`Are you sure you want to revoke the blacklist entry for ${selectedEntry?.employeeName} (${selectedEntry?.reason})? This action cannot be undone.`}
        onConfirm={confirmRevoke}
        onCancel={() => setIsRevokeModalOpen(false)}
      />

      {isAddBlacklistModalOpen && (
        <div className={styles.modalOverlay}>
          <GlassCard className={styles.addBlacklistModal}>
            <h3 className={styles.modalTitle}>Add New Blacklist Entry</h3>
            <form onSubmit={handleSubmitNewEntry} className={styles.addForm}>
              <div className={styles.formGroup}>
                <label htmlFor="employeeId">Employee ID:</label>
                <input
                  type="text"
                  id="employeeId"
                  name="employeeId"
                  value={newBlacklistEntry.employeeId}
                  onChange={handleNewEntryChange}
                  list="employee-ids"
                  required
                />
                <datalist id="employee-ids">
                  {uniqueEmployeeIds.map((id) => (
                    <option key={id} value={id} />
                  ))}
                </datalist>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="reason">Reason:</label>
                <input
                  type="text"
                  id="reason"
                  name="reason"
                  value={newBlacklistEntry.reason}
                  onChange={handleNewEntryChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="date">Date:</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={newBlacklistEntry.date}
                  onChange={handleNewEntryChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="subsidiary">Subsidiary:</label>
                <select
                  id="subsidiary"
                  name="subsidiary"
                  value={newBlacklistEntry.subsidiary}
                  onChange={handleNewEntryChange}
                  disabled={userRole !== "super_admin"}
                  required
                >
                  <option value="harare">Harare</option>
                  <option value="bulawayo">Bulawayo</option>
                  <option value="masvingo">Masvingo</option>
                </select>
              </div>
              <div className={styles.formActions}>
                <button
                  type="button"
                  className={styles.cancelButton}
                  onClick={() => setIsAddBlacklistModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Add Entry
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default BlacklistManagement;
