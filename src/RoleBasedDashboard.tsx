import React from 'react';
// 🔥 FIXED: added `.ts` extension
import { useUserRole } from './hooks/useUserRole.ts';

const RoleBasedDashboard = () => {
  const { role, loading } = useUserRole();

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!role) {
    return <p>Role not found. Please contact support.</p>;
  }

  if (role === 'driver') {
    return <DriverDashboard />;
  } else if (role === 'broker') {
    return <BrokerDashboard />;
  } else if (role === 'company') {
    return <CompanyDashboard />;
  } else {
    return <p>Unknown role: {role}</p>;
  }
};

// Dummy dashboards (you'll customize these later)
const DriverDashboard = () => <h2>Welcome, Driver 👨‍✈️</h2>;
const BrokerDashboard = () => <h2>Welcome, Broker 📦</h2>;
const CompanyDashboard = () => <h2>Welcome, Company 🏢</h2>;

export default RoleBasedDashboard;
