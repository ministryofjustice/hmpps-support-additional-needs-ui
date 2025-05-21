import { startOfDay } from 'date-fns'
import { toPrisonerSearch, toPrisonerSearchSummary } from './prisonerSearchMapper'
import aValidPerson from '../../testsupport/personTestDataBuilder'
import SentenceType from '../../enums/sentenceType'
import aValidPrisonerSearchSummary from '../../testsupport/prisonerSearchSummaryTestDataBuilder'
import aValidSearchByPrisonResponse from '../../testsupport/searchByPrisonResponseTestDataBuiilder'
import aValidPrisonerSearch from '../../testsupport/prisonerSearchTestDataBuilder'

describe('prisonerSearchMapper', () => {
  const prisonId = 'BXI'

  describe('toPrisonerSearch', () => {
    it('should map a SearchByPrisonResponse to a PrisonerSearch', () => {
      // Given
      const searchByPrisonResponse = aValidSearchByPrisonResponse({
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

      const expected = aValidPrisonerSearch({
        totalElements: 1,
        totalPages: 1,
        page: 1,
        last: true,
        first: true,
        pageSize: 50,
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

      // When
      const actual = toPrisonerSearch(searchByPrisonResponse, prisonId)

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
