'use client';

import { UserButton, useUser} from "@clerk/nextjs";

export default function Header() {
    const { isLoaded, isSignedIn, user } = useUser();

    return (
        <header style={styles.header}>
            <div style={styles.logo}><img src="/logo.png" alt="Logo" style={{width:"70px",height:"auto"}}/></div>
            {isLoaded && isSignedIn && (
                <div style={styles.userSection}>
                    <h1 style={styles.username}>{user?.username}</h1>
                    <UserButton />
                </div>
            )}
        </header>
    );
}

const styles = {
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px 20px',
        backgroundColor: '#1d6dbd',
    },
    logo: {
        fontSize: '24px',
        fontWeight: 'bold',
        color: 'white',
    },
    userSection: {
        display: 'flex',
        alignItems: 'center',
    },
    username: {
        fontSize: '20px',
        fontFamily: 'Inter, sans-serif',
        marginRight: '10px',
        fontWeight: 'semi bold',
        color: 'white',
    },
};