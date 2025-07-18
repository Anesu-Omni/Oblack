import { useState, useEffect } from 'react';

const useAuth = () => {
  // Simulate user role based on local storage or default to 'admin'
  const [userRole, _setUserRole] = useState(() => {
    return localStorage.getItem('oblackUserRole') || 'admin';
  });

  const setUserRole = (role) => {
    localStorage.setItem('oblackUserRole', role);
    _setUserRole(role);
  };

  return { userRole, setUserRole };
};

export default useAuth;