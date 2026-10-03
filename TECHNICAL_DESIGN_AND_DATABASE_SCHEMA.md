# MASTER TECHNICAL DESIGN DOCUMENT & DATABASE SPECIFICATION
## Connect CRM: Dual-Portal Social Media Operations & Client Collaboration Platform

---

**Document Version:** 1.0 (Master Architecture & Engineering Blueprint)  
**Target Audience:** Technical Team Lead, Senior Developers, DevOps, Project Stakeholders  
**Author:** Tushar & The Engineering Team  
**Date:** September 2026  
**Document Classification:** Internal Technical Reference — Foundation for Phase 1 Implementation & Future Extensions  

---

## 1. Architectural Topology & System Overview

Connect CRM is built as a unified Next.js 15 enterprise web application utilizing the **App Router**, **PostgreSQL** relational database, **Prisma ORM**, and **AWS S3 / CloudFront** cloud storage infrastructure.

### 1.1. Dual-Portal Topology
The application separates internal agency operations from external client interactions using Next.js Route Groups and Middleware-level RBAC:

```
[Incoming HTTP Request: *.zkconnect.io]
                    |
                    v
    [Next.js Middleware (auth.ts)]
     - Reads JWT session token
     - Checks user_role (AGENCY_ADMIN, STRATEGIST, DESIGNER, CLIENT_REVIEWER)
     - Validates tenant_id & client_id isolation
                    |
        +-----------+-----------+
        |                       |
        v                       v
[/(agency) Route Group]    [/(client) Route Group]
(agency.zkconnect.io)      (client.zkconnect.io or {slug}.zkconnect.io)
- Admin Command Center     - Dedicated Client Review Portal
- Client & Quota Manager   - Read/Preview Own Monthly Calendar
- Native Calendar Builder  - Built-in S3 Video & Carousel Player
- Team Workload Dashboard  - Item-Level Change Suggestions
- "My Tasks" Team Board    - 1-Click Approval Locking
- "Preview as Client" Mode - ZERO visibility into internal stats
```

---

## 2. Complete Database Schema (Prisma Schema Specification)

Below is the complete, production-ready `schema.prisma` definition. It models all Phase 1 multi-tenant operations, team workload tracking, daily calendar scheduling, S3 media management, and includes pre-architected fields for seamless Phase 2 Meta Graph API connectivity without requiring disruptive migrations later.

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// -------------------------------------------------------------
// ENUMS
// -------------------------------------------------------------

enum UserRole {
  AGENCY_ADMIN       // Agency Super Admin / Management
  TEAM_LEAD          // Project Manager / Operations Lead
  STRATEGIST         // Content Strategist / Planner
  COPYWRITER         // Caption & Script Writer
  GRAPHIC_DESIGNER   // Creative Designer
  VIDEO_EDITOR       // Reel / Video Editor
  SOCIAL_MEDIA_MGR   // Publishing & Execution Manager
  CLIENT_ADMIN       // Client Head (Kohinoor, Nelson, etc.)
  CLIENT_REVIEWER    // Client Staff (Review & Suggest only)
}

enum CalendarStatus {
  PLANNING           // Internal team mapping pillars & slots
  INTERNAL_REVIEW    // Team Lead reviewing copy & designs
  SHARED_WITH_CLIENT // Active on Client Portal for review
  PARTIALLY_APPROVED // Some posts approved, others need tweaks
  APPROVED           // 100% approved by client
  LOCKED             // Completed & archived
}

enum ItemStatus {
  DRAFT              // Slot created, copy/design in progress
  INTERNAL_QA        // Creative uploaded, awaiting Lead QA
  READY_FOR_CLIENT   // Submitted to client portal
  REVISION_REQUESTED // Client requested change/suggestion
  APPROVED           // Client approved this post
  PUBLISHED          // Posted live to social account
}

enum MediaFormat {
  IMAGE              // Static single creative
  CAROUSEL           // Multi-slide swipeable post
  REEL               // Short vertical video (9:16)
  STORY              // Daily story / ephemeral graphic
}

enum TaskStatus {
  TO_DO              // Assigned, not started
  IN_PROGRESS        // Designer/Editor currently working
  QA_READY           // Uploaded, waiting for Lead sign-off
  DONE               // Approved internally
}

enum ActivityAction {
  CREATED            // Post slot initialized
  CONTENT_UPDATED    // Copy or visual brief edited
  MEDIA_UPLOADED     // Asset uploaded to S3
  CLIENT_SUGGESTION  // Client requested revision
  REVISION_RESOLVED  // Team resolved suggestion
  APPROVED           // Client approved item
  SCHEDULED          // Queued for dispatch
  STATUS_CHANGE      // Manual status transition
}

// -------------------------------------------------------------
// MODELS
// -------------------------------------------------------------

/// The root Agency organization (Tenant)
model Organization {
  id              String         @id @default(uuid())
  name            String         // e.g. "ZK Agency"
  slug            String         @unique // "zkagency"
  logoUrl         String?
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  users           User[]
  clients         Client[]

  @@map("organizations")
}

/// Client Profiles (Nelson Luxe, Kohinoor TEZ, Neuro, etc.)
model Client {
  id              String         @id @default(uuid())
  organizationId  String
  organization    Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)

  brandName       String         // e.g. "Nelson Luxe Hospital"
  code            String         // e.g. "NELSON"
  slug            String         @unique // "nelson"
  logoUrl         String?
  primaryColor    String?        @default("#1E3A8A")
  industry        String?        // e.g. "Healthcare", "Education"
  isActive        Boolean        @default(true)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  // Relationships
  users           User[]         // Client users belonging to this client
  calendars       MonthlyCalendar[]
  quotas          ClientQuota[]
  socialAccounts  SocialAccount[]// Phase 2 Meta integration

  @@index([organizationId])
  @@map("clients")
}

/// System Users (Agency Staff and Client Users)
model User {
  id              String         @id @default(uuid())
  organizationId  String
  organization    Organization   @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  
  clientId        String?        // Populated only for CLIENT roles
  client          Client?        @relation(fields: [clientId], references: [id], onDelete: SetNull)

  email           String         @unique
  passwordHash    String
  fullName        String
  avatarUrl       String?
  phone           String?
  role            UserRole       @default(CLIENT_REVIEWER)
  isActive        Boolean        @default(true)
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  // Relationships
  assignedTasks   TeamAssignment[]
  activities      ItemActivity[]
  approvedItems   CalendarItem[] @relation("ApprovedByUser")

  @@index([organizationId])
  @@index([clientId])
  @@map("users")
}

/// Monthly Contract Deliverable Quotas & Requirements
model ClientQuota {
  id                 String     @id @default(uuid())
  clientId           String
  client             Client     @relation(fields: [clientId], references: [id], onDelete: Cascade)

  targetCreatives    Int        @default(15) // e.g. 15 or 30 creatives
  targetReels        Int        @default(10) // e.g. 10 or 20 reels
  targetStories      Int        @default(30) // e.g. 30 stories
  targetSpecialCredits Int      @default(0)  // Special campaign budget
  specialNotes       String?    @db.Text    // Monthly brief from client

  effectiveMonth     Int        // 1 - 12
  effectiveYear      Int        // e.g. 2026
  createdAt          DateTime   @default(now())
  updatedAt          DateTime   @updatedAt

  @@unique([clientId, effectiveMonth, effectiveYear])
  @@map("client_quotas")
}

/// Monthly Calendar Container
model MonthlyCalendar {
  id              String         @id @default(uuid())
  clientId        String
  client          Client         @relation(fields: [clientId], references: [id], onDelete: Cascade)

  month           Int            // 10 for October
  year            Int            // 2026
  title           String         // "October 2026 Content Calendar"
  status          CalendarStatus @default(PLANNING)
  
  // Deliverable Tracking Snapshot
  targetCreatives Int            @default(0)
  targetReels     Int            @default(0)
  targetStories   Int            @default(0)

  sharedAt        DateTime?      // When submitted to client portal
  approvedAt      DateTime?      // When 100% approved by client
  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  items           CalendarItem[]

  @@unique([clientId, month, year])
  @@index([clientId])
  @@map("monthly_calendars")
}

/// Day-by-Day Calendar Content Item
model CalendarItem {
  id                String         @id @default(uuid())
  calendarId        String
  calendar          MonthlyCalendar @relation(fields: [calendarId], references: [id], onDelete: Cascade)

  srNo              Int            // 1, 2, 3...
  scheduledDate     DateTime       // Target publish date
  dayOfWeek         String         // Monday, Tuesday...
  specialDay        String?        // Gandhi Jayanti, Air Force Day, etc.
  contentPillar     String         // Doctor Branding, Study Tips, Trust, etc.
  topic             String?        // Post Topic / Hook title
  format            MediaFormat    @default(IMAGE)
  
  // Creative & Copywriting Attributes
  visualBrief       String?        @db.Text // Visual direction for designer
  reelBytesScript   String?        @db.Text // Slide 1-5 or Hook-Body-CTA script
  caption           String?        @db.Text // Final caption
  hashtags          String?        @db.Text // Targeted hashtags
  
  // Workflow & Client Approval
  status            ItemStatus     @default(DRAFT)
  approvedAt        DateTime?
  approvedById      String?
  approvedBy        User?          @relation("ApprovedByUser", fields: [approvedById], references: [id], onDelete: SetNull)

  // Live Publishing Feedback (Phase 1 manual / Phase 2 automated)
  isPublished       Boolean        @default(false)
  publishedAt       DateTime?
  livePostUrl       String?        // Instagram/FB live post permalink
  igMediaId         String?        // Meta Graph API Media ID (Phase 2)

  createdAt         DateTime       @default(now())
  updatedAt         DateTime       @updatedAt

  // Relationships
  mediaAssets       MediaAsset[]
  assignments       TeamAssignment[]
  activities        ItemActivity[]

  @@index([calendarId, scheduledDate])
  @@index([status])
  @@map("calendar_items")
}

/// Media Assets uploaded to AWS S3 (Images, Carousels, Video Reels)
model MediaAsset {
  id              String         @id @default(uuid())
  itemId          String
  item            CalendarItem   @relation(fields: [itemId], references: [id], onDelete: Cascade)

  s3Bucket        String         // AWS S3 Bucket Name
  s3Key           String         // Object path: clients/{clientId}/{year}/{month}/{itemId}/{file}
  fileName        String         // Original file name
  mimeType        String         // video/mp4, image/png, image/jpeg
  fileSizeBytes   Int
  
  // Carousel ordering & Video metadata
  slideOrder      Int?           @default(1) // 1, 2, 3 for carousel slides
  durationSec     Float?         // Reel video length in seconds
  aspectRatio     String?        @default("1:1") // "9:16" for Reels, "1:1" for posts
  thumbnailS3Key  String?        // Generated video cover frame

  createdAt       DateTime       @default(now())

  @@index([itemId])
  @@map("media_assets")
}

/// Internal Team Task Tracking (Workload & "My Tasks")
model TeamAssignment {
  id              String         @id @default(uuid())
  itemId          String
  item            CalendarItem   @relation(fields: [itemId], references: [id], onDelete: Cascade)

  userId          String         // Internal team member (Designer, Editor, Copywriter)
  user            User           @relation(fields: [userId], references: [id], onDelete: Cascade)

  role            UserRole       // Role in this task
  taskStatus      TaskStatus     @default(TO_DO)
  dueDate         DateTime?
  completedAt     DateTime?
  notes           String?

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@unique([itemId, userId, role])
  @@index([userId, taskStatus])
  @@map("team_assignments")
}

/// Activity Log, Client Suggestions & Revisions Audit Trail
model ItemActivity {
  id              String         @id @default(uuid())
  itemId          String
  item            CalendarItem   @relation(fields: [itemId], references: [id], onDelete: Cascade)

  authorId        String
  author          User           @relation(fields: [authorId], references: [id], onDelete: Cascade)

  action          ActivityAction
  commentText     String?        @db.Text // Client change suggestion or internal note
  isClientFacing  Boolean        @default(true) // False = internal agency comment only

  createdAt       DateTime       @default(now())

  @@index([itemId, createdAt])
  @@map("item_activities")
}

/// Social Accounts (Pre-built for Phase 2 Meta API Integration)
model SocialAccount {
  id              String         @id @default(uuid())
  clientId        String
  client          Client         @relation(fields: [clientId], references: [id], onDelete: Cascade)

  platform        String         // "INSTAGRAM", "FACEBOOK"
  accountName     String         // e.g. "Nelson Hospital Official"
  pageId          String?        // Facebook Page ID
  igUserId        String?        // Instagram Business Account ID
  accessTokenEnc  String?        @db.Text // AES-256 Encrypted Long-Lived Token
  tokenExpiresAt  DateTime?
  isActive        Boolean        @default(true)

  createdAt       DateTime       @default(now())
  updatedAt       DateTime       @updatedAt

  @@unique([clientId, platform])
  @@map("social_accounts")
}
```

---

## 3. AWS S3 Storage Architecture & Presigned Flow

### 3.1. S3 Directory Key Strategy
To ensure security, tenant isolation, and rapid lookups, object keys in the AWS S3 bucket follow this strict hierarchical scheme:

```
s3://{AWS_S3_BUCKET_NAME}/
  └── organizations/
       └── {organization_id}/
            └── clients/
                 └── {client_id}/
                      └── {year}/
                           └── {month}/
                                └── {calendar_item_id}/
                                     ├── v1_master.mp4       <-- 4K Reel Video
                                     ├── v1_thumb.jpg        <-- Video Poster Frame
                                     ├── v1_slide_01.png     <-- Carousel Slide 1
                                     ├── v1_slide_02.png     <-- Carousel Slide 2
                                     └── v1_slide_03.png     <-- Carousel Slide 3
```

### 3.2. S3 Direct Upload Flow (Presigned PUT)
1. **Request:** Graphic Designer or Video Editor selects a file (e.g. `reel_edit.mp4`, 250MB) inside the CRM card.
2. **Authorize:** Browser calls server action `getS3UploadUrl(itemId, fileName, mimeType)`.
3. **Generate:** Backend checks user session and generates an AWS S3 `PutObjectCommand` presigned URL with an expiry of 15 minutes.
4. **Upload:** Browser executes direct HTTP `PUT` to AWS S3 with multipart headers.
5. **Confirm:** On completion, browser calls `confirmMediaUpload(itemId, s3Key, fileSizeBytes)`. Database record is inserted in `MediaAsset`.

### 3.3. S3 Client Streaming Flow (Presigned GET + CloudFront)
1. **Request:** Client opens their calendar on `client.zkconnect.io`.
2. **Authorize:** Backend verifies client authentication and validates that the requested `calendar_id` matches the client's `clientId`.
3. **Signed Stream:** Backend returns a CloudFront signed URL (or S3 `GetObjectCommand` presigned URL) with a **2-hour TTL**.
4. **Instant Playback:** Custom HTML5 video player requests the stream using HTTP Range Requests (`bytes=0-1048576`). Video plays instantly on mobile browsers with zero buffering and smooth scrubbing.

### 3.4. AWS S3 Bucket CORS Configuration
```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "PUT", "HEAD"],
    "AllowedOrigins": [
      "https://agency.zkconnect.io",
      "https://client.zkconnect.io",
      "http://localhost:3000"
    ],
    "ExposeHeaders": ["ETag", "Content-Range", "Accept-Ranges"],
    "MaxAgeSeconds": 3600
  }
]
```

---

## 4. API & Server Action Contracts

### 4.1. Client & Calendar Management Actions

#### `createClient(data: CreateClientDTO)`
- **Input:** `{ brandName: string, code: string, slug: string, primaryColor?: string, targetCreatives: number, targetReels: number, targetStories: number }`
- **Output:** `{ success: boolean, client: Client }`
- **Permission:** `AGENCY_ADMIN` only.

#### `createMonthlyCalendar(clientId: string, month: number, year: number)`
- **Input:** `{ clientId: "uuid", month: 10, year: 2026 }`
- **Output:** `{ success: boolean, calendarId: "uuid", itemCount: 31 }`
- **Logic:**
  1. Checks if calendar for `(clientId, month, year)` already exists.
  2. Copies target quotas from active `ClientQuota` for that client.
  3. Computes days in the month (e.g. 31 for October).
  4. Generates empty daily slots (`srNo: 1 to 31`, `status: DRAFT`).

#### `updateCalendarItem(itemId: string, data: UpdateItemDTO)`
- **Input:** `{ specialDay?: string, contentPillar?: string, topic?: string, format?: MediaFormat, visualBrief?: string, reelBytesScript?: string, caption?: string, hashtags?: string }`
- **Output:** `{ success: boolean, item: CalendarItem }`
- **Permission:** Agency Team members assigned to the client.

---

### 4.2. Team Workload & Task Management Actions

#### `getAdminTeamWorkload(month: number, year: number)`
- **Input:** `{ month: 10, year: 2026 }`
- **Output:**
```typescript
interface TeamWorkloadReport {
  teamMembers: {
    userId: string;
    fullName: string;
    role: UserRole;
    avatarUrl: string;
    totalAssigned: number;
    completed: number;
    inProgress: number;
    completionPercentage: number;
    status: "ON_TRACK" | "AT_RISK";
  }[];
  totalAgencyDeliverables: {
    creativesTotal: number;
    creativesCompleted: number;
    reelsTotal: number;
    reelsCompleted: number;
  };
}
```

#### `getMyTasks(month: number, year: number)`
- **Input:** `{ month: 10, year: 2026 }` (User ID inferred from session)
- **Output:**
```typescript
interface MyTasksResponse {
  tasks: {
    assignmentId: string;
    calendarItemId: string;
    clientName: string;
    clientLogo: string;
    scheduledDate: string;
    format: MediaFormat;
    topic: string;
    visualBrief: string;
    taskStatus: TaskStatus;
    mediaCount: number;
  }[];
}
```

---

### 4.3. Client Portal Review & Approval Actions

#### `submitPostSuggestion(itemId: string, suggestionText: string)`
- **Input:** `{ itemId: "uuid", suggestionText: "Please change the doctor's qualification to MD Pediatrics" }`
- **Logic:**
  1. Updates `CalendarItem.status = REVISION_REQUESTED`.
  2. Inserts record into `ItemActivity` with `action = CLIENT_SUGGESTION`.
  3. Sends automated email / WhatsApp notification to assigned designer & team lead.
- **Output:** `{ success: boolean, activityId: "uuid" }`

#### `approveCalendarItem(itemId: string)`
- **Input:** `{ itemId: "uuid" }`
- **Logic:**
  1. Sets `CalendarItem.status = APPROVED`.
  2. Sets `CalendarItem.approvedAt = now()`.
  3. Sets `CalendarItem.approvedById = session.userId`.
  4. Inserts record into `ItemActivity` with `action = APPROVED`.
  5. Recalculates `ClientQuota` progress meter.
- **Output:** `{ success: boolean, approvedAt: string }`

---

## 5. Next.js 15 File & Folder Architecture

```
zkconnect/
├── prisma/
│   └── schema.prisma                  <-- Master Prisma schema
├── public/
│   ├── branding/
│   └── icons/
├── src/
│   ├── app/
│   │   ├── (agency)/                  <-- Agency Route Group
│   │   │   ├── layout.tsx             <-- Agency Shell (Sidebar, Workload Header)
│   │   │   ├── dashboard/             <-- Agency Command Center
│   │   │   ├── clients/
│   │   │   │   ├── page.tsx           <-- Clients List & Quotas
│   │   │   │   └── [clientId]/
│   │   │   │       ├── page.tsx       <-- Client Detail & Calendars
│   │   │   │       └── calendar/
│   │   │   │           └── [calendarId]/
│   │   │   │               ├── grid/  <-- Monthly Grid View
│   │   │   │               ├── table/ <-- Production Excel-like Table View
│   │   │   │               └── kanban/<-- Kanban Workflow Pipeline
│   │   │   ├── team/
│   │   │   │   ├── workload/          <-- Team Workload & Productivity Dashboard
│   │   │   │   └── my-tasks/          <-- Personal "My Tasks" Board
│   │   │   └── preview/
│   │   │       └── [calendarId]/page.tsx <-- "Preview as Client" Simulator Mode
│   │   │
│   │   ├── (client)/                  <-- Client Route Group
│   │   │   ├── layout.tsx             <-- Branded Client Shell (Clean, no internal stats)
│   │   │   └── portal/
│   │   │       ├── page.tsx           <-- Client Calendar Overview
│   │   │       └── post/
│   │   │           └── [itemId]/page.tsx <-- Single Post Review, S3 Player & Suggestions
│   │   │
│   │   ├── api/
│   │   │   ├── auth/                  <-- NextAuth / Auth.js endpoints
│   │   │   └── media/
│   │   │       ├── presigned-upload/  <-- Generates S3 PUT URLs
│   │   │       └── presigned-stream/  <-- Generates S3 GET URLs
│   │   └── layout.tsx
│   │
│   ├── components/
│   │   ├── agency/
│   │   │   ├── CalendarGrid.tsx       <-- Monthly interactive calendar
│   │   │   ├── CalendarTable.tsx      <-- TanStack Table with inline edits
│   │   │   ├── WorkloadProgress.tsx   <-- Team productivity meter
│   │   │   └── ItemDrawer.tsx         <-- Slide-out post builder
│   │   ├── client/
│   │   │   ├── ClientCalendarView.tsx <-- Clean client calendar
│   │   │   ├── S3VideoPlayer.tsx      <-- Custom HTML5 Video Player for Reels
│   │   │   ├── CarouselSlider.tsx     <-- Swiper.js multi-slide viewer
│   │   │   └── SuggestionModal.tsx    <-- Item revision request modal
│   │   └── ui/                        <-- Shadcn UI component primitives
│   │
│   ├── lib/
│   │   ├── db.ts                      <-- Prisma Client singleton
│   │   ├── s3.ts                      <-- AWS S3 SDK & Presigned URL helpers
│   │   ├── auth.ts                    <-- Auth configuration & RBAC guards
│   │   └── notifications.ts           <-- Resend Email & WhatsApp webhook dispatcher
│   │
│   └── actions/                       <-- Server Actions
│       ├── clientActions.ts
│       ├── calendarActions.ts
│       ├── mediaActions.ts
│       ├── workloadActions.ts
│       └── approvalActions.ts
│
├── .env.example
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 6. Environment Configuration (`.env.example`)

