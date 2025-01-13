'use client';

import {SignedIn, SignedOut, SignInButton, UserButton} from "@clerk/nextjs";

export default function Header() {
    return (
        <header style={styles.header}>
            <div style={styles.logo}>LOGO</div>
            <SignedOut>
                <SignInButton>
                    <button className={'btn btn-primary'}>Login</button>
                </SignInButton>
            </SignedOut>
            <SignedIn>
                <UserButton />
            </SignedIn>

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
    },
    authButtons: {
        display: 'flex',
        alignItems: 'center',
    },
};