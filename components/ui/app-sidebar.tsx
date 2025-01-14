import { Calendar, Home, Inbox, Search} from "lucide-react"
import React from "react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

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
        title: "Catalogue",
        url: "/dashboard/catalogue",
        icon: Search,
    },
    {
        title: "Tasks",
        url: "/dashboard/tasks",
        icon: Calendar,
    },
]

export function AppSidebar() {
    return (
        <Sidebar style={{ marginTop: '60px' }}> {/* Adjust margin as needed */}
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
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
                            </>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}