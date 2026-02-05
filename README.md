# University Housing Management System (UHMS)

## Overview
The **University Housing Management System** is a comprehensive desktop application designed to streamline the management of university dormitories. It addresses common challenges such as manual student tracking, room allocation inefficiencies, and attendance monitoring. This system provides a unified platform for housing managers and building supervisors to manage occupancy, handle maintenance requests, track student behavior (penalties), and ensuring the safety of students through digital attendance logs.

## Technology Stack
Built with a modern, performance-oriented stack:
- **Core**: Electron (Desktop Runtime)
- **Frontend**: React, TypeScript, TailwindCSS
- **State Management**: Zustand (Global Store & Logic Layer)
- **Database**: SQLite (via Prisma ORM)
- **UI Components**: Radix UI, Lucide React Icons
- **Tooling**: Vite, Electron-Builder

## Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd University-Housing-System
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Database Setup**:
   Initialize the SQLite database and seed it with initial data.
   ```bash
   npx prisma generate
   npx prisma db push
   npx prisma db seed
   ```

4. **Run Development Mode**:
   ```bash
   npm run dev
   ```

5. **Build for Production**:
   ```bash
   npm run build:win  # For Windows
   npm run build:mac  # For macOS
   npm run build:linux # For Linux
   ```

## Login Credentials
The system comes seeded with the following default accounts:

| Role | Email | Password | Access Level |
|------|-------|----------|--------------|
| **Manager** | `manager@system.com` | `123` | Full Access (Students, Rooms, Reports, Settings) |
| **Supervisor** | `supervisor@system.com` | `123` | Limited Access (Attendance, Complaints, Maintenance) |

## Key Features
- **Dashboard**: Real-time statistics on occupancy and alerts.
- **Student Management**: Full CRUD profiles with room assignment.
- **Room Management**: Visual grid view of buildings and room status.
- **Attendance System**: Daily tracking with "Present/Absent" toggles.
- **Issues & Maintenance**: Complaint ticketing system for students.
- **Reports**: Exportable data (CSV) for administration metrics.
- **Global Search**: Instant search for any student or room.
