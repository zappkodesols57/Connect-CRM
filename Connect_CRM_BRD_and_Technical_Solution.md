# BUSINESS REQUIREMENTS DOCUMENT (BRD) & TECHNICAL SOLUTION ARCHITECTURE
## Connect CRM (Phase 1): Multi-Tenant Social Media Operations, Team Productivity & Client Collaboration Platform

---

**Project Name:** Connect CRM — Phase 1  
**Document Version:** 2.0 (Phase 1 Focused — Executive & Engineering Edition)  
**Target Stakeholders:** Chief Executive Officer (CEO), Technical Team Lead, Project Manager, Creative & Social Media Teams  
**Author:** Tushar & The Engineering Team  
**Date:** September 2026  
**Document Classification:** Confidential — Internal & Executive Use  

---

## 1. Executive Summary

Our agency manages end-to-end social media operations for premier clients including **Kohinoor TEZ, Nelson Luxe Hospital, Central Brain & Spine Hospital (Neuro), Vibetara, and Zappkode Solutions**. Currently, our internal workflows rely on static spreadsheets (`Oct Calender 2026.xlsx`), manual Google Drive links, and unstructured WhatsApp/email threads.

While spreadsheets enabled early growth, they create three critical operational bottlenecks at scale:
1. **The Google Drive Access Barrier:** High-value corporate clients frequently encounter "Access Denied" errors, require personal Google accounts, and suffer slow mobile video buffering for 4K Reels.
2. **Lack of Internal Team Workload Visibility:** Management and Team Leads lack real-time visibility into internal team output (e.g., how many reels or creatives each editor/designer has completed vs. pending across all clients).
3. **Manual Approval Friction:** Delays in client sign-offs across WhatsApp chats result in missed festival dates and rushed, stressed revisions.

### Project Scope: Connect CRM (Phase 1)
**Phase 1** delivers the foundational operations and client collaboration suite under a **Dual-Portal Architecture**:
- **Main Agency CRM Portal (`agency.zkconnect.io`):** An internal command center where agency admins configure clients, create monthly calendars natively, allocate contract quotas, monitor team member workload/productivity, and simulate the client experience via "Preview as Client" mode.
- **Dedicated Client Portal (`client.zkconnect.io`):** A secure, branded self-service environment (e.g., `nelson.zkconnect.io`, `kohinoor.zkconnect.io`) where clients view their calendar, stream high-res video reels without Google Drive friction, suggest item-specific revisions, and approve posts with 1 click.

---

## 2. Business Objectives & Success KPIs (Phase 1)

| Business Objective | Baseline (Current State) | Phase 1 Target Metric | Strategic Business Impact |
| :--- | :--- | :--- | :--- |
| **Client Review Turnaround** | 4 to 6 business days (WhatsApp/calls) | **Under 24 hours** (1-Click in-portal approval) | Eliminates delayed festival campaigns and rushed revisions. |
| **Media Access Complaints** | 10–15 tickets/complaints weekly on Drive links | **Zero (0) Complaints** (S3 presigned streaming) | Removes client friction and elevates brand professionalism. |
| **Monthly Quota Delivery** | High risk of late deliverables at month-end | **100% On-Time Completion** via live Quota Dashboard | Protects monthly retainer revenue and contractual compliance. |
| **Team Capacity Balancing** | Unmeasured; ad-hoc WhatsApp status updates | **Real-Time Workload Transparency** across all staff | Prevents creative burnout and eliminates idle bandwidth. |

---

## 3. Dual-Portal Scope & User Personas

```
+--------------------------------------------------------------------------------------------------------+
|                                    CONNECT CRM USER ECOSYSTEM                                          |
+--------------------------------------------------------------------------------------------------------+
                                                     |
         +-------------------------------------------+-------------------------------------------+
         |                                                                                       |
         v                                                                                       v
+-------------------------------------------------------+       +-------------------------------------------------------+
|              MAIN AGENCY CRM PORTAL                   |       |                 CLIENT PORTAL                         |
+-------------------------------------------------------+       +-------------------------------------------------------+
| 1. CEO & Executive Management:                        |       | 1. Client Marketing Head / Director:                  |
|    - High-level client retention & SLA fulfillment    |       |    - Dedicated branded login (isolated to company)    |
|    - Agency-wide team output and capacity metrics     |       |    - Reviews full month calendar in Grid or List view |
|                                                       |       |                                                       |
| 2. Team Lead & Project Manager:                       |       | 2. Client Brand Reviewer / Approver:                  |
|    - Client onboarding & contract quota definition    |       |    - Streams 4K Reels & Carousels (Zero Drive login)  |
|    - 1-Click "Create Calendar" (Month & Year)         |       |    - Leaves item-specific suggestions / revisions     |
|    - Team Workload Dashboard (Task tracking)          |       |    - 1-Click "Approve" (Locks post with audit stamp)  |
|    - "Preview as Client" pre-dispatch QA              |       |    - Views monthly quota completion (e.g. 15/15 done) |
|                                                       |       |                                                       |
| 3. Internal Creative & Operations Team:               |       |                                                       |
|    - Content Strategist: Content pillars & hooks      |       |                                                       |
|    - Copywriter: Reel Bytes (Hook/Body/CTA) & captions|       |                                                       |
|    - Graphic Designer: Uploads PNGs directly to S3    |       |                                                       |
|    - Video Editor: Uploads 4K MP4 Reels to S3         |       |                                                       |
|    - Social Media Manager: Task execution & publishing|       |                                                       |
+-------------------------------------------------------+       +-------------------------------------------------------+
```

