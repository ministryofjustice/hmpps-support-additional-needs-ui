import { startOfDay } from 'date-fns'
import { toPrisonerSearch, toPrisonerSearchSummary } from './prisonerSearchMapper'
import aValidPerson from '../../testsupport/personTestDataBuilder'
import SentenceType from '../../enums/sentenceType'
import aValidPrisonerSearchSummary from '../../testsupport/prisonerSearchSummaryTestDataBuilder'
import aValidSearchByPrisonResponse from '../../testsupport/searchByPrisonResponseTestDataBuiilder'
import aValidPrisonerSearch from '../../testsupport/prisonerSearchTestDataBuilder'
import SearchSortField from '../../enums/searchSortField'
import SearchSortDirection from '../../enums/searchSortDirection'

describe('prisonerSearchMapper', () => {
  const prisonId = 'BXI'

  describe('toPrisonerSearch', () => {
    it('should map a SearchByPrisonResponse to a PrisonerSearch', () => {
      // Given
      const searchByPrisonResponse = aValidSearchByPrisonResponse({
        totalElements: 3,
        totalPages: 3,
        page: 2,
        last: false,
        first: false,
        pageSize: 1,
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

      const expected = aValidPrisonerSearch({
        results: {
          count: 3,
          from: 2,
          to: 2,
        },
        items: [
          { text: '1', href: '?searchTerm=Peigh&sort=PRISONER_NAME,ASC&page=1', selected: false },
          { text: '2', href: '?searchTerm=Peigh&sort=PRISONER_NAME,ASC&page=2', selected: true },
          { text: '3', href: '?searchTerm=Peigh&sort=PRISONER_NAME,ASC&page=3', selected: false },
        ],
        previous: {
          text: 'Previous',
          href: '?searchTerm=Peigh&sort=PRISONER_NAME,ASC&page=1',
        },
        next: {
          text: 'Next',
          href: '?searchTerm=Peigh&sort=PRISONER_NAME,ASC&page=3',
        },
        prisoners: [
          aValidPrisonerSearchSummary({
            prisonNumber: 'A1234BC',
            prisonId: 'BXI',
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

      const searchOptions = {
        prisonId,
        sortField: SearchSortField.PRISONER_NAME,
        sortDirection: SearchSortDirection.ASC,
        searchTerm: 'Peigh',
      }

      // When
      const actual = toPrisonerSearch(searchByPrisonResponse, searchOptions)

      // Then
      expect(actual).toEqual(expected)
    })
  })

  describe('toPrisonerSearchSummary', () => {
    it('should map a Person to a PrisonerSearchSummary', () => {
      // Given
      const person = aValidPerson({
        forename: 'IFEREECA',
        surname: 'PEIGH',
        prisonNumber: 'A1234BC',
        dateOfBirth: '1969-02-12',
        sentenceType: SentenceType.SENTENCED,
        cellLocation: 'A-1-102',
        releaseDate: '2025-12-31',
        additionalNeedsSummary: undefined,
      })

      const expected = aValidPrisonerSearchSummary({
        prisonNumber: 'A1234BC',
        prisonId: 'BXI',
        firstName: 'IFEREECA',
        lastName: 'PEIGH',
        dateOfBirth: startOfDay('1969-02-12'),
        releaseDate: startOfDay('2025-12-31'),
        sentenceType: SentenceType.SENTENCED,
        location: 'A-1-102',
        hasSupportPlan: false,
        hasSupportNeeds: false,
      })

      // When
      const actual = toPrisonerSearchSummary(person, prisonId)

      // Then
      expect(actual).toEqual(expected)
    })
  })
})
