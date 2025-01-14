import { CSSProperties } from 'react';
import { auth, currentUser } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import CustomSignInButton from "@/components/CustomSignInButton";
import React from "react";

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
          <h1 style={styles.title}>Muhammadiyah Welfare Home Minimart and Voucher System</h1>
          <p style={styles.description}>
            Empowering residents with a user-friendly platform to request products, earn vouchers, and manage their accounts, while providing admins with robust management and reporting tools.
          </p>
          <CustomSignInButton />
        </header>
        <section style={styles.featuresSection}>
          <h2 style={styles.sectionTitle}>Key Features for Residents</h2>
          <ul style={styles.featuresList}>
            <li style={styles.featureItem}>Access a user-friendly dashboard to view voucher balances, transaction history, and available products.</li>
            <li style={styles.featureItem}>Easily request items from the minimart or place preorders for out-of-stock products.</li>
            <li style={styles.featureItem}>Secure login system with optional password reset via mobile.</li>
          </ul>
        </section>
        <section style={styles.featuresSection}>
          <h2 style={styles.sectionTitle}>Key Features for Admins</h2>
          <ul style={styles.featuresList}>
            <li style={styles.featureItem}>Manage users, including adding, suspending, and resetting passwords.</li>
            <li style={styles.featureItem}>Approve or reject voucher tasks and product requests with detailed tracking.</li>
            <li style={styles.featureItem}>Maintain and update inventory with audit logs for accountability.</li>
            <li style={styles.featureItem}>Generate comprehensive reports, such as weekly requests and inventory summaries.</li>
          </ul>
        </section>
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
    backgroundColor: '#1d6dbd',
    color: 'white',
    padding: '40px 20px',
  },
  title: {
    fontSize: '36px',
    margin: '0 0 20px',
  },
  description: {
    fontSize: '18px',
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
}