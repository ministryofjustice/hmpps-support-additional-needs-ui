import { startOfDay } from 'date-fns'
import SearchService from './searchService'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import SearchSortField from '../enums/searchSortField'
import SearchSortDirection from '../enums/searchSortDirection'
import aValidSearchByPrisonResponse from '../testsupport/searchByPrisonResponseTestDataBuiilder'
import aValidPrisonerSearch from '../testsupport/prisonerSearchTestDataBuilder'
import aValidPerson from '../testsupport/personTestDataBuilder'
import SentenceType from '../enums/sentenceType'
import aValidPrisonerSearchSummary from '../testsupport/prisonerSearchSummaryTestDataBuilder'

jest.mock('../data/supportAdditionalNeedsApiClient')

describe('searchService', () => {
  const supportAdditionalNeedsApiClient = new SupportAdditionalNeedsApiClient(
    null,
  ) as jest.Mocked<SupportAdditionalNeedsApiClient>
  const searchService = new SearchService(supportAdditionalNeedsApiClient)

  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('searchPrisonersInPrison', () => {
    const prisonId = 'MDI'
    const username = 'some-username'
    const page = 3
    const pageSize = 25
    const sortBy = SearchSortField.CELL_LOCATION
    const sortDirection = SearchSortDirection.ASC
    const prisonerNameOrNumber = 'A1234BC'

    it('should search prisoners in prison', async () => {
      // Given
      const apiResponse = aValidSearchByPrisonResponse({
        totalElements: 1,
        totalPages: 1,
        page: 1,
        last: true,
        first: true,
        pageSize: 50,
        people: [
          aValidPerson({
            forename: 'IFEREECA',
            surname: 'PEIGH',
            prisonNumber: 'A1234BC',
            dateOfBirth: '1969-02-12',
            sentenceType: SentenceType.SENTENCED,
            cellLocation: 'A-1-102',
            releaseDate: '2025-12-31',
            additionalNeedsSummary: undefined,
          }),
        ],
      })
      supportAdditionalNeedsApiClient.getPrisonersByPrisonId.mockResolvedValue(apiResponse)

      const expected = aValidPrisonerSearch({
        items: [],
        results: { count: 1, from: 1, to: 1 },
        next: { text: 'Next', href: '' },
        previous: { text: 'Previous', href: '' },
        prisoners: [
          aValidPrisonerSearchSummary({
            prisonNumber: 'A1234BC',
            prisonId: 'MDI',
            firstName: 'IFEREECA',
            lastName: 'PEIGH',
            dateOfBirth: startOfDay('1969-02-12'),
            releaseDate: startOfDay('2025-12-31'),
            sentenceType: SentenceType.SENTENCED,
            location: 'A-1-102',
            hasSupportPlan: false,
            hasSupportNeeds: false,
          }),
        ],
      })

      // When
      const actual = await searchService.searchPrisonersInPrison(
        prisonId,
        username,
        page,
        pageSize,
        sortBy,
        sortDirection,
        prisonerNameOrNumber,
      )

      // Then
      expect(actual).toEqual(expected)
      expect(supportAdditionalNeedsApiClient.getPrisonersByPrisonId).toHaveBeenCalledWith(
        prisonId,
        username,
        prisonerNameOrNumber,
        page,
        pageSize,
        sortBy,
        sortDirection,
      )
    })

    it('should rethrow error given API client throws error', async () => {
      // Given
      const expectedError = new Error('Internal Server Error')
      supportAdditionalNeedsApiClient.getPrisonersByPrisonId.mockRejectedValue(expectedError)

      // When
      const actual = await searchService
        .searchPrisonersInPrison(prisonId, username, page, pageSize, sortBy, sortDirection, prisonerNameOrNumber)
        .catch(e => e)

      // Then
      expect(actual).toEqual(expectedError)
      expect(supportAdditionalNeedsApiClient.getPrisonersByPrisonId).toHaveBeenCalledWith(
        prisonId,
        username,
        prisonerNameOrNumber,
        page,
        pageSize,
        sortBy,
        sortDirection,
      )
    })
  })
})
