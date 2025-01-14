import React from 'react';
import DashboardLayout from '@/components/DashboardLayout';
import ResidentDashboard from '@/components/ResidentDashboard';

const DashboardPage = () => {
    return (
        <DashboardLayout>
            <ResidentDashboard />
        </DashboardLayout>
    );
};

export default DashboardPage;