import React from 'react';
import Card from '@/components/Card';

const ResidentDashboard = () => {
  return (
    <div>
      <h1>Resident Dashboard</h1>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        <Card
          title="Voucher Balance"
          description="View your current voucher balance."
          link="/voucher-balance"
        />
        <Card
          title="Transaction History"
          description="View your past transactions."
          link="/transaction-history"
        />
        <Card
          title="Available Products"
          description="Browse available products in the minimart."
          link="/available-products"
        />
        <Card
          title="Request Product"
          description="Request a new product from the minimart."
          link="/request-product"
        />
        <Card
          title="Preorder Product"
          description="Preorder an out-of-stock product."
          link="/preorder-product"
        />
      </div>
    </div>
  );
};

export default ResidentDashboard;