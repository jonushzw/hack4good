import React, { CSSProperties } from 'react';

const Dashboard = () => {
    return (
        <div style={styles.container}>
            <header style={styles.header}>
                <h1 style={styles.headerTitle}>Dashboard</h1>
            </header>
            <div style={styles.content}>
                <aside style={styles.sidebar}>
                    <nav>
                        <ul style={styles.navList}>
                            <li style={styles.navItem}><a href="#" style={styles.navLink}>Home</a></li>
                            <li style={styles.navItem}><a href="#" style={styles.navLink}>Profile</a></li>
                            <li style={styles.navItem}><a href="#" style={styles.navLink}>Settings</a></li>
                            <li style={styles.navItem}><a href="#" style={styles.navLink}>Logout</a></li>
                        </ul>
                    </nav>
                </aside>
                <main style={styles.main}>
                    <h2 style={styles.mainTitle}>Welcome to your dashboard</h2>
                    <p style={styles.mainContent}>Here you can manage your profile, settings, and more.</p>
                </main>
            </div>
        </div>
    );
};

const styles: { [key: string]: CSSProperties } = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        fontFamily: 'Inter, sans-serif',
    },
    header: {
        backgroundColor: '#1d6dbd',
        padding: '20px',
        color: 'white',
        textAlign: 'center',
    },
    headerTitle: {
        margin: 0,
        fontSize: '24px',
    },
    content: {
        display: 'flex',
        flex: 1,
    },
    sidebar: {
        width: '200px',
        backgroundColor: '#f4f4f4',
        padding: '20px',
    },
    navList: {
        listStyleType: 'none',
        padding: 0,
    },
    navItem: {
        marginBottom: '10px',
    },
    navLink: {
        textDecoration: 'none',
        color: '#333',
    },
    main: {
        flex: 1,
        padding: '20px',
    },
    mainTitle: {
        fontSize: '20px',
        marginBottom: '10px',
    },
    mainContent: {
        fontSize: '16px',
    },
};

export default Dashboard;