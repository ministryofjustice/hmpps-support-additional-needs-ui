import type { AdditionalNeedsSummary, Person } from 'supportAdditionalNeedsApiClient'
import SentenceType from '../enums/sentenceType'
import aValidAdditionalNeedsSummary from './additionalNeedsSummaryTestDataBuilder'

const aValidPerson = (
  options: {
    forename?: string
    surname?: string
    prisonNumber?: string
    dateOfBirth?: string
    sentenceType?: SentenceType
    cellLocation?: string
    releaseDate?: string
    additionalNeedsSummary?: AdditionalNeedsSummary
  } = {
    forename: 'IFEREECA',
    surname: 'PEIGH',
    prisonNumber: 'A1234BC',
    dateOfBirth: '1969-02-12',
    sentenceType: SentenceType.SENTENCED,
    cellLocation: 'A-1-102',
    releaseDate: '2025-12-31',
    additionalNeedsSummary: aValidAdditionalNeedsSummary(),
  },
): Person => ({
  ...options,
})

export default aValidPerson
