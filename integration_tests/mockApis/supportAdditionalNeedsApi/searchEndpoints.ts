import { SuperAgentRequest } from 'superagent'
import type { Person } from 'supportAdditionalNeedsApiClient'
import SearchSortField from '../../../server/enums/searchSortField'
import SearchSortDirection from '../../../server/enums/searchSortDirection'
import { prisoners } from '../../mockData/prisonerByIdData'
import { stubFor } from '../wiremock'

const stubSearchByPrison = (options?: {
  prisonId?: string
  prisonerNameOrNumber?: string
  page?: number
  pageSize?: number
  sortBy?: SearchSortField
  sortDirection?: SearchSortDirection
  pageOfPrisoners?: Array<Person>
  totalRecords?: number
}): SuperAgentRequest => {
  const prisonId = options?.prisonId || 'BXI'
  const page = options?.page || 1
  const pageSize = options?.pageSize || 50
  const sortBy = options?.sortBy || SearchSortField.PRISONER_NAME
  const sortDirection = options?.sortDirection || SearchSortDirection.ASC

  const returnedPrisoners: Array<Person> =
    options?.pageOfPrisoners ||
    Object.values(prisoners)
      .filter(prisoner => prisoner.response.jsonBody.prisonId === prisonId)
      .map(prisoner => prisoner.response.jsonBody)
      .map(prisoner => ({
        ...prisoner,
        prisonNumber: prisoner.prisonerNumber,
        forename: prisoner.firstName,
        surname: prisoner.lastName,
        firstName: prisoner.firstName,
        additionalNeedsSummary: {
          hasConditions: true,
          hasChallenges: true,
          hasStrengths: true,
          hasSupportRecommendations: true,
        },
      }))
  const totalElements = options?.totalRecords || returnedPrisoners.length
  const totalPages = Math.ceil(totalElements / pageSize)
  const first = totalPages === 1 || page === 1
  const last = totalPages === 1 || page === totalPages

  return stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/support-additional-needs-api/search/prisons/${prisonId}/people`,
      queryParameters: {
        prisonerNameOrNumber: { equalTo: options?.prisonerNameOrNumber || '' },
        page: { equalTo: `${page}` },
        pageSize: { equalTo: `${pageSize}` },
        sortBy: { equalTo: `${sortBy}` },
        sortDirection: { equalTo: `${sortDirection}` },
      },
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        pagination: {
          totalElements,
          totalPages,
          page,
          last,
          first,
          pageSize,
        },
        people: returnedPrisoners,
      },
    },
  })
}

const stubSearchByPrison500Error = (options?: {
  prisonId?: string
  prisonerNameOrNumber?: string
  page?: number
  pageSize?: number
  sortBy?: SearchSortField
  sortDirection?: SearchSortDirection
}): SuperAgentRequest => {
  const prisonId = options?.prisonId || 'BXI'
  const page = options?.page || 1
  const pageSize = options?.pageSize || 50
  const sortBy = options?.sortBy || SearchSortField.PRISONER_NAME
  const sortDirection = options?.sortDirection || SearchSortDirection.ASC

  return stubFor({
    request: {
      method: 'GET',
      urlPathPattern: `/support-additional-needs-api/search/prisons/${prisonId}/people`,
      queryParameters: {
        prisonerNameOrNumber: { equalTo: options?.prisonerNameOrNumber || '' },
        page: { equalTo: `${page}` },
        pageSize: { equalTo: `${pageSize}` },
        sortBy: { equalTo: `${sortBy}` },
        sortDirection: { equalTo: `${sortDirection}` },
      },
    },
    response: {
      status: 500,
      body: 'Unexpected error',
    },
  })
}

export default { stubSearchByPrison, stubSearchByPrison500Error }
