export interface ValidationError {
  field: string
  message: string
}

export interface ValidationResult {
  valid: boolean
  errors: ValidationError[]
  sanitized?: any
}

/**
 * Validate and sanitize student data before database insertion
 */
export function validateStudentData(data: any): ValidationResult {
  const errors: ValidationError[] = []

  // Required fields validation
  if (!data.name?.trim()) {
    errors.push({ field: 'name', message: 'Name is required' })
  }

  if (!data.universityId?.trim()) {
    errors.push({ field: 'universityId', message: 'University ID is required' })
  }

  if (!data.nationalId?.trim()) {
    errors.push({ field: 'nationalId', message: 'National ID is required' })
  }

  if (!data.college?.trim()) {
    errors.push({ field: 'college', message: 'College is required' })
  }

  if (!data.year?.trim()) {
    errors.push({ field: 'year', message: 'Year is required' })
  }

  // Return early if validation failed
  if (errors.length > 0) {
    return { valid: false, errors }
  }

  // Sanitize and return safe data
  return {
    valid: true,
    errors: [],
    sanitized: {
      name: String(data.name).trim(),
      universityId: String(data.universityId).trim(),
      nationalId: String(data.nationalId).trim(),
      college: String(data.college).trim(),
      year: String(data.year).trim(),
      phone: data.phone?.trim() || null,
      guardianContact: data.guardianContact?.trim() || null,
      city: data.city?.trim() || null,
      status: 'ACTIVE',
      roomId: data.roomId ? Number(data.roomId) : null
    }
  }
}

/**
 * Validate login credentials
 */
export function validateLoginData(data: any): {
  valid: boolean
  errors: ValidationError[]
} {
  const errors: ValidationError[] = []

  // Email validation
  if (!data.email?.trim()) {
    errors.push({ field: 'email', message: 'Email is required' })
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({ field: 'email', message: 'Invalid email format' })
  }

  // Password validation
  if (!data.password) {
    errors.push({ field: 'password', message: 'Password is required' })
  } else if (data.password.length < 4) {
    errors.push({ field: 'password', message: 'Password must be at least 4 characters' })
  }

  return { valid: errors.length === 0, errors }
}

/**
 * Validate room status update
 */
export function validateRoomStatus(status: any): boolean {
  const allowedStatuses = ['AVAILABLE', 'MAINTENANCE']
  return allowedStatuses.includes(status)
}

/**
 * Validate student status update
 */
export function validateStudentStatus(status: any): boolean {
  const allowedStatuses = ['ACTIVE', 'EVACUATED']
  return allowedStatuses.includes(status)
}

/**
 * Validate and sanitize complaint data
 */
export function validateComplaintData(data: any): ValidationResult {
  const errors: ValidationError[] = []

  // Title validation
  if (!data.title?.trim()) {
    errors.push({ field: 'title', message: 'Title is required' })
  } else if (data.title.trim().length > 200) {
    errors.push({ field: 'title', message: 'Title must be less than 200 characters' })
  }

  // Description validation
  if (!data.description?.trim()) {
    errors.push({ field: 'description', message: 'Description is required' })
  } else if (data.description.trim().length > 1000) {
    errors.push({ field: 'description', message: 'Description must be less than 1000 characters' })
  }

  // Priority validation
  const allowedPriorities = ['LOW', 'MEDIUM', 'HIGH']
  if (!allowedPriorities.includes(data.priority)) {
    errors.push({ field: 'priority', message: 'Invalid priority level' })
  }

  // Student ID validation
  if (!data.studentId || isNaN(Number(data.studentId))) {
    errors.push({ field: 'studentId', message: 'Valid student ID is required' })
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: [],
    sanitized: {
      title: String(data.title).trim(),
      description: String(data.description).trim(),
      priority: data.priority,
      studentId: Number(data.studentId)
    }
  }
}

/**
 * Validate and sanitize maintenance fault data
 */
export function validateMaintenanceFaultData(data: any): ValidationResult {
  const errors: ValidationError[] = []

  // Type validation
  if (!data.type?.trim()) {
    errors.push({ field: 'type', message: 'Fault type is required' })
  } else if (data.type.trim().length > 100) {
    errors.push({ field: 'type', message: 'Type must be less than 100 characters' })
  }

  // Description validation
  if (!data.description?.trim()) {
    errors.push({ field: 'description', message: 'Description is required' })
  } else if (data.description.trim().length > 1000) {
    errors.push({ field: 'description', message: 'Description must be less than 1000 characters' })
  }

  // Priority validation
  const allowedPriorities = ['LOW', 'MEDIUM', 'HIGH']
  if (!allowedPriorities.includes(data.priority)) {
    errors.push({ field: 'priority', message: 'Invalid priority level' })
  }

  // Room ID validation (optional)
  if (data.roomId && isNaN(Number(data.roomId))) {
    errors.push({ field: 'roomId', message: 'Invalid room ID' })
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: [],
    sanitized: {
      type: String(data.type).trim(),
      description: String(data.description).trim(),
      priority: data.priority,
      roomId: data.roomId ? Number(data.roomId) : null,
      location: data.location?.trim() || null
    }
  }
}

/**
 * Validate and sanitize penalty data
 */
export function validatePenaltyData(data: any): ValidationResult {
  const errors: ValidationError[] = []

  // Reason validation
  if (!data.reason?.trim()) {
    errors.push({ field: 'reason', message: 'Reason is required' })
  } else if (data.reason.trim().length > 500) {
    errors.push({ field: 'reason', message: 'Reason must be less than 500 characters' })
  }

  // Type validation
  if (!data.type?.trim()) {
    errors.push({ field: 'type', message: 'Penalty type is required' })
  } else if (data.type.trim().length > 100) {
    errors.push({ field: 'type', message: 'Type must be less than 100 characters' })
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: [],
    sanitized: {
      reason: String(data.reason).trim(),
      type: String(data.type).trim()
    }
  }
}

/**
 * Validate attendance record data
 */
export function validateAttendanceData(record: any): ValidationResult {
  const errors: ValidationError[] = []

  // Student ID validation
  if (!record.studentId || isNaN(Number(record.studentId))) {
    errors.push({ field: 'studentId', message: 'Valid student ID is required' })
  }

  // Status validation
  const allowedStatuses = ['PRESENT', 'ABSENT', 'EXCUSED']
  if (!allowedStatuses.includes(record.status)) {
    errors.push({ field: 'status', message: 'Invalid attendance status' })
  }

  // Note validation (optional)
  if (record.note && record.note.trim().length > 500) {
    errors.push({ field: 'note', message: 'Note must be less than 500 characters' })
  }

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: [],
    sanitized: {
      studentId: Number(record.studentId),
      status: record.status,
      note: record.note?.trim() || null
    }
  }
}

/**
 * Validate array of attendance records
 */
export function validateAttendanceRecords(records: any[]): ValidationResult {
  const errors: ValidationError[] = []

  if (!Array.isArray(records)) {
    return {
      valid: false,
      errors: [{ field: 'records', message: 'Records must be an array' }]
    }
  }

  if (records.length === 0) {
    return {
      valid: false,
      errors: [{ field: 'records', message: 'At least one record is required' }]
    }
  }

  if (records.length > 1000) {
    return {
      valid: false,
      errors: [{ field: 'records', message: 'Cannot submit more than 1000 records at once' }]
    }
  }

  const sanitizedRecords: any[] = []

  records.forEach((record, index) => {
    const validation = validateAttendanceData(record)
    if (!validation.valid) {
      validation.errors.forEach((error) => {
        errors.push({
          field: `records[${index}].${error.field}`,
          message: error.message
        })
      })
    } else {
      sanitizedRecords.push(validation.sanitized)
    }
  })

  if (errors.length > 0) {
    return { valid: false, errors }
  }

  return {
    valid: true,
    errors: [],
    sanitized: sanitizedRecords
  }
}