---

## 4. Phase 1 Business Requirements Specification (BRS)

### Category A: Core Multi-Tenancy & Dual-Portal Architecture
* **BR-01 (Dual-Portal Separation):** The platform MUST enforce strict route and data isolation between the internal agency management application (`agency.zkconnect.io`) and individual client review portals (`client.zkconnect.io` or `{client-slug}.zkconnect.io`).
* **BR-02 (Role-Based Access Control - RBAC):** The system MUST support granular permission roles:
  * *Agency Admin / Team Lead:* Full system access, client creation, calendar creation, team assignments, workload tracking.
  * *Internal Team Members:* Access to assigned client tasks, visual briefs, and direct S3 file uploads.
  * *Client Reviewer:* Read, preview, comment/suggest, and approve access restricted strictly to their own brand's calendar. Zero access to internal team stats or other clients.

### Category B: Client Setup & Contract Quota Engine
* **BR-03 (Client Profile Management):** Admins MUST be able to create new clients (e.g. Nelson Luxe Hospital, Kohinoor TEZ) with brand logos, primary brand colors, and account contacts.
* **BR-04 (Monthly Quota & Requirement Setup):** Admins MUST configure contracted deliverables per month (e.g. 15–30 Creatives, 10–20 Reels, 30 Stories) and attach monthly special requirement briefs.
* **BR-05 (Dynamic Target Meter):** The system MUST calculate real-time percentage completion for each deliverable category and display live progress bars on both the Agency Command Dashboard and Client Portal.

### Category C: Native In-CRM Calendar Creation & Scheduling
* **BR-06 (1-Click Calendar Generation):** Inside any client profile, the agency team MUST be able to click "Create Calendar", select the target Month & Year (e.g. October 2026), and automatically initialize a full 30/31-day scheduling grid.
* **BR-07 (Day-by-Day Post Builder):** For every scheduled date, the team MUST be able to specify:
  * Serial Number, Date, Day of Week.
  * Special Day / Festival (e.g., Gandhi Jayanti, Indian Air Force Day, Breast Cancer Awareness).
  * Strategic Content Pillar (e.g., Doctor Branding, Student Tips, Promotional Offers, Educational).
  * Media Format (`IMAGE`, `Carousel Post`, `REEL`, `Story`).
  * Visual Direction / Creative Brief.
  * Copywriting Script / Reel Bytes (Slide 1–5 breakdown or Hook-Body-CTA structure).
  * Final Caption, Call to Action (CTA), and Hashtags.
* **BR-08 (Multi-View Interface):** The calendar MUST be viewable in three synchronized modes:
  * *Monthly Visual Grid View:* High-level overview of daily slots and status indicators.
  * *Production Data Table View:* Dense view with inline editing for rapid copywriting.
  * *Kanban Pipeline Board:* Visual cards organized by workflow stage.

### Category D: Internal Team Workload & Task Management
* **BR-09 (Admin Team Workload Dashboard):** Team Leads MUST have a dedicated view tracking the productivity of each internal team member across all clients for the active month (e.g. Total Tasks Assigned, Completed, In Progress, and Completion Rate %).
* **BR-10 (Team Member "My Tasks" Board):** Individual team members (Copywriters, Graphic Designers, Video Editors) MUST have a personalized task board aggregating all their assignments across all clients, with direct status toggling (`To Do`, `In Progress`, `QA Ready`, `Done`).
* **BR-11 (Workload Balancing Alerts):** The system MUST trigger visual alerts (Yellow/Amber) when an internal team member is lagging behind schedule mid-month, enabling workload redistribution.

### Category E: AWS S3 Media Pipeline (Eliminating Google Drive)
* **BR-12 (Direct Browser-to-S3 Upload):** Creative staff MUST be able to drag-and-drop high-resolution images and 4K MP4/MOV video reels directly from their browser into S3 via presigned URLs without routing files through the application server.
* **BR-13 (Zero-Login Media Streaming):** Clients MUST be able to stream video reels and view high-resolution creatives instantly inside the portal without requiring Google accounts or third-party storage logins.
* **BR-14 (Rich In-Portal Media Player):** The portal MUST feature:
  * A custom HTML5 video player with frame-by-frame scrubbing and volume controls for Reels.
  * An interactive swipeable carousel slider for multi-slide posts (e.g. 5-slide medical awareness decks).
  * A high-resolution image lightbox for static creatives.

### Category F: Quality Assurance, Client Suggestions & Approvals
* **BR-15 ("Preview as Client" Simulator):** Agency Team Leads MUST have a 1-click toggle to view the calendar exactly as the client will experience it before submitting it to the client portal.
* **BR-16 (Item-Specific Client Suggestions):** Clients MUST be able to open any specific post and submit change requests (e.g., text corrections, image updates), which automatically create revision tickets assigned to the creative staff.
* **BR-17 (1-Click Approval & Audit Locking):** Clients MUST be able to approve individual posts or the entire calendar with a single click. Approved posts MUST be locked from further edits and stamped with a digital approval audit record (User, Timestamp, Version).
* **BR-18 (Automated Event Notifications):** The system MUST dispatch automated email and WhatsApp alerts upon calendar submission, client revision requests, and final approvals.

---

## 5. Phase 1 Technical Architecture & Tech Stack

### 5.1. Tech Stack Matrix

| Architectural Layer | Technology Selected | Technical Rationale & Business Justification |
| :--- | :--- | :--- |
| **Frontend Framework** | **Next.js 15 (React 19, TypeScript)** | Unified full-stack framework with Server-Side Rendering (SSR) for fast loading, App Router for clean portal routing, and static generation. |
| **Styling & UI Components** | **Tailwind CSS + Shadcn UI** | High-performance, fully accessible, modern B2B component library. Ensures responsive mobile experiences for busy client executives. |
| **Interactive Components** | **Swiper.js + Custom HTML5 Video Player** | Native touch-swipe support for multi-slide carousels; lightweight video player with instant frame scrubbing for 4K Reels. |
| **Backend & API Layer** | **Next.js Server Actions + REST API** | Type-safe end-to-end communication between frontend and database; eliminates redundant API boilerplate and accelerates development. |
| **Database & ORM** | **PostgreSQL + Prisma ORM** | Enterprise relational database with ACID compliance, JSONB support for variable slide decks, and type-safe query generation. |
| **Cloud Storage & Streaming** | **AWS S3 + CloudFront CDN** | Direct multipart presigned uploads bypassing the backend server; global edge caching and byte-range video streaming solving Google Drive friction. |
| **Authentication & RBAC** | **Auth.js (NextAuth) with JWT** | Multi-tenant session isolation, encrypted cookies, role-based middleware, and custom domain mapping. |
| **Notification Engine** | **Resend (Email) + WhatsApp Business Webhooks** | High-deliverability transactional emails and instant WhatsApp approval alerts. |

---

### 5.2. Phase 1 System Architecture Diagram

```
+----------------------------------------------------------------------------------------------------+
|                                      CLIENT BROWSER / MOBILE DEVICE                                |
|  [client.zkconnect.io]                                                                             |
|  - Branded Client Portal                                                                           |
|  - S3 Video Streaming & Carousel Slider                                                            |
|  - Item-Level Feedback & 1-Click Approval                                                          |
+----------------------------------------------------------------------------------------------------+
                                      |                     ^
                                      | 1. HTTPS Requests   | 4. CloudFront Edge Streaming (H.264/MP4)
                                      v                     |
+----------------------------------------------------------------------------------------------------+
|                                    AWS CLOUDFRONT CDN (Global Edge Delivery)                       |
+----------------------------------------------------------------------------------------------------+
                                      ^                     ^
                                      |                     |
                                      | 3. Presigned GET    | 2. Direct Presigned PUT Upload
                                      v                     |
+------------------------------------------------------------------+   +-----------------------------+
|                     AWS S3 BUCKET (Private)                      |   |     AGENCY TEAM BROWSER     |
|  Key: /clients/{client_id}/{year}/{month}/{post_id}/{file}.mp4   |   |   [agency.zkconnect.io]     |
+------------------------------------------------------------------+   |   - Admin Command Dashboard |
                                      ^                                |   - Native Calendar Creator |
                                      | Generate Signed URLs           |   - Team Workload Tracker   |
                                      v                                |   - Direct S3 Drag & Drop   |
+------------------------------------------------------------------+   +-----------------------------+
|                         CONNECT CRM BACKEND (Next.js / Node.js)  |<-----------------+
|  - Dual-Portal Router & Tenant Scoping                           |
|  - Quota Engine & State Machine (Draft -> Approved -> Published) |
|  - Task Assignment & Workload Aggregator                         |
+------------------------------------------------------------------+
          |                                               |
          v                                               v
+-------------------------------+             +------------------------------------------------------+
|     POSTGRESQL DATABASE       |             |                   TRANSACTIONAL ALERTS               |
|  - Tenants & Organizations    |             |  - Resend Email Service                              |
|  - Calendars & Items          |             |  - WhatsApp Business Notifications Webhook           |
|  - Tasks & Team Assignments   |             +------------------------------------------------------+
|  - Media Assets & Activity Log|
+-------------------------------+
```

---

## 6. Phase 1 Milestone Breakdown & Delivery Plan

Phase 1 is strictly divided into two functional milestones:

```
+--------------------------------------------------------------------------------------------------------+
|                                  CONNECT CRM — PHASE 1 ROADMAP                                         |
+--------------------------------------------------------------------------------------------------------+
                                                     |
         +-------------------------------------------+-------------------------------------------+
         |                                                                                       |
         v                                                                                       v
+-------------------------------------------------------+       +-------------------------------------------------------+
|  MILESTONE 1.1: Multi-Tenant Foundation, Quotas,      |       |  MILESTONE 1.2: AWS S3 Media Pipeline, Direct Player, |
|                 Native Calendar Creator & Team Tracker|       |                 & Client Approval Portal              |
+-------------------------------------------------------+       +-------------------------------------------------------+
|  • Module-A: Auth & RBAC (Dual-Portal Isolation)      |       |  • Module-E: S3 Cloud Media Engine                    |
|  • Module-B: Client & Quota Engine                    |       |  • Module-F: Client Collaboration Portal              |
|  • Module-C: Native Calendar & Post Builder Engine    |       |  • Module-G: Approval & Suggestion Engine             |
|  • Module-D: Team Workload & Productivity Dashboard   |       |  • Module-H: Notification Webhook Module              |
|  • Module-D2: Client View Simulator ("Preview Mode")  |       |                                                       |
+-------------------------------------------------------+       +-------------------------------------------------------+
```

---

### MILESTONE 1.1: Multi-Tenant Foundation, Quota Engine, Native Calendar Creator & Team Workload Tracker
* **What We Have to Do:**
  - Build two distinct portals: **Main Agency CRM Portal** for internal staff and **Client Portal** for external stakeholders.
  - Implement client profile setup with contracted monthly deliverables (Posts, Reels, Stories) and custom briefs.
  - Build the **Native Calendar Creator**: 1-Click "Create Calendar", select Month/Year, auto-populate the 31-day scheduling grid.
  - Build the **Day-by-Day Post Creator**: Select date, special days, pillars, format (Image, Reel, Carousel, Story), visual briefs, reel scripts/bytes, and captions.
  - Implement the **Internal Team Task Board ("My Tasks")**: Team members see all tasks assigned to them across all clients for the month.
  - Implement the **Admin Team Workload & Productivity Dashboard**: Team leads track tasks completed vs pending per team member across all clients.
  - Build the **Client View Simulator ("Preview as Client")**: Lets the agency team inspect the exact client view before submitting.
* **How We Are Going to Do That:**
  - Relational PostgreSQL schema with tenant isolation and task assignment tables (`assignee_id`, `client_id`, `calendar_item_id`, `status`).
  - Next.js UI with role-based routing (`/admin` for agency team, `/portal` for clients).
  - TanStack Table + FullCalendar / custom grid with inline quick-editing and drag-and-drop Kanban.
* **Modules Used in Milestone 1.1:**
  1. **`Auth & RBAC Module` (`Module-A`):** Dual-portal architecture, role permissions, and tenant isolation.
  2. **`Client & Quota Engine` (`Module-B`):** Client onboarding, contracted deliverables, and monthly requirement briefs.
  3. **`Native Calendar & Post Builder Engine` (`Module-C`):** 1-Click calendar creation, day-by-day scheduler, Grid/Table/Kanban views.
  4. **`Team Workload & Tracking Module` (`Module-D`):** Admin team productivity dashboard and team member "My Tasks" board.
  5. **`Client View Simulator Module` (`Module-D2`):** "Preview as Client" mode to inspect client experience prior to sharing.

---

### MILESTONE 1.2: AWS S3 Media Pipeline, In-Portal Streaming & Client Approval Portal
* **What We Have to Do:**
  - Direct browser-to-S3 media upload so designers/editors can attach 4K Reels, multi-slide carousels, and creatives without hitting application server limits.
  - Secure time-limited presigned streaming so clients can preview media with zero login barriers to Google Drive.
  - Dedicated, branded Client Portal (`client.zkconnect.io`) where clients view only their calendar, stream videos, and manage suggestions.
  - Item-Level Suggestion & Approval Workflow: Clients click on specific posts to leave suggestions or approve with 1-click.
  - Instant notification hooks (Email & WhatsApp alerts) when calendars are ready or changes are requested.
* **How We Are Going to Do That:**
  - AWS S3 bucket with strict CORS and AWS SDK Presigned URL generation (`PUT` for upload, `GET` for viewing).
  - CloudFront CDN for global low-latency edge delivery and byte-range video streaming.
  - HTML5 Custom Video Player with frame scrubbing for Reels, interactive swipeable carousel slider for multi-slide posts, and zoomable lightboxes for static images.
  - Item-level activity comment threads linked to calendar items.
* **Modules Used in Milestone 1.2:**
  6. **`S3 Cloud Media Engine Module` (`Module-E`):** Handles presigned uploads, media asset metadata, multi-slide carousel order, and CloudFront streaming.
  7. **`Client Collaboration Portal Module` (`Module-F`):** Dedicated, isolated client environment with mobile-optimized calendar review.
  8. **`Approval & Suggestion State Machine Module` (`Module-G`):** Item-level suggestions/changes, version control, and 1-click approval locks.
  9. **`Notification & Webhook Module` (`Module-H`):** Dispatches automated email and WhatsApp alerts upon calendar submission, revisions, or approvals.

---

## 7. Phase 1 Modules Summary Matrix

| Module Name | Module ID | Milestone | Purpose & Functional Scope |
| :--- | :---: | :---: | :--- |
| **Auth & RBAC Module** | `Module-A` | Milestone 1.1 | Dual-portal routing (Agency vs Client), tenant isolation, role permissions. |
| **Client & Quota Engine** | `Module-B` | Milestone 1.1 | Client onboarding, contracted deliverables, special requirement briefs. |
| **Native Calendar & Post Builder** | `Module-C` | Milestone 1.1 | 1-Click calendar creation, day-by-day scheduler, Grid/Table/Kanban views. |
| **Team Workload & Tracking** | `Module-D` | Milestone 1.1 | Admin team productivity dashboard and team member "My Tasks" board. |
| **Client View Simulator** | `Module-D2` | Milestone 1.1 | "Preview as Client" mode to inspect client experience prior to sharing. |
| **S3 Cloud Media Engine** | `Module-E` | Milestone 1.2 | Direct browser-to-S3 presigned upload, CloudFront CDN, and video player. |
| **Client Portal Module** | `Module-F` | Milestone 1.2 | Dedicated, branded client environment with mobile-optimized review. |
| **Approval & Suggestion Engine**| `Module-G` | Milestone 1.2 | Item-level suggestions/changes, revision version control, and 1-click approvals. |
| **Notification Webhook** | `Module-H` | Milestone 1.2 | Automated alerts (Email & WhatsApp) for approvals, comments, and reminders. |

---

## 8. Executive Financial & Operational Impact for the CEO

1. **Protects Monthly Retainer Revenue:**
   - Clients like Kohinoor, Nelson Luxe Hospital, and Central Brain & Spine pay premium monthly retainers for consistent content delivery. Eliminating missed festival dates and late posts guarantees contractual SLA fulfillment and boosts client retention.
2. **Eliminates 120+ Hours of Operational Waste Monthly:**
   - Eliminating manual Google Drive folder management, chasing approvals on WhatsApp, and manual coordination saves ~15 hours per client per month across our account managers and designers.
3. **Elevates Agency Valuation & Brand Positioning:**
   - Offering enterprise clients their own custom-branded portal (`client.agency.com`) establishes our agency as a technology-enabled market leader, justifying higher monthly retainers and winning larger enterprise contracts.
4. **Data-Driven Employee Accountability:**
   - Management gains transparent, objective performance data on every creative team member, enabling fair workload distribution and rewarding top performers.
