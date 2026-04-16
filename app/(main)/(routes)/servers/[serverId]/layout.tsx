import ServerSidebar from '@/components/server/server-sidebar';
import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { RedirectToSignIn } from '@clerk/nextjs';
import { redirect } from 'next/navigation';
import React from 'react'

const ServerIdLayout = async ({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ serverId: string }>;
}) => {
    const profile = await currentProfile();

    if (!profile) {
        return <RedirectToSignIn />
    }

    const { serverId } = await params;

    const server = await db.server.findUnique({
        where: {
            id: serverId,
            members: {
                some: { profileId: profile.id }
            }
        }
    })

    if (!server) return redirect("/");
    
    return (
        <div className="h-full w-full relative flex">
            {/* The ServerSidebar width (w-60 -> 240px) remains to match standard layout */}
            <div className="hidden md:flex h-full w-60 z-20 flex-col fixed inset-y-0 bg-transparent">
                <ServerSidebar serverId={serverId} />
            </div>
            {/* Padded main content area */}
            <main className="h-full w-full md:pl-60 flex-1 relative z-10">
                {children}
            </main>
        </div>
    );
}

export default ServerIdLayout