"use client";

import React from 'react';
import { SignInButton } from '@clerk/nextjs';

const CustomSignInButton = () => {
    return (
        <SignInButton>
            <button style={styles.button}>
                Sign In
            </button>
        </SignInButton>
    );
};

const styles = {
    button: {
        backgroundColor: '#ff9900',
        color: 'white',
        padding: '10px 20px',
        fontSize: '16px',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    },
};

export default CustomSignInButton;