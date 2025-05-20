import { SuperAgentRequest } from 'superagent'
import stubPing from './common'
import { stubFor } from './wiremock'
import SentenceType from '../../server/enums/sentenceType'

const stubSearchByPrison = (prisonId = 'BXI'): SuperAgentRequest =>
  stubFor({
    request: {
      method: 'GET',
      urlPattern: `/search/prisons/${prisonId}/people`,
    },
    response: {
      status: 200,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8',
      },
      jsonBody: {
        pagination: {
          totalElements: 1,
          totalPages: 1,
          page: 1,
          last: true,
          first: true,
          pageSize: 50,
        },
        people: [
          {
            forename: 'IFEREECA',
            surname: 'PEIGH',
            prisonNumber: 'A1234BC',
            dateOfBirth: '1969-02-12',
            sentenceType: SentenceType.SENTENCED,
            cellLocation: 'A-1-102',
            releaseDate: '2025-12-31',
            additionalNeedsSummary: {
              hasConditions: true,
              hasChallenges: true,
              hasStrengths: true,
              hasSupportRecommendations: true,
            },
          },
        ],
      },
    },
  })

export default {
  stubSearchByPrison,
  stubSupportAdditionalNeedsApiPing: stubPing('support-additional-needs-api'),
}
