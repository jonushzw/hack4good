import React from 'react';
import Card from '@/components/Card';

const ResidentDashboard = () => {
  return (
      <div>
        <h1 style={{fontWeight: 'bold'}}>Welcome Back, </h1>
        <h2>Resident Dashboard</h2>
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          <Card
              title="Voucher Balance"
              description="View your current voucher balance."
              link="/dashboard/profile"
          />
          <Card
              title="Available Products"
              description="Browse available products in the minimart catalogue."
              link="/dashboard/catalogue"
          />
        </div>
      </div>
  );
};

export default ResidentDashboard;