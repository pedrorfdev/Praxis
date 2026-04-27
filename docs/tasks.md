# 📋 TASKS - Praxis Bug Fixes & Improvements

**Last Updated**: 2026-04-24  
**Total Tasks**: 16  
**Status**: Planning Phase  

---

## 📊 PHASE BREAKDOWN

| Phase | Priority | Tasks | Status |
|-------|----------|-------|--------|
| 🔴 Phase 1 | CRITICAL | 1.1, 1.2, 1.3 | `🟡 IN PROGRESS` |
| 🟠 Phase 2 | HIGH | 2.1-2.7 | `⏳ READY` |
| 🟡 Phase 3 | MEDIUM | 3.1-3.4 | `⏳ READY` |
| 🔵 Phase 4 | LOW | 4.1, 4.2 | `⏳ READY` |

---

# 🔴 PHASE 1: CRITICAL BLOCKERS

## Task 1.1 - Encounters: Add clinicId to saveSession
**Status**: `⏳ TODO` | **Priority**: CRITICAL (P0)

**Problem**: Backend receives `undefined` for `clinicId` when saving encounters
**File**: `apps/web/src/app/(dashboard)/encounters/new/page.tsx`
**Test**: [ ] Create new encounter saves successfully

---

## Task 1.2 - Encounters: Fix numeric field losing focus
**Status**: `⏳ TODO` | **Priority**: CRITICAL (P0)

**Problem**: NumericFormat component loses focus after each keystroke
**File**: `apps/web/src/app/(dashboard)/encounters/new/page.tsx`
**Solution**: Fix re-render on input change (use useCallback or move component)
**Test**: [ ] Type in session value field without losing focus

---

## Task 1.3 - Caregivers: Implement patient linking
**Status**: `⏳ TODO` | **Priority**: CRITICAL (P0)

**Problem**: Mutation doesn't execute when linking patient to caregiver
**File**: `apps/web/src/components/caregivers/link-patient-dialog.tsx`
**Test**: [ ] Add patient to caregiver and see in list

---

# 🟠 PHASE 2: HIGH PRIORITY

## Task 2.1 - Auth: Email delivery broken
**Status**: `⏳ TODO` | **Priority**: HIGH (P1)

**Problem**: Email sending (forgot/reset) not working
**Files**: `apps/api/src/modules/auth/auth.service.ts`
**Check**: SMTP env vars, Nodemailer config
**Test**: [ ] Receive reset email

---

## Task 2.2 - Auth: Reset password missing instructions
**Status**: `⏳ TODO` | **Priority**: HIGH (P1)

**Problem**: No password requirement display
**File**: `apps/web/src/app/(auth)/reset-password/page.tsx`
**Requirements**: Min 8 chars, 1 uppercase, 1 number
**Test**: [ ] See checklist, mark as you type

---

## Task 2.3 - Patients: Add status field (Active/Paused)
**Status**: `⏳ TODO` | **Priority**: HIGH (P1)

**Problem**: No way to toggle patient status
**File**: `apps/web/src/components/patients/patient-form.tsx`
**Solution**: Add Switch component for status
**Test**: [ ] Status saves and persists

---

## Task 2.4 - Patients: Standardize action buttons
**Status**: `⏳ TODO` | **Priority**: HIGH (P1)

**Problem**: Inconsistent with caregiver buttons
**File**: `apps/web/src/app/(dashboard)/patients/page.tsx`
**Pattern**: Ver, Editar, Deletar (same as caregivers)
**Test**: [ ] Buttons match caregiver style

---

## Task 2.5 - Caregivers: Remove patient count badge
**Status**: `⏳ TODO` | **Priority**: HIGH (P1)

**Problem**: Badge adds visual clutter
**File**: `apps/web/src/app/(dashboard)/caregivers/page.tsx`
**Solution**: Remove badge UI (keep data if needed)
**Test**: [ ] Cards look clean without badge

---

## Task 2.6 - Caregivers: Fix CPF validation on edit
**Status**: `⏳ TODO` | **Priority**: HIGH (P1)

**Problem**: CPF validation fails or blocks valid edits
**File**: `apps/web/src/components/caregivers/caregivers-form.tsx`
**Check**: Allow same CPF if editing same caregiver
**Test**: [ ] Edit without changing CPF works

---

## Task 2.7 - Caregivers: Fix form skipping last step
**Status**: `⏳ TODO` | **Priority**: HIGH (P1)

**Problem**: Validation skips or jumps last step
**File**: `apps/web/src/components/caregivers/caregivers-form.tsx`
**Solution**: Fix trigger() logic, don't submit on step validation
**Test**: [ ] All steps visible, can't skip

---

# 🟡 PHASE 3: MEDIUM PRIORITY

## Task 3.1 - Encounters: Pre-select patient from URL
**Status**: `⏳ TODO` | **Priority**: MEDIUM (P2)

**Problem**: New evolution from patient page should pre-select patient
**File**: `apps/web/src/app/(dashboard)/encounters/new/page.tsx`
**Solution**: Read `patientId` from URL and set
**Test**: [ ] Patient pre-selected when creating from patient page

---

## Task 3.2 - Encounters: Start with edit mode enabled
**Status**: `⏳ TODO` | **Priority**: MEDIUM (P2)

**Problem**: New encounters should start in edit mode
**File**: `apps/web/src/app/(dashboard)/encounters/new/page.tsx`
**Solution**: Set isLocked=false for new, true for existing
**Test**: [ ] Can start typing immediately

---

## Task 3.3 - Activity: View in read-only mode
**Status**: `⏳ TODO` | **Priority**: MEDIUM (P2)

**Problem**: Clicking activity item should open in view mode
**File**: `apps/web/src/app/(dashboard)/activity/page.tsx`
**Solution**: Add `?mode=view` to URL, handle in encounters page
**Test**: [ ] Record opens locked (can't edit)

---

## Task 3.4 - Dashboard: Real metrics from seed
**Status**: `⏳ TODO` | **Priority**: MEDIUM (P2)

**Problem**: Metrics hardcoded, should use real data
**Files**: Seed data + `apps/web/src/components/metrics-grid.tsx`
**Action**: Ensure seed has 10-15 patients with diagnoses
**Test**: [ ] Metrics show real counts

---

# 🔵 PHASE 4: GLOBAL

## Task 4.1 - Forms: Add error messages for all fields
**Status**: `⏳ TODO` | **Priority**: LOW (P3)

**Problem**: Validation errors exist but not displayed
**Scope**: All forms (patients, caregivers, auth, etc)
**Solution**: Create FormError component, display under each field
**Test**: [ ] See specific error for each field

---

## Task 4.2 - Forms: Add placeholders to all inputs
**Status**: `⏳ TODO` | **Priority**: LOW (P3)

**Problem**: No placeholders, users don't know what to enter
**Scope**: All forms
**Solution**: Add meaningful placeholders (Ex: João Silva de Oliveira)
**Test**: [ ] All inputs have helpful placeholders

---

## EXECUTION TRACKING

| Task | Status | Notes |
|------|--------|-------|
| 1.1 | `⏳ READY` | Start here - blocker |
| 1.2 | `⏳ READY` | Start here - blocker |
| 1.3 | `⏳ READY` | Start here - blocker |
| 2.1-2.7 | `⏳ READY` | After Phase 1 |
| 3.1-3.4 | `⏳ READY` | After Phase 2 |
| 4.1-4.2 | `⏳ READY` | Last phase |

---

## HOW TO USE THIS FILE

1. Read a task section
2. Understand the problem and files to modify
3. Make changes following the "Change Required" section
4. Run tests listed in "Test Criteria"
5. Update task status to ✅ DONE
6. Move to next task

**For Agents**: Parse task ID (e.g., "1.1"), find section, extract:
- Problem (what's wrong)
- Files (what to edit)
- Change (what to do)
- Test (how to verify)

TASKS_EOF