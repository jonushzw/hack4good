import {
    ClerkProvider,
} from '@clerk/nextjs'
import './globals.css'
import Header from "@/components/header";
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <ClerkProvider afterSignOutUrl="/">
            <html lang="en">
            <body>
            <Header />
            {children}
            </body>
            </html>
        </ClerkProvider>
    )
}