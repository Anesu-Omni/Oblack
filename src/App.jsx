import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar/Sidebar';
import Topbar from './components/Topbar/Topbar';
import Dashboard from './pages/Dashboard/Dashboard';
import BlacklistManagement from './pages/BlacklistManagement/BlacklistManagement';
import EmployeeDirectory from './pages/EmployeeDirectory/EmployeeDirectory';
import generateDummyData from './data/dummyData';
import useAuth from './hooks/useAuth'; // Import the useAuth hook
import './App.scss'; // Main App SCSS for layout

const App = () => {
  const [theme, setTheme] = useState('dark'); // Only dark theme for Oblack
  const [allEmployees, setAllEmployees] = useState([]);
  const [allBlacklistEntries, setAllBlacklistEntries] = useState([]);
  const [currentSubsidiary, setCurrentSubsidiary] = useState('harare'); // Default subsidiary

  const { userRole } = useAuth(); // Get the user role

  useEffect(() => {
    const { employees, blacklistEntries } = generateDummyData();
    setAllEmployees(employees);
    setAllBlacklistEntries(blacklistEntries);
  }, []);

  const handleThemeToggle = () => {
    // For Oblack, theme is always dark, but keeping the toggle for demo purposes
    // If a light mode were introduced, this would switch between 'dark' and 'light'
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };

  const getPageTitle = (pathname) => {
    switch (pathname) {
      case '/':
        return 'Dashboard';
      case '/blacklist':
        return 'Blacklist Management';
      case '/employees':
        return 'Employee Directory';
      default:
        return 'Oblack System';
    }
  };

  // Component to get current page title from location
  const PageTitleUpdater = () => {
    const location = useLocation();
    const [pageTitle, setPageTitle] = useState('');

    useEffect(() => {
      setPageTitle(getPageTitle(location.pathname));
    }, [location.pathname]);

    return (
      <Topbar
        pageTitle={pageTitle}
        theme={theme}
        onThemeToggle={handleThemeToggle}
      />
    );
  };

  return (
    <Router>
      <div className={`app ${theme}`}>
        <Sidebar
          onSubsidiaryChange={setCurrentSubsidiary}
          currentSubsidiary={currentSubsidiary}
        />
        <div className="mainLayout">
          <PageTitleUpdater />
          <main className="mainContentArea">
            <Routes>
              <Route path="/" element={
                <Dashboard
                  allBlacklistEntries={allBlacklistEntries}
                  allEmployees={allEmployees}
                  currentSubsidiary={currentSubsidiary}
                />
              } />
              <Route path="/blacklist" element={
                <BlacklistManagement
                  allBlacklistEntries={allBlacklistEntries}
                  setAllBlacklistEntries={setAllBlacklistEntries}
                  currentSubsidiary={currentSubsidiary}
                  allEmployees={allEmployees} // Pass employees for adding new blacklist entry validation
                />
              } />
              <Route path="/employees" element={
                <EmployeeDirectory
                  allEmployees={allEmployees}
                  setAllEmployees={setAllEmployees}
                  allBlacklistEntries={allBlacklistEntries}
                  setAllBlacklistEntries={setAllBlacklistEntries}
                  currentSubsidiary={currentSubsidiary}
                />
              } />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;