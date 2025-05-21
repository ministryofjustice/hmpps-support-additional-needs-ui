import type { PrisonerSearch, PrisonerSearchSummary } from 'viewModels'
import aValidPrisonerSearchSummary from './prisonerSearchSummaryTestDataBuilder'

const aValidPrisonerSearch = (options?: {
  totalElements?: number
  totalPages?: number
  page?: number
  last?: boolean
  first?: boolean
  pageSize?: number
  prisoners?: Array<PrisonerSearchSummary>
}): PrisonerSearch => ({
  pagination: {
    totalElements: options?.totalElements ?? 5,
    totalPages: options?.totalPages ?? 3,
    page: options?.page ?? 1,
    last: options?.last ?? false,
    first: options?.first ?? true,
    pageSize: options?.pageSize ?? 2,
  },
  prisoners: options?.prisoners ?? [
    aValidPrisonerSearchSummary({ prisonNumber: 'A1234BC' }),
    aValidPrisonerSearchSummary({ prisonNumber: 'B4567CD' }),
  ],
})

export default aValidPrisonerSearch
