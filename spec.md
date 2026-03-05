# JobSpark2026 Work Dashboard

## Current State
New project. No existing code.

## Requested Changes (Diff)

### Add
- Full-stack work tracking dashboard for a micro-task/gig platform called "JobSpark2026"
- User authentication (login/profile with name)
- Dashboard header with: logo, greeting with user name, total balance display with a live counter animation
- Summary stats bar: Total Entries count, current Date, Time Worked today, Today's Earnings (in INR ₹)
- Work entries table with columns: No., Date, Project Name, Entry Type, Earnings (₹), Status (Completed badge)
- Pagination for work entries (showing X to Y of Z entries, prev/next/page buttons)
- Search and Filter controls above the table
- Right sidebar panel with:
  - Earnings Summary card: Today's Earnings, Total Withdrawn, Status (Paid checkmark)
  - Platform info card: JobSpark2026 branding, Founder name (Vedika Khanna), website link
  - Platform Information section
- Footer: "Work Completed via JobSpark2026 Online Work Platform."
- Backend stores: work entries, user profile (name), earnings/withdrawal records

### Modify
- None (new project)

### Remove
- None (new project)

## Implementation Plan
1. Backend (Motoko):
   - User profile: store/get name
   - WorkEntry type: id, date, projectName, entryType, earnings (Nat), status
   - CRUD for work entries: addEntry, getEntries (paginated), getTotal
   - Earnings summary: totalEarnings, totalWithdrawn, todayEarnings, timeWorked
   - Seed sample data (120 entries) for demo

2. Frontend:
   - Top nav: logo + greeting + balance chip with animated counter
   - Stats row: 4 stat cards (Total Entries, Date, Time Worked, Today's Earnings)
   - Main content: work entries table with search/filter + pagination
   - Right sidebar: Earnings Summary card + Platform Info card
   - Footer bar
   - All data fetched from backend via generated bindings
   - INR currency formatting throughout
   - Responsive layout
