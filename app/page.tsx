import { CSSProperties } from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CustomSignInButton from "@/components/CustomSignInButton";
import React from "react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from 'next/link';

export default async function Page() {
  // Get the userId from auth() -- if null, the user is not signed in
  const { userId } = await auth();

  if (userId) {
    // Redirect to the dashboard if the user is signed in
    redirect('/dashboard');
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();
  // Use `user` to render user details or create UI elements

  return (
      <div style={styles.container}>
        <header style={styles.header}>
          <div style={styles.headerOverlay}></div> 
          <h1 style={styles.title}>
          <strong>Muhammadiyah Welfare Home</strong> <br />
            Online Shop</h1>
          <p style={styles.description}>
            Sign in below to view shop
          </p>
          
        </header>

      <div style={{ marginTop: '20px', position: 'relative', zIndex: 2 }}>
      <CustomSignInButton style={styles.ctaButton} /> {/* Apply the button style */}
      </div>
      <div style={{ marginTop: '20px' }}>
        <Link href="/catalogue">
          <button style={styles.navButton}>Go to Catalog</button>
        </Link>
      </div>
      </div>
  );
};

const styles: { [key: string]: CSSProperties } = {
  container: {
    fontFamily: 'Inter, sans-serif',
    padding: '20px',
    textAlign: 'center',
  },
  header: {
    position: 'relative',
    backgroundImage: 'url(/sign%20in%20background.jpg)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: 'white',
    padding: '100px 20px',
    zIndex: 0,
  },
  headerOverlay: {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Adjust the transparency here
    zIndex: 0,
  },
  title: {
    fontSize: '36px',
    position: 'relative',
    zIndex: 1,
    margin: '0 0 20px',
  },
  description: {
    fontSize: '18px',
    position: 'relative',
    zIndex: 1,
    margin: '0 0 20px',
  },
  ctaButton: {
    backgroundColor: '#ff9900',
    color: 'white',
    padding: '10px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    zIndex: 2,
    position: 'relative',
  },
  featuresSection: {
    margin: '40px 0',
  },
  sectionTitle: {
    fontSize: '28px',
    margin: '0 0 20px',
  },
  featuresList: {
    listStyleType: 'none',
    padding: '0',
    fontSize: '18px',
  },
  featureItem: {
    margin: '10px 0',
  },
};