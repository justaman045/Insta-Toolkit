# 📦 Instagram Insights App — MVP Checklist

This document tracks the implementation status of the core features of the app. Completed tools are marked with ✅ checkboxes.

---

## ✅ Core Features

- [x] User Authentication via NextAuth (CredentialsProvider)
- [x] Protected Dashboard Layout
- [x] SQLite/PostgreSQL DB via Prisma
- [x] Vercel Deployment
- [x] File Upload Box Component
- [x] Basic Stats Overview on Dashboard

---

## 🛠️ Implemented Tools

### 🟢 Data Tools

- [x] 👥 **Followers Tool**
  - Upload `followers_1.json`
  - Track upload batches
  - Show added, removed, total, % change
- [x] 👣 **Following Tool**
  - Upload `following.json`
  - Same functionality as Followers
- [x] ❌ **Non-Followers Tool**
  - Compare followers vs following
  - Fully client-side
- [x] 📩 **Pending Requests Tool**
  - Upload `pending_follow_requests.json`
  - Show accounts you sent requests to
- [x] 🧹 **Clear DB Tool**
  - Allows user to delete specific datasets from DB

---

## 🧪 Upcoming Tools

These tools are planned but not yet implemented.

- [ ] 🧠 **Close Friends Tool**
  - Parse `close_friends.json`
  - List users in your close friends circle
- [ ] 🤝 **Follow Requests Received Tool**
  - Parse `follow_requests_you've_received.json`
  - List accounts who requested to follow you
- [ ] 🕐 **Recent Follow Requests Tool**
  - Parse `recent_follow_requests.json`
  - Track follow requests you’ve sent recently
- [ ] ❌ **Recently Unfollowed Tool**
  - Parse `recently_unfollowed_profiles.json`
  - Show who you've unfollowed recently

---

## 📊 Dashboard Enhancements

- [x] Show current stats (followers, following, unfollowers)
- [ ] Extend stats to include:
  - [ ] Close Friends Count
  - [ ] Requests Received
  - [ ] Recent Requests Sent
  - [ ] Recently Unfollowed

---

## ⚙️ Developer Notes

- Prisma Schema fully updated ✅
- All file parsing follows Instagram export format
- JWT session includes user ID ✅
- App uses App Router and React Server Components ✅

---

## 📦 Deployment Notes

- Add this to your `package.json` to fix Prisma/Vercel:
  ```json
  "scripts": {
    "build": "prisma generate && next build"
  }
  ```
- Ensure `.env` has:
  ```env
  DATABASE_URL=postgresql://...
  NEXTAUTH_SECRET=your_secret_key
  ```

---

## 📝 Docs

- Architecture Diagrams: (TODO)
- Component Library Guide: (TODO)
- API Route Reference: (TODO)

---

**Last updated:** 2025-08-02
