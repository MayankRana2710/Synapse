# Discord Clone - Working Routes

## Public Routes (No Authentication Required)

### Core Pages
- **`/`** - Landing page / Home page (Synapse marketing page)
- **`/sign-in/[[...sign-in]]`** - Clerk authentication - Sign in page
- **`/sign-up/[[...sign-up]]`** - Clerk authentication - Sign up page

---

## Protected Routes (Authentication Required)

### Setup & Onboarding
- **`/setup`** - Initial server setup page (redirects to first server if setup complete)

### Main Application
- **`/servers/[serverId]`** - Main server page
- **`/servers/[serverId]/channels/[channelId]`** - Text/Audio/Video channel view
- **`/servers/[serverId]/conversations/[memberId]`** - Direct message conversation

### Invite Flow
- **`/invite/[inviteCode]`** - Join server via invite link

---

## API Routes (Backend)

### Server Management
- `POST /api/servers` - Create new server
- `PATCH /api/servers/[serverId]` - Update server
- `DELETE /api/servers/[serverId]` - Delete server
- `POST /api/servers/[serverId]/invite-code` - Generate invite code
- `PATCH /api/servers/[serverId]/leave` - Leave server

### Channel Management
- `POST /api/channels` - Create channel
- `PATCH /api/channels/[channelId]` - Update channel
- `DELETE /api/channels/[channelId]` - Delete channel

### Member Management
- `PATCH /api/members/[memberId]` - Update member role (admin/moderator/guest)
- `DELETE /api/members/[memberId]` - Kick member from server

### Messages
- `GET /api/messages` - Fetch messages with pagination
- `POST /api/messages` - Send message
- `DELETE /api/messages` - Delete message

### Direct Messages
- `GET /api/direct-messages` - Fetch DM messages with pagination
- `POST /api/direct-messages` - Send DM message

### Media
- `GET /api/livekit` - Get LiveKit token for video calls

### Upload
- `POST /api/uploadthing` - File upload endpoint (via UploadThing)

### Socket Events
- `GET /api/socket/io` - Socket.IO server
- `POST /api/socket/messages` - Handle socket messages
- `PATCH /api/socket/messages/[messageId]` - Update message via socket
- `DELETE /api/socket/messages/[messageId]` - Delete message via socket
- `POST /api/socket/direct-messages` - Handle DM socket events
- `PATCH /api/socket/direct-messages/[directMessageId]` - Update DM via socket
- `DELETE /api/socket/direct-messages/[directMessageId]` - Delete DM via socket

---

## Button Navigation Summary

### Landing Page (`/`)
| Button | Goes To | Status |
|--------|---------|--------|
| "Sign in" (nav) | `/sign-in` | ✅ Working |
| "Start for free" (nav) | `/sign-up` | ✅ Working |
| "Start free trial" (hero) | `/sign-up` | ✅ Working |
| "Sign in →" (hero) | `/sign-in` | ✅ Working |
| "Get started free" (CTA card) | `/sign-up` | ✅ Working |

### Sign In Flow
- After signing in → Redirects to `/setup` or first available `/servers/[serverId]`

### Sign Up Flow
- After signing up → Redirects to `/setup` to create/join first server

### Setup Page (`/setup`)
- After creating first server → Redirects to `/servers/[serverId]`

### Main App Navigation
- Left sidebar: Navigate between servers and channels
- Header: Mobile toggle, member management, settings
- Chat area: Send messages, upload files, start video calls

---

## Authentication Flow

```
Landing Page (/)
    ↓
Sign In (/sign-in) OR Sign Up (/sign-up)
    ↓
Setup (/setup) - Create first server or join via invite
    ↓
Main App (/servers/[serverId])
    ├── Text Channels (/servers/[serverId]/channels/[channelId])
    ├── Voice/Video Channels (/servers/[serverId]/channels/[channelId])
    └── Direct Messages (/servers/[serverId]/conversations/[memberId])
```

---

## Features by Route

### `/` - Landing Page
- ✅ Marketing UI with glassmorphic design
- ✅ Feature showcase cards
- ✅ Statistics display
- ✅ Sign up CTA with form
- ✅ Responsive design with custom cursor

### `/sign-in` & `/sign-up`
- ✅ Clerk authentication
- ✅ OAuth integration (Google, Discord, etc.)
- ✅ Email/password authentication

### `/setup`
- ✅ First-time user onboarding
- ✅ Create first server or join existing
- ✅ Server configuration modal

### `/servers/[serverId]`
- ✅ Server sidebar with channels and members
- ✅ Channel list (text, audio, video)
- ✅ Member list with roles
- ✅ Server settings (admin only)
- ✅ Leave/delete server options

### `/servers/[serverId]/channels/[channelId]`
- ✅ Channel chat/messages
- ✅ Real-time message updates via Socket.IO
- ✅ File uploads (images, PDFs)
- ✅ Video/audio calls via LiveKit
- ✅ Message editing/deletion
- ✅ User mentions and reactions (prepared in UI components)

### `/servers/[serverId]/conversations/[memberId]`
- ✅ Direct message conversation
- ✅ Real-time DM updates via Socket.IO
- ✅ File sharing
- ✅ Video calls

### `/invite/[inviteCode]`
- ✅ Join server via public invite link
- ✅ Auto-accept and redirect to server

---

## Current Build Status
✅ **Build successful** - All routes compile without errors
✅ **No type errors** - TypeScript validation passes
✅ **Production ready** - Build optimized for deployment
