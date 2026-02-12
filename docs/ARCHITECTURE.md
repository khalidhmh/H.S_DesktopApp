# 🏛️ University Housing System - Architecture Documentation

## System Overview

**University Housing System** is a desktop application built with **Electron + React + Prisma** following the **MVVM (Model-View-ViewModel)** architecture pattern.

## Architecture Pattern: MVVM

```
View (React) → ViewModel (Zustand) → Service → IPC → Main Process → Prisma → Database
```

## Folder Structure

- `src/main/` - Electron Main Process + IPC Handlers
- `src/preload/` - IPC Bridge (contextBridge)
- `src/renderer/src/features/` - Domain modules (auth, students)
- `src/renderer/src/views/` - UI pages (manager, supervisor, common)
- `src/renderer/src/viewmodels/` - Zustand stores (business logic)
- `src/renderer/src/services/` - API/IPC layer
- `prisma/` - Database schema + SQLite file

## IPC Bridge Architecture

```typescript
// 1. Service Layer
StudentService.getAllStudents() 
  → window.api.getAllStudents()

// 2. Preload (src/preload/index.ts)
contextBridge.exposeInMainWorld('api', {
  getAllStudents: () => ipcRenderer.invoke('students:get-all')
})

// 3. Main Process (src/main/index.ts)
ipcMain.handle('students:get-all', async () => {
  return await prisma.student.findMany()
})
```

## Security Model

- **sandbox: true** - Chromium sandbox enabled
- **contextIsolation: true** - Preload isolated from renderer  
- **nodeIntegration: false** - No Node.js in renderer
- **bcrypt hashing** - All passwords hashed (saltRounds=10)
- **RBAC** - Role-based route protection (Manager/Supervisor)

## Adding New Modules

### 1. Create Prisma Model
```prisma
model Book {
  id    Int    @id @default(autoincrement())
  title String
}
```

### 2. Add IPC Handler
```typescript
// src/main/index.ts
ipcMain.handle('library:get-all', async () => {
  return await prisma.book.findMany()
})
```

### 3. Expose in Preload
```typescript
// src/preload/index.ts
contextBridge.exposeInMainWorld('api', {
  getAllBooks: () => ipcRenderer.invoke('library:get-all')
})
```

### 4. Create Service
```typescript
// src/renderer/src/services/library.service.ts
export const LibraryService = {
  getAllBooks: async () => await window.api.getAllBooks()
}
```

### 5. Create ViewModel
```typescript
// src/renderer/src/viewmodels/useLibraryStore.ts
export const useLibraryStore = create((set) => ({
  books: [],
  fetchBooks: async () => {
    const books = await LibraryService.getAllBooks()
    set({ books })
  }
}))
```

### 6. Create UI + Route
```tsx
const LibraryPage = () => {
  const { books, fetchBooks } = useLibraryStore()
  useEffect(() => { fetchBooks() }, [])
  return <div>{books.map(b => <div>{b.title}</div>)}</div>
}
```

## Development Commands

```bash
npm run dev          # Start development
npm run build        # Build for production
npx prisma studio    # View database
npx prisma generate  # Generate Prisma client
```

---
**Version**: 1.0.0 | **Phase**: 4 - Final Polish
