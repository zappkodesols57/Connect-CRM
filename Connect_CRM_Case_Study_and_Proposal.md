# PROJECT CASE STUDY & ARCHITECTURAL PROPOSAL (PHASE 1)
## Connect Portal: Multi-Tenant Social Media Operations & Client Collaboration CRM

---

**Document Version:** 2.3 (Phase 1 Focused Edition)  
**Target Audience:** Chief Executive Officer (CEO), Technical Team Lead, Project Stakeholders  
**Author:** Tushar & The Engineering Team  
**Date:** September 2026  
**Status:** Architecture Finalized — Ready for Review & Implementation  

---

## 1. Executive Summary

Our agency manages end-to-end social media operations for multiple clients including **Kohinoor TEZ, Nelson Luxe Hospital, Central Brain & Spine Hospital (Neuro), Vibetara, and Zappkode Solutions**. Currently, our workflow relies on static spreadsheets (`Oct Calender 2026.xlsx`), manual Google Drive links, and unstructured WhatsApp/email feedback loops.

While spreadsheets got us started, they create three critical operational bottlenecks at scale:
1. **Google Drive Permission & Accessibility Roadblock:** Clients constantly encounter "Access Denied" errors, require personal Google accounts, experience slow mobile video buffering for 4K Reels, and struggle with disorganized folder structures.
2. **Disconnected Client Approval Workflow:** Tracking feedback across WhatsApp, phone calls, and spreadsheet comments leads to miscommunication, missed festival dates, and delayed approvals.
3. **No Internal Team Workload Tracking:** Team leads cannot see who on the internal team is overloaded or lagging behind (e.g. how many reels or creatives Editor A has finished vs pending across 5 clients).

### The Solution: Connect CRM (Phase 1)
**Connect** is architected as two strictly isolated portal environments sharing a unified backend:

```
+----------------------------------------------------------------------------------------------------+
|                                    CONNECT CRM PLATFORM                                            |
+----------------------------------------------------------------------------------------------------+
                                                  |
                 +--------------------------------+--------------------------------+
                 |                                                                 |
                 v                                                                 v
+--------------------------------------------------+             +-----------------------------------+
|      MAIN AGENCY CRM PORTAL (agency.zkconnect)   |             |     CLIENT PORTAL (client.zkconnect)|
+--------------------------------------------------+             +-----------------------------------+
| • Agency Super Admin & Team Lead:                |             | • Dedicated Client Login:         |
|   - Multi-client management (Nelson, Kohinoor...) |             |   - Isolated to their brand only  |
|   - 1-Click "Create Calendar" (Month & Year)     |             |   - Branded UI with company logo  |
|   - Set monthly quotas (Posts, Reels, Stories)   |             |                                   |
|   - Team Workload & Productivity Dashboard       |             | • Calendar & Media Review:        |
|     (Track tasks completed per team member)      |             |   - Interactive Month/List view   |
|                                                  |             |   - Direct S3 streaming (Reels,   |
| • Internal Team Task Board ("My Tasks"):         |             |     Carousels, Creatives)         |
|   - Designers, Editors, Copywriters see all tasks|             |                                   |
|     assigned to them across all clients for month|             | • Item-Level Suggestions & Action:|
|   - Drag & drop status (To Do -> Done)           |             |   - Give suggestions on posts     |
|   - Direct S3 media drag-and-drop upload         |             |   - 1-Click Approve / Request Fix |
|                                                  |             |   - Track monthly quota delivery  |
| • "Preview as Client" Simulator Mode             |             | • ZERO internal stats visible     |
+--------------------------------------------------+             +-----------------------------------+
```

---

## 2. Solving the Google Drive Problem: Native AWS S3 Media Architecture

### 2.1. Why Google Drive Fails in a Client Portal
1. **Authentication Silos:** Google Drive requires clients to be logged into the specific Google account that holds viewing permissions, constantly showing *"You need access. Request access."*
2. **CORS & Iframe Restrictions:** Google Drive does not permit clean iframe embedding or custom video controls inside third-party web portals.
3. **Video Transcoding Lag:** Uploading 1080p/4K 60fps Reels to Google Drive takes 15–30 minutes before Google finishes processing preview resolution.

### 2.2. The S3-Powered Solution Architecture
- **Direct Browser Uploads:** Agency designers upload multi-gigabyte video files directly to S3 via presigned URLs without routing heavy payload traffic through our application server.
- **Zero Client Permission Friction:** Clients never need an AWS or Google account. The portal securely authenticates the client session and renders private, signed S3 URLs valid for 2 hours.
- **Instant Video Playback:** S3 paired with CloudFront provides byte-range requests (`Accept-Ranges: bytes`), allowing instant scrubbing and 0-second buffering on mobile web browsers.

---

## 3. Team Workload Tracking & Operational Playbook

### 3.1. Main CRM: Team Workload & Productivity Tracking (Team Lead View)
Inside the Main CRM Portal, the Team Lead and Project Manager have real-time visibility into internal team output:

| Team Member | Role | Total Assigned Tasks | Tasks Completed | Tasks In Progress | Workload % | Performance Status |
| :--- | :--- | :---: | :---: | :---: | :---: | :--- |
| **Rahul S.** | Senior Graphic Designer | 45 Creatives | 38 Done | 7 In Progress | 84% | 🟢 On Track |
| **Sneha P.** | Video Editor (Reels) | 25 Reels | 21 Done | 4 In Progress | 84% | 🟢 On Track |
| **Amit K.** | Junior Designer | 30 Creatives | 18 Done | 12 Pending | 60% | 🟡 Reallocation Alert |
| **Prerna M.** | Strategist & Copywriter | 100 Captions/Scripts | 95 Done | 5 In Progress | 95% | 🟢 Ahead of Schedule |

### 3.2. Team Member Experience: "My Tasks" Dashboard
1. Team members see their personal **"My Tasks for October 2026"** view.
2. Tasks are aggregated across all their assigned clients (e.g. 5 tasks for Nelson Hospital, 3 tasks for Kohinoor, 2 tasks for Vibetara).
3. Clicking on a task opens the card with the visual brief, special day, and required format.
4. Designers drag and drop finished creatives or MP4 reels directly into the card (auto-uploaded to S3).
5. They mark the task **"Ready for QA"**, instantly notifying the Team Lead.

### 3.3. Client Experience: Frictionless Review & Item-Level Suggestions
1. Clients see **only their company's calendar** with their logo.
2. They do **not** see who designed the post, internal task tickets, or agency workload metrics.
3. They click on any post card:
   - Plays the reel video or swipes through carousel slides smoothly on the S3 player.
   - Reads the caption and scheduled date.
4. Two simple action buttons:
   - **"Approve" (Green Button):** 1-Click approval that locks the post and timestamps it.
   - **"Suggest Changes" (Feedback Box):** Leaves pinpointed suggestions (e.g. *"Please change the doctor's designation in slide 2"*, *"Replace background music on reel"*).

---

## 4. Phase 1 Implementation Roadmap & Modules Breakdown

Phase 1 is structured into **two distinct milestones**:

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

## 5. Comprehensive Phase 1 Modules Summary

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
