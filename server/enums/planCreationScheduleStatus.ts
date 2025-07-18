enum PlanCreationScheduleStatus {
  SCHEDULED = 'SCHEDULED',
  EXEMPT_SYSTEM_TECHNICAL_ISSUE = 'EXEMPT_SYSTEM_TECHNICAL_ISSUE',
  EXEMPT_PRISONER_TRANSFER = 'EXEMPT_PRISONER_TRANSFER',
  EXEMPT_PRISONER_RELEASE = 'EXEMPT_PRISONER_RELEASE',
  EXEMPT_PRISONER_DEATH = 'EXEMPT_PRISONER_DEATH',
  EXEMPT_PRISONER_MERGE = 'EXEMPT_PRISONER_MERGE',
  EXEMPT_PRISONER_NOT_COMPLY = 'EXEMPT_PRISONER_NOT_COMPLY',
  EXEMPT_NOT_IN_EDUCATION = 'EXEMPT_NOT_IN_EDUCATION',
  EXEMPT_NO_NEED = 'EXEMPT_NO_NEED',
  EXEMPT_UNKNOWN = 'EXEMPT_UNKNOWN',
  COMPLETED = 'COMPLETED',
}

export default PlanCreationScheduleStatus
