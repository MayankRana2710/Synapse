"use server";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";

export async function handleGetStartedRedirect() {
  const profile = await currentProfile();

  if (!profile) {
    return redirect("/setup");
  }

  // Get the user's first server
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
    include: {
      channels: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!server) {
    return redirect("/setup");
  }

  const initialChannel = server.channels[0];

  return redirect(`/servers/${server.id}/channels/${initialChannel.id}`);
}
