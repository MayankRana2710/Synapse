import { currentProfile } from '@/lib/current-profile';
import { db } from '@/lib/db';
import { ChannelType, MemberRole } from '@prisma/client';
import { redirect } from 'next/navigation';
import ServerHeader from './server-header';
import { ScrollArea } from '@/components/ui/scroll-area';
import ServerSearch from './server-search';
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from 'lucide-react';
// We drop the solid Separator for our hairline rule
import { ServerSection } from './server-section';
import { ServerChannel } from './server-channel';
import { ServerMember } from './server-member';

interface ServerSidebarProps {
    serverId: string;
}

// Updated icons to match the new stroke/opacity aesthetic
const iconMap = {
    [ChannelType.TEXT]: <Hash strokeWidth={1.7} className='mr-2 h-4 w-4 text-white/[0.3]' />,
    [ChannelType.AUDIO]: <Mic strokeWidth={1.7} className='mr-2 h-4 w-4 text-white/[0.3]' />,
    [ChannelType.VIDEO]: <Video strokeWidth={1.7} className='mr-2 h-4 w-4 text-white/[0.3]' />
}

const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: <ShieldCheck className='h-4 w-4 mr-2 text-indigo-400 opacity-80' />,
    [MemberRole.ADMIN]: <ShieldAlert className='h-4 w-4 mr-2 text-rose-400 opacity-80' />,
}

const ServerSidebar = async ({ serverId }: ServerSidebarProps) => {
    const profile = await currentProfile();
    if (!profile) return redirect("/");

    const server = await db.server.findUnique({
        where: { id: serverId },
        include: {
            channels: { orderBy: { createdAt: "asc" } },
            members: { include: { profile: true }, orderBy: { role: "asc" } }
        },
    });

    if (!server) return redirect("/")

    const textChannels = server?.channels.filter((channel) => channel.type === ChannelType.TEXT)
    const audioChannels = server?.channels.filter((channel) => channel.type === ChannelType.AUDIO)
    const videoChannels = server?.channels.filter((channel) => channel.type === ChannelType.VIDEO)
    const members = server?.members.filter((member) => member.profileId !== profile.id)
    const role = server.members.find((member) => member.profileId === profile.id)?.role;

    return (
        // Replaced solid background colors with transparent so the global app background handles it.
        // The right border gives it structure against the main chat area.
        <div className='flex flex-col h-full w-full bg-transparent border-r border-white/[0.045]'>
            <ServerHeader server={server} role={role} />
            
            <ScrollArea className='flex-1 px-3'>
                <div className='mt-3'>
                    <ServerSearch
                        data={[
                            {
                                label: "Text Channels",
                                type: "channel",
                                data: textChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Voice Channels",
                                type: "channel",
                                data: audioChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Video Channels",
                                type: "channel",
                                data: videoChannels?.map((channel) => ({
                                    id: channel.id,
                                    name: channel.name,
                                    icon: iconMap[channel.type]
                                }))
                            },
                            {
                                label: "Members",
                                type: "member",
                                data: members?.map((member) => ({
                                    id: member.id,
                                    name: member.profile.name,
                                    icon: roleIconMap[member.role]
                                }))
                            }
                        ]}
                    />
                </div>
                
                {/* Hairline Separator */}
                <div className='h-[1px] w-full bg-white/[0.045] rounded-full my-3' />
                
                {!!textChannels?.length && (
                    <div className='mb-2'>
                        <ServerSection sectionType='channels' channelType={ChannelType.TEXT} role={role} label='Text Channels' />
                        <div className='space-y-[2px]'>
                            {textChannels.map((channel) => (
                                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                            ))}
                        </div>
                    </div>
                )}
                
                {!!audioChannels?.length && (
                    <div className='mb-2'>
                        <ServerSection sectionType='channels' channelType={ChannelType.AUDIO} role={role} label='Voice Channels' />
                        <div className='space-y-[2px]'>
                            {audioChannels.map((channel) => (
                                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                            ))}
                        </div>
                    </div>
                )}
                
                {!!videoChannels?.length && (
                    <div className='mb-2'>
                        <ServerSection sectionType='channels' channelType={ChannelType.VIDEO} role={role} label='Video Channels' />
                        <div className='space-y-[2px]'>
                            {videoChannels.map((channel) => (
                                <ServerChannel key={channel.id} channel={channel} role={role} server={server} />
                            ))}
                        </div>
                    </div>
                )}
                
                {!!members?.length && (
                    <div className='mb-2'>
                        <ServerSection sectionType='members' role={role} label='Members' server={server} />
                        <div className='space-y-[2px]'>
                            {members.map((member) => (
                                <ServerMember key={member.id} member={member} server={server} />
                            ))}
                        </div>
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}

export default ServerSidebar