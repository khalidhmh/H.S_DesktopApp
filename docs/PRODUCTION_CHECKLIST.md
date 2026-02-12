# ✅ Production Deployment Checklist

## Pre-Deployment

### Database
- [ ] Run `npx prisma generate`
- [ ] Run `npx prisma db push`
- [ ] Create seed data with hashed passwords
- [ ] Verify database file location (`prisma/dev.db`)
- [ ] Backup database before deployment

### Environment
- [ ] Set `DATABASE_URL` in `.env`
- [ ] Verify `.gitignore` includes `*.db` and `.env`
- [ ] Remove all console.log statements (optional)

### Code Quality
- [ ] Run `npm run type-check` (no TypeScript errors)
- [ ] Run `npm run build` (successful build)
- [ ] Verify no mock data in production code
- [ ] Check all imports are correct

### Security
- [ ] Verify `sandbox: true` in main/index.ts
- [ ] Verify `contextIsolation: true`
- [ ] Verify `nodeIntegration: false`
- [ ] Verify all passwords are hashed with bcrypt
- [ ] Test login with bcrypt-hashed passwords

### RBAC Testing
- [ ] Login as MANAGER - verify access to students, rooms, penalties
- [ ] Login as SUPERVISOR - verify access to attendance
- [ ] Verify MANAGER **cannot** access supervisor-only routes
- [ ] Verify SUPERVISOR **cannot** access manager-only routes
- [ ] Verify both can access common routes (complaints, settings)

## Build & Package

### Development Build Test
```bash
npm run dev
```
- [ ] Application starts without errors
- [ ] Login works
- [ ] Navigate to all pages successfully
- [ ] Database operations work (CRUD)

### Production Build
```bash
npm run build
```
- [ ] Build completes successfully
- [ ] No build errors or warnings
- [ ] Bundle size is reasonable

### Package Application
```bash
npm run build:win    # Windows
npm run build:mac    # macOS
npm run build:linux  # Linux
```
- [ ] Installer/package created successfully
- [ ] File size acceptable
- [ ] Installer runs without errors

## Post-Deployment Testing

### Fresh Install Test
- [ ] Install on clean machine
- [ ] Database initializes correctly
- [ ] First login works
- [ ] All features functional

### Performance
- [ ] App loads in < 3 seconds
- [ ] Pages load instantly (lazy loading working)
- [ ] No memory leaks
- [ ] Database queries performant

### Data Persistence
- [ ] Create student - verify in database
- [ ] Update student - changes persist
- [ ] Delete student - removed from database
- [ ] App restart - data still present

## Final Sign-Off

- [ ] All checklist items completed
- [ ] User acceptance testing passed
- [ ] Documentation updated
- [ ] Deployment guide created

---

**Status**: Ready for production  
**Last Updated**: Phase 4  
**Approved By**: _____________  
**Date**: ___________
