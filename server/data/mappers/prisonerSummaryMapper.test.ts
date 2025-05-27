import type { Prisoner } from 'prisonerSearchApiClient'
import type { PrisonerSummary } from 'viewModels'
import aValidPrisoner from '../../testsupport/prisonerTestDataBuilder'
import aValidPrisonerSummary from '../../testsupport/prisonerSummaryTestDataBuilder'
import toPrisonerSummary from './prisonerSummaryMapper'
import SentenceType from '../../enums/sentenceType'

describe('prisonerSummaryMapper', () => {
  it('should map to Prisoner Summary', () => {
    // Given
    const prisoner = aValidPrisoner()
    const expected = aValidPrisonerSummary()

    // When
    const actual = toPrisonerSummary(prisoner)

    // Then
    expect(actual).toEqual(expected)
  })

  it('should map to Prisoner Summary given prisoner has no release date, reception date, or DOB', () => {
    // Given
    const prisoner: Prisoner = {
      prisonerNumber: 'A1234BC',
      prisonId: 'BXI',
      releaseDate: '',
      firstName: 'IFEREECA',
      lastName: 'PEIGH',
      receptionDate: '',
      dateOfBirth: '',
      cellLocation: 'A-1-102',
      restrictedPatient: false,
      supportingPrisonId: undefined,
      legalStatus: 'RECALL',
    }

    const expected: PrisonerSummary = {
      prisonNumber: 'A1234BC',
      prisonId: 'BXI',
      releaseDate: null,
      firstName: 'IFEREECA',
      lastName: 'PEIGH',
      receptionDate: null,
      dateOfBirth: null,
      location: 'A-1-102',
      restrictedPatient: false,
      supportingPrisonId: undefined,
      sentenceType: SentenceType.RECALL,
    }

    // When
    const actual = toPrisonerSummary(prisoner)

    // Then
    expect(actual).toEqual(expected)
  })
})
