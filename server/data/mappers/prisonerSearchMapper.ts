import type { PrisonerSearch, PrisonerSearchSummary } from 'viewModels'
import type { Person, SearchByPrisonResponse } from 'supportAdditionalNeedsApiClient'
import { startOfDay } from 'date-fns'

const toPrisonerSearch = (apiResponse: SearchByPrisonResponse, prisonId: string): PrisonerSearch => ({
  prisoners: apiResponse.people.map((person: Person) => toPrisonerSearchSummary(person, prisonId)),
  pagination: {
    ...apiResponse.pagination,
  },
})

const toPrisonerSearchSummary = (apiResponse: Person, prisonId: string): PrisonerSearchSummary => ({
  prisonNumber: apiResponse.prisonNumber,
  prisonId,
  firstName: apiResponse.forename,
  lastName: apiResponse.surname,
  sentenceType: apiResponse.sentenceType,
  dateOfBirth: startOfDay(apiResponse.dateOfBirth),
  releaseDate: apiResponse.releaseDate ? startOfDay(apiResponse.releaseDate) : undefined,
  location: apiResponse.cellLocation,
  hasSupportPlan: false, // TODO map correctly once we have the relevant data from the API
  hasSupportNeeds: false, // TODO map correctly once we have the relevant data from the API
})

export { toPrisonerSearch, toPrisonerSearchSummary }
