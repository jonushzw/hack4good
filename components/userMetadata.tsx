'use client';
import { useUser } from '@clerk/nextjs';
import AdminCard from "@/components/AdminCard";

export default function UserMetadata() {
    const { user } = useUser();

    if (!user) return null;

    const role = user?.publicMetadata.role;
    if (role === 'admin') {
        return <AdminCard />;
    }

    return null;
}