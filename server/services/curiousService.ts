import type { CuriousAlnAndLddAssessmentsDto } from 'dto'
import { CuriousApiClient } from '../data'
import toCuriousAlnAndLddAssessmentsDto from '../data/mappers/curiousAlnAndLddAssessmentsDtoMapper'
import logger from '../../logger'

export default class CuriousService {
  constructor(private readonly curiousApiClient: CuriousApiClient) {}

  /**
   * Returns the Additional Learning Needs (ALN) and Learning Difficulties and Disabilities (LDD) assessments for a
   * given prisoner.
   */
  async getAlnAndLddAssessments(prisonNumber: string, username: string): Promise<CuriousAlnAndLddAssessmentsDto> {
    try {
      const curiousAssessments = await this.curiousApiClient.getAssessmentsByPrisonNumber(prisonNumber, username)
      return toCuriousAlnAndLddAssessmentsDto(curiousAssessments)
    } catch (e) {
      logger.error(`Error getting Curious LDD and ALN assessments for [${prisonNumber}]`, e)
      throw e
    }
  }
}
