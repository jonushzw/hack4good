import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    env: {
        CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY,
    },
};

export default nextConfig;