# Instagram Insights App - MVP Handover Document

This document outlines the Minimum Viable Product (MVP) functionality of each screen in the Instagram Insights App. It is written for a developer taking over the project.

---

## ✨ Overview

- **Tech Stack**: Next.js 13+ (App Router), Prisma, PostgreSQL, NextAuth.js, Tailwind CSS
- **Auth**: Email/password (CredentialsProvider)
- **Data**: Instagram `.json` or `.zip` exports parsed client-side or server-side
- **Hosting**: Vercel

---

## 🔐 Authentication <input type="checkbox" checked />

### `/login`

- **Purpose**: Secure access to dashboard and tools
- **Files**: `app/login/page.tsx`, `app/api/auth/[...nextauth]/route.ts`
- **Features**:
  - Login form (email, password)
  - Credentials provider via Prisma
  - Redirect to `/dashboard` on success

---

## 🏠 Dashboard <input type="checkbox" checked />

### `/dashboard`

- **Purpose**: Central user interface with upload + insights
- **Files**: `page.tsx`, `logout-button.tsx`, `upload-box.tsx`, `lib/getStats.ts`
- **Features**:
  - Authenticated access (uses `getServerSession`)
  - Upload zone for `.json` or `.zip`
  - Stats section (Followers, Following, Unfollowers)
  - `getUserStats` pulls counts from DB

---

## 👥 Followers Tool <input type="checkbox" checked />

### `/dashboard/followers`

- **Purpose**: View and track your followers
- **Files**: `page.tsx`, `api/followers/route.ts`, `api/followers/diff/route.ts`
- **Features**:
  - Upload `followers_1.json`
  - Parse and display usernames, hrefs, timestamps
  - Compare with previous batch
  - Calculate total, added, removed, and % change
  - Each upload tracked by `uploadBatch`

---

## 👣 Following Tool <input type="checkbox" checked />

### `/dashboard/following`

- **Purpose**: View and track who you follow
- **Files**: `page.tsx`, `api/following/route.ts`, `api/following/diff/route.ts`
- **Features**:
  - Upload `following.json`
  - Parse usernames, links, timestamps
  - Compare with last batch
  - Stats: total, new, removed, % change

---

## ❌ Non-Followers Tool<input type="checkbox" checked />

### `/dashboard/non-followers`

- **Purpose**: Discover who doesn't follow you back
- **Files**: `page.tsx`
- **Features**:
  - Upload both `followers_1.json` and `following.json`
  - Pure client-side comparison
  - Display list of non-followers

---

## 📩 Pending Requests Tool<input type="checkbox" checked />

### `/dashboard/pending-requests`

- **Purpose**: Track sent follow requests
- **Files**: `page.tsx`
- **Features**:
  - Upload `pending_follow_requests.json`
  - Parse and display accounts + timestamps
  - Show total requests

---

## 🧹 Clear DB Tool <input type="checkbox" checked />

### `/dashboard/clear`

- **Purpose**: Selectively delete your data
- **Files**: `page.tsx`, `api/clear-db/route.ts`
- **Features**:
  - UI with checkboxes (followers, following, non-followers, pending)
  - Server route handles deletion based on selection

---

## Close Friends <input type="checkbox" />

### `/dashboard/closeFriends`
- **Purpose**: Displays the close friends list
- **Files**: 
- **Features**: 
  - UI to showcase all the Close friends from JSON



## 📂 Prisma Schema

```prisma
model User {
  id         String   @id @default(cuid())
  email      String   @unique
  password   String
  name       String?
  followers       Follower[]
  followings      Following[]
  nonFollowers    NonFollower[]
  pendingRequests PendingRequest[]
}

model Follower {
  id          String   @id @default(cuid())
  username    String
  href        String
  followedAt  String
  uploadedAt  DateTime
  uploadBatch Int
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}

model Following {
  id          String   @id @default(cuid())
  username    String
  href        String
  followedAt  String
  uploadedAt  DateTime
  uploadBatch Int
  userId      String
  user        User     @relation(fields: [userId], references: [id])
}

model PendingRequest {
  id         String   @id @default(cuid())
  username   String
  href       String
  timestamp  String
  userId     String
  user       User     @relation(fields: [userId], references: [id])
}

model NonFollower {
  id        String   @id @default(cuid())
  username  String
  href      String
  userId    String
  user      User     @relation(fields: [userId], references: [id])
}
```

---

## 🔒 Auth & Sessions

- Strategy: `jwt`
- User `id` is embedded in the token
- Access via `useSession` or `getServerSession`
- Guard each tool page for authenticated users

---

## 💾 File Upload Expectations

- Instagram export format:
  - `followers_1.json`
  - `following.json`
  - `pending_follow_requests.json`
- Users can also upload a `.zip` (planned feature)
- File parsed on upload; data sent to backend APIs

---

## 📅 Deployment Notes

- Platform: **Vercel**
- `.env` file must include:
  ```env
  DATABASE_URL=postgresql://...
  NEXTAUTH_SECRET=some_secret_key
  ```
- In `vercel.json` or `package.json`, ensure Prisma is generated before build:
  ```json
  "scripts": {
    "build": "prisma generate && next build"
  }
  ```

---

## ✨ Future Enhancements (optional)

- Compare `.zip` uploads instead of individual files
- CSV export of insights
- Dark/light theme toggle
- Mobile responsiveness
- Per-tool history view (timeline)

---

## ✉️ Questions?

Contact original developer or check `/docs` folder (to be created) for architecture diagrams and component guides.

---

**End of MVP Handover**

