import type { MojPaginationParams, PrisonerSearch, PrisonerSearchSummary } from 'viewModels'
import type { PaginationMetaData, Person, SearchByPrisonResponse } from 'supportAdditionalNeedsApiClient'
import { startOfDay } from 'date-fns'
import SearchSortField from '../../enums/searchSortField'
import SearchSortDirection from '../../enums/searchSortDirection'

type SearchOptions = {
  prisonId: string
  sortBy: SearchSortField
  sortDirection: SearchSortDirection
  searchTerm?: string
}

const toPrisonerSearch = (apiResponse: SearchByPrisonResponse, searchOptions: SearchOptions): PrisonerSearch => ({
  prisoners: apiResponse.people.map((person: Person) => toPrisonerSearchSummary(person, searchOptions.prisonId)),
  pagination: toMojPaginationParams(apiResponse.pagination, searchOptions),
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

const toMojPaginationParams = (apiResponse: PaginationMetaData, searchOptions: SearchOptions): MojPaginationParams => {
  const from = Math.min(1 + (apiResponse.page - 1) * apiResponse.pageSize, apiResponse.totalElements)
  const to = Math.min(from + apiResponse.pageSize - 1, apiResponse.totalElements)
  const items =
    apiResponse.totalPages > 1
      ? [...Array(apiResponse.totalPages).fill(0)].map((_, idx) => ({
          text: `${idx + 1}`,
          href: buildQueryString(searchOptions, idx + 1),
          selected: idx + 1 === apiResponse.page,
        }))
      : []
  return {
    items,
    results: {
      count: apiResponse.totalElements,
      from,
      to,
    },
    previous: {
      text: 'Previous',
      href: apiResponse.page > 1 ? buildQueryString(searchOptions, apiResponse.page - 1) : '',
    },
    next: {
      text: 'Next',
      href: apiResponse.page < apiResponse.totalPages ? buildQueryString(searchOptions, apiResponse.page + 1) : '',
    },
  }
}

const buildQueryString = (searchOptions: SearchOptions, page: number): string => {
  const queryStringParams = [
    searchOptions.searchTerm && `searchTerm=${decodeURIComponent(searchOptions.searchTerm)}`,
    `sortBy=${searchOptions.sortBy}`,
    `sortDirection=${searchOptions.sortDirection}`,
    `page=${page}`,
  ].filter(val => !!val)
  return `?${queryStringParams.join('&')}`
}

export { toPrisonerSearch, toPrisonerSearchSummary }
