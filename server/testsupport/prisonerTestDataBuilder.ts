import type { Prisoner } from 'prisonerSearchApiClient'

export default function aValidPrisoner(options?: {
  prisonNumber?: string
  prisonId?: string
  releaseDate?: string
  firstName?: string
  lastName?: string
  receptionDate?: string
  dateOfBirth?: string
  cellLocation?: string
  restrictedPatient?: boolean
  supportingPrisonId?: string
}): Prisoner {
  return {
    prisonerNumber: options?.prisonNumber || 'A1234BC',
    prisonId: options?.prisonId || 'BXI',
    releaseDate: options?.releaseDate || '2025-12-31',
    firstName: options?.firstName || 'IFEREECA',
    lastName: options?.lastName || 'PEIGH',
    receptionDate: options?.receptionDate || '1999-08-29',
    dateOfBirth: options?.dateOfBirth || '1969-02-12',
    cellLocation: options?.cellLocation || 'A-1-102',
    restrictedPatient:
      !options || options.restrictedPatient === null || options.restrictedPatient === undefined
        ? false
        : options.restrictedPatient,
    supportingPrisonId: options?.supportingPrisonId,
  }
}
