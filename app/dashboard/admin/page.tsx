'use client';
import { useUser } from '@clerk/nextjs';

export default function AdminPage() {
    const { user } = useUser();

    if (!user) return <p>Loading...</p>;

    return (
        <div>
            <h1>Welcome, Admin</h1>
            <p>This is the admin page. Here you can manage your application.</p>
            {/* Add more admin-specific content here */}
        </div>
    );
}