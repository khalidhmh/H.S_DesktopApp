const fs = require('fs')
const path = require('path')

// هيكلية المجلدات (Clean Architecture)
const folders = [
  'src/main/services',
  'src/main/database',
  'src/shared/types',
  'src/shared/constants',
  'src/renderer/src/assets/images',
  'src/renderer/src/assets/fonts',
  'src/renderer/src/components/ui', // Shadcn Components
  'src/renderer/src/components/common', // App Specific Components
  'src/renderer/src/layouts', // Sidebar & Header
  'src/renderer/src/store', // Zustand
  'src/renderer/src/styles', // CSS
  'src/renderer/src/lib', // Utils
  // وحدات النظام (Modules)
  'src/renderer/src/features/auth',
  'src/renderer/src/features/dashboard',
  'src/renderer/src/features/attendance',
  'src/renderer/src/features/students',
  'src/renderer/src/features/permits',
  'src/renderer/src/features/maintenance',
  'src/renderer/src/features/complaints',
  'src/renderer/src/features/activities',
  'src/renderer/src/features/penalties',
  'src/renderer/src/features/reports',
  'src/renderer/src/features/custody',
  'src/renderer/src/features/notifications',
  'src/renderer/src/features/settings'
]

// ملفات أساسية لضمان عمل الـ Styling
const files = [
  {
    path: 'src/renderer/src/lib/utils.ts',
    content:
      'import { type ClassValue, clsx } from "clsx";\nimport { twMerge } from "tailwind-merge";\n\nexport function cn(...inputs: ClassValue[]) {\n  return twMerge(clsx(inputs));\n}'
  }
]

console.log('🚀 Building Architecture...')

folders.forEach((dir) => {
  const fullPath = path.join(process.cwd(), dir)
  if (!fs.existsSync(fullPath)) fs.mkdirSync(fullPath, { recursive: true })
})

files.forEach((file) => {
  const filePath = path.join(process.cwd(), file.path)
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, file.content)
})

console.log('✅ Project Structure Ready!')
