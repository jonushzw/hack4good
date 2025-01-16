'use client';

import { Calendar, Home, Inbox, Search, Shield } from "lucide-react";
import React from "react";
import { useUser } from "@clerk/nextjs";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";

// Menu items.
const items = [
    {
        title: "Home",
        url: "/dashboard",
        icon: Home,
    },
    {
        title: "Profile",
        url: "/dashboard/profile",
        icon: Inbox,
    },
    {
        title: "Tasks",
        url: "/dashboard/tasks",
        icon: Calendar,
    },
    {
        title: "Catalogue",
        url: "/dashboard/catalogue",
        icon: Search,
    },

];

export function AppSidebar() {
    const { user } = useUser();

    // Check if the user is an admin
    const isAdmin = user?.publicMetadata.role === "admin";

    return (
        <Sidebar style={{ marginTop: '100px' }}> {/* Adjust margin as needed */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <>
                                {items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild>
                                            <a href={item.url}>
                                                <item.icon />
                                                <span>{item.title}</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                                {isAdmin && (
                                    <SidebarMenuItem key="Admin">
                                        <SidebarMenuButton asChild>
                                            <a href="/dashboard/admin">
                                                <Shield />
                                                <span>Admin</span>
                                            </a>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                )}
                            </>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    );
}