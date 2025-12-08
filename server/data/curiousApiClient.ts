import type { AuthenticationClient } from '@ministryofjustice/hmpps-auth-clients'
import type { AllAssessmentDTO } from 'curiousApiClient'
import { asSystem, RestClient } from '@ministryofjustice/hmpps-rest-client'
import restClientErrorHandler from './restClientErrorHandler'
import config from '../config'
import logger from '../../logger'

export default class CuriousApiClient extends RestClient {
  constructor(authenticationClient: AuthenticationClient) {
    super('Curious API Client', config.apis.curious, logger, authenticationClient)
  }

  async getAssessmentsByPrisonNumber(prisonNumber: string, username: string): Promise<AllAssessmentDTO> {
    return this.get<AllAssessmentDTO>(
      {
        path: `/learnerAssessments/v2/${prisonNumber}`,
        errorHandler: restClientErrorHandler({ ignore404: true }),
      },
      asSystem(username),
    )
  }
}
