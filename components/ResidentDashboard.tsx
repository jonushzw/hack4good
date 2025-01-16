// components/ResidentDashboard.tsx
import React from 'react';
import Card from '@/components/Card';
import Image from 'next/image';
import dashboardLogo from '@/public/dashboardlogo.jpg';

const ResidentDashboard = () => {
    return (
        <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '15px' }}>
                <Image src={dashboardLogo} alt="Dashboard Logo" width={350} height={350} />
            </div>
            <h1 style={{ fontWeight: 'bold' }}>Welcome Back</h1>
            <h2>Dashboard</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
                <Card
                    title="Voucher Balance"
                    description="View your current voucher balance and transaction history"
                    link="/dashboard/profile"
                />
                <Card
                    title="Available Products"
                    description="Browse available products in the minimart catalogue"
                    link="/dashboard/catalogue"
                />
                <Card
                    title="Tasks"
                    description="View and manage your tasks"
                    link="/dashboard/tasks"
                />
            </div>
        </div>
    );
};

export default ResidentDashboard;