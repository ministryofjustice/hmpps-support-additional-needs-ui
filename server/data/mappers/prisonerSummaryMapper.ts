import { startOfDay } from 'date-fns'
import type { Prisoner } from 'prisonerSearchApiClient'
import type { PrisonerSummary } from 'viewModels'

export default function toPrisonerSummary(apiResponse: Prisoner): PrisonerSummary {
  return {
    prisonNumber: apiResponse.prisonerNumber,
    prisonId: apiResponse.prisonId,
    releaseDate: apiResponse.releaseDate ? startOfDay(apiResponse.releaseDate) : null,
    firstName: apiResponse.firstName,
    lastName: apiResponse.lastName,
    receptionDate: apiResponse.receptionDate ? startOfDay(apiResponse.receptionDate) : null,
    dateOfBirth: apiResponse.dateOfBirth ? startOfDay(apiResponse.dateOfBirth) : null,
    location: apiResponse.cellLocation,
    restrictedPatient: apiResponse.restrictedPatient,
    supportingPrisonId: apiResponse.supportingPrisonId,
    sentenceType: apiResponse.legalStatus,
  }
}
