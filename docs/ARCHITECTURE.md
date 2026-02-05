# System Architecture

## Architecture Pattern: MVVM (Model-View-ViewModel)
The application follows a strict **MVVM** pattern to separate concerns and ensure testability and scalability.

1.  **Model (Prisma/DB)**:
    -   Represents the raw data handling.
    -   Managed by **Prisma Service** (`src/renderer/src/services/*`).
    -   Perform direct DB queries and transactional logic.

2.  **ViewModel (Zustand Stores)**:
    -   Acts as the bridge between UI and Services.
    -   Managed in `src/renderer/src/viewmodels/*`.
    -   Holds application state (e.g., `students` list, `isLoading`, `currentUser`).
    -   Exposes actions (e.g., `fetchStudents()`, `updatePassword()`) to the Views.
    -   **Rule**: Views should rarely call Services directly; they should interact with ViewModels.

3.  **View (React Components)**:
    -   The UI layer (`src/renderer/src/views/*`).
    -   Subscribes to Zustand stores to reactive data.
    -   Purely presentational logic.

## Folder Structure
```
src/renderer/src/
├── components/       # Reusable UI atoms (Buttons, Inputs, Cards) - mostly Shadcn/Radix
├── layouts/          # Main application wrapper layouts
├── lib/              # Utilities (DB connection, class merger)
├── hooks/            # Custom React hooks (e.g., useGlobalSearch)
├── services/         # Data Access Layer (Prisma Calls)
│   ├── auth.service.ts
│   ├── student.service.ts
│   ├── room.service.ts
│   └── ...
├── viewmodels/       # State Management (Zustand Stores)
│   ├── useAuthStore.ts
│   ├── useStudentStore.ts
│   └── ...
├── views/            # Screen Components
│   ├── components/   # View-specific components (Sidebar, Header, Modals)
│   ├── pages/        # Full Page Views
│   │   ├── manager/    # Manager-only pages (Students, Reports)
│   │   ├── supervisor/ # Supervisor-only pages (Attendance)
│   │   └── common/     # Shared pages (Settings, Complaints)
└── App.tsx           # Main Entry & Routing
```

## Database Schema (Summary)
The database is built on SQLite using Prisma. Key models include:

- **User**: System admins (Managers/Supervisors).
- **Student**: Core entity. Linked to Room, Attendance, Penalties, and Complaints.
- **Room**: Physical housing units. Has `capacity`, `currentCount`, and `status`.
- **Attendance**: Daily logs linked to Student.
- **Complaint**: Issues reported by students (linked to Student).
- **Penalty**: Disciplinary actions (linked to Student).
- **MaintenanceFault**: Physical room issues (linked to Room).
