import React from 'react';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div style={{ display: 'flex', height: '100vh' }}>
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <main style={{ flex: 1, padding: '20px' }}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DashboardLayout;