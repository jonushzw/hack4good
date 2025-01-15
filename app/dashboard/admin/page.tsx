import { createClerkClient } from '@clerk/nextjs/server';
import { currentUser } from "@clerk/nextjs/server";

export default async function AdminPage() {
    // Fetch the current user
    const user = await currentUser();

    // Check if the user is authenticated
    if (!user) {
        return <p>You must be logged in to access this page.</p>;
    }

    // Check if the user is an admin
    const isAdmin = user.publicMetadata?.role === 'admin';
    if (!isAdmin) {
        return <p>You have no access to this page.</p>;
    }

    // Fetch the list of users using the Clerk secret key
    const clerkClient = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });
    let response;
    try {
        response = await clerkClient.users.getUserList();
    } catch (error) {
        console.error('Error fetching users:', error);
        return <p>Error fetching users.</p>;
    }

    const { data: users, totalCount } = response;

    return (
        <div>
            <h1>Welcome, Admin</h1>
            <p>This is the admin page. Here you can manage your application.</p>
            <h2>Users List</h2>
            <p>Total Users: {totalCount}</p>
            <ul>
                {users.map((user) => (
                    <li key={user.id}>
                        <p>ID: {user.id}</p>
                        <p>Name: {user.firstName} {user.lastName}</p>
                        <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
                        <p>Created At: {new Date(user.createdAt).toLocaleString()}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}