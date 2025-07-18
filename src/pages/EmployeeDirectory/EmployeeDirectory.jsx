import React, { useState, useEffect } from "react";
import styles from "./EmployeeDirectory.module.scss";
import EmployeeProfileCard from "../../components/EmployeeProfileCard/EmployeeProfileCard";
import GlassCard from "../../components/GlassCard/GlassCard";
import ConfirmationModal from "../../components/ConfirmationModal/ConfirmationModal";
import useAuth from "../../hooks/useAuth";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";


const EmployeeDirectory = ({
  allEmployees,
  setAllEmployees,
  allBlacklistEntries,
  setAllBlacklistEntries,
  currentSubsidiary,
}) => {
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isBlacklistModalOpen, setIsBlacklistModalOpen] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [newEmployeeData, setNewEmployeeData] = useState({
    name: "",
    employeeId: "",
    department: "",
    subsidiary: currentSubsidiary,
  });
  const [blacklistReason, setBlacklistReason] = useState("");

  const { userRole } = useAuth();

  useEffect(() => {
    let currentFiltered =
      userRole === "super_admin"
        ? allEmployees
        : allEmployees.filter(
            (emp) => emp.subsidiary.toLowerCase() === currentSubsidiary
          );

    if (searchTerm) {
      currentFiltered = currentFiltered.filter(
        (employee) =>
          employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          employee.employeeId
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          employee.department.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Add a status based on whether they are in the blacklist
    const employeesWithStatus = currentFiltered.map((emp) => {
      const isBlacklisted = allBlacklistEntries.some(
        (entry) =>
          entry.employeeId === emp.employeeId && entry.status === "Active"
      );
      return { ...emp, status: isBlacklisted ? "Blacklisted" : "Active" };
    });

    setFilteredEmployees(employeesWithStatus);
  }, [
    allEmployees,
    allBlacklistEntries,
    searchTerm,
    currentSubsidiary,
    userRole,
  ]);

  useEffect(() => {
    setNewEmployeeData((prev) => ({ ...prev, subsidiary: currentSubsidiary }));
  }, [currentSubsidiary]);

  const handleBlacklistClick = (employeeId) => {
    const employeeToBlacklist = allEmployees.find(
      (emp) => emp.id === employeeId
    );
    setSelectedEmployee(employeeToBlacklist);
    setIsBlacklistModalOpen(true);
  };

  const confirmBlacklist = () => {
    if (selectedEmployee && blacklistReason) {
      const newBlacklistEntry = {
        id: Math.random().toString(36).substr(2, 9), // Simple ID for dummy data
        employeeId: selectedEmployee.employeeId,
        employeeName: selectedEmployee.name,
        reason: blacklistReason,
        date: new Date().toISOString(),
        subsidiary: selectedEmployee.subsidiary,
        status: "Active",
      };
      setAllBlacklistEntries((prevEntries) => [
        ...prevEntries,
        newBlacklistEntry,
      ]);
      setIsBlacklistModalOpen(false);
      setSelectedEmployee(null);
      setBlacklistReason("");
      alert(
        `${selectedEmployee.name} has been blacklisted for "${blacklistReason}".`
      );
    }
  };

  const handleAddEmployeeClick = () => {
    setIsAddEmployeeModalOpen(true);
  };

  const handleNewEmployeeChange = (e) => {
    const { name, value } = e.target;
    setNewEmployeeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmitNewEmployee = (e) => {
    e.preventDefault();
    // Basic validation
    if (
      !newEmployeeData.name ||
      !newEmployeeData.employeeId ||
      !newEmployeeData.department ||
      !newEmployeeData.subsidiary
    ) {
      alert("Please fill in all fields.");
      return;
    }
    if (
      allEmployees.some((emp) => emp.employeeId === newEmployeeData.employeeId)
    ) {
      alert("Employee ID already exists.");
      return;
    }

    const newEmployee = {
      id: Math.random().toString(36).substr(2, 9),
      ...newEmployeeData,
      status: "Active",
    };
    setAllEmployees((prev) => [...prev, newEmployee]);
    setIsAddEmployeeModalOpen(false);
    setNewEmployeeData({
      name: "",
      employeeId: "",
      department: "",
      subsidiary: currentSubsidiary,
    });
    alert("New employee added successfully!");
  };

  return (
    <div className={styles.employeeDirectory}>
      <div className={styles.controls}>
        <div className={styles.searchBar}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search employees by name, ID, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        {(userRole === "admin" || userRole === "super_admin") && (
          <button className={styles.addButton} onClick={handleAddEmployeeClick}>
            <AddCircleOutlineIcon /> Add New Employee
          </button>
        )}
      </div>

<div className={styles.employeeTableWrapper}>
  {filteredEmployees.length > 0 ? (
    <table className={styles.employeeTable}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Employee ID</th>
          <th>Department</th>
          <th>Subsidiary</th>
          <th>Status</th>
          {(userRole === "admin" || userRole === "super_admin") && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {filteredEmployees.map((employee) => (
          <tr key={employee.id}>
            <td>{employee.name}</td>
            <td>{employee.employeeId}</td>
            <td>{employee.department}</td>
            <td>{employee.subsidiary}</td>
            <td
              className={
                employee.status === "Blacklisted"
                  ? styles.blacklisted
                  : styles.active
              }
            >
              {employee.status}
            </td>
            {(userRole === "admin" || userRole === "super_admin") && (
              <td>
                <button
                  className={styles.blacklistButton}
                  onClick={() => handleBlacklistClick(employee.id)}
                  disabled={employee.status === "Blacklisted"}
                >
                  Blacklist
                </button>
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <GlassCard className={styles.noEmployees}>
      <p>No employees found for the current search or subsidiary.</p>
    </GlassCard>
  )}
</div>


      <ConfirmationModal
        isOpen={isBlacklistModalOpen}
        title="Confirm Blacklist Employee"
        message={
          <div className={styles.blacklistReasonPrompt}>
            <p>
              Are you sure you want to blacklist{" "}
              <strong>{selectedEmployee?.name}</strong>?
            </p>
            <label htmlFor="blacklistReason">Reason for blacklisting:</label>
            <input
              type="text"
              id="blacklistReason"
              value={blacklistReason}
              onChange={(e) => setBlacklistReason(e.target.value)}
              placeholder="e.g., Fraud, Misconduct"
              className={styles.reasonInput}
            />
          </div>
        }
        onConfirm={confirmBlacklist}
        onCancel={() => {
          setIsBlacklistModalOpen(false);
          setBlacklistReason("");
        }}
      />

      {isAddEmployeeModalOpen && (
        <div className={styles.modalOverlay}>
          <GlassCard className={styles.addEmployeeModal}>
            <h3 className={styles.modalTitle}>Add New Employee</h3>
            <form onSubmit={handleSubmitNewEmployee} className={styles.addForm}>
              <div className={styles.formGroup}>
                <label htmlFor="newName">Name:</label>
                <input
                  type="text"
                  id="newName"
                  name="name"
                  value={newEmployeeData.name}
                  onChange={handleNewEmployeeChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="newEmployeeId">Employee ID:</label>
                <input
                  type="text"
                  id="newEmployeeId"
                  name="employeeId"
                  value={newEmployeeData.employeeId}
                  onChange={handleNewEmployeeChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="newDepartment">Department:</label>
                <input
                  type="text"
                  id="newDepartment"
                  name="department"
                  value={newEmployeeData.department}
                  onChange={handleNewEmployeeChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="newSubsidiary">Subsidiary:</label>
                <select
                  id="newSubsidiary"
                  name="subsidiary"
                  value={newEmployeeData.subsidiary}
                  onChange={handleNewEmployeeChange}
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
                  onClick={() => setIsAddEmployeeModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className={styles.submitButton}>
                  Add Employee
                </button>
              </div>
            </form>
          </GlassCard>
        </div>
      )}
    </div>
  );
};

export default EmployeeDirectory;