```env
# -----------------------------------------------------------------
# DATABASE (PostgreSQL)
# -----------------------------------------------------------------
DATABASE_URL="postgresql://postgres:password@localhost:5432/zkconnect?schema=public"

# -----------------------------------------------------------------
# AUTHENTICATION (Auth.js / NextAuth)
# -----------------------------------------------------------------
AUTH_SECRET="generate-a-strong-32-byte-hex-secret"
NEXTAUTH_URL="https://agency.zkconnect.io"

# -----------------------------------------------------------------
# AWS S3 STORAGE & CLOUDFRONT CDN
# -----------------------------------------------------------------
AWS_REGION="ap-south-1"
AWS_ACCESS_KEY_ID="AKIAxxxxxxxxxxxxxxxx"
AWS_SECRET_ACCESS_KEY="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
AWS_S3_BUCKET_NAME="zkconnect-media-vault"
CLOUDFRONT_DISTRIBUTION_DOMAIN="cdn.zkconnect.io"

# -----------------------------------------------------------------
# NOTIFICATIONS (Email & WhatsApp)
# -----------------------------------------------------------------
RESEND_API_KEY="re_xxxxxxxxxxxxxxxxxxxxxxxx"
NOTIFICATION_FROM_EMAIL="approvals@zkconnect.io"
WHATSAPP_API_TOKEN="xxxxxxxxxxxxxxxxxxxxxxxx"
WHATSAPP_PHONE_NUMBER_ID="xxxxxxxxxxxxxxx"
```

---

## 7. Future-Proofing for Phase 2 (Meta APIs Integration)

This Technical Design Document explicitly ensures that **Phase 1 architecture requires ZERO refactoring when Phase 2 is launched**:
1. **Schema Pre-configuration:** The `SocialAccount` model and `CalendarItem.igMediaId` / `livePostUrl` fields are already defined in the schema.
2. **S3 Direct Binary Streaming:** Meta Graph API requires direct HTTPS downloadable URLs for video containers (`POST /{ig_user_id}/media?media_type=REELS&video_url=...`). Because our S3 bucket already generates clean signed URLs, Phase 2 can pipe these exact URLs straight into Meta Graph API endpoints without re-encoding.
3. **Approval State Gate:** Phase 2 publishing buttons will simply query `CalendarItem.status === APPROVED`. When approved, the system unlocks the "Publish Now" button.
