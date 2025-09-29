import { NextFunction, Request, Response } from 'express'
import type { ReferenceDataItemDto } from 'dto'
import { asArray } from '../../../../utils/utils'
import { AdditionalLearningNeedsScreenerService } from '../../../../services'
import { Result } from '../../../../utils/result/result'
import AuditService, { BaseAuditData } from '../../../../services/auditService'

export default class CheckYourAnswersController {
  constructor(
    private readonly alnService: AdditionalLearningNeedsScreenerService,
    private readonly auditService: AuditService,
  ) {}

  getCheckYourAnswersView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm, challengesReferenceData, strengthsReferenceData } = res.locals
    const { alnScreenerDto } = req.journeyData

    const checkYourAnswersForm = invalidForm ?? { screenerInformationIsCorrect: null }

    const viewRenderArgs = {
      screenerDate: alnScreenerDto.screenerDate,
      challenges: mapSelectedTypesToCategories(alnScreenerDto.challenges, challengesReferenceData),
      strengths: mapSelectedTypesToCategories(alnScreenerDto.strengths, strengthsReferenceData),
      form: checkYourAnswersForm,
      errorRecordingAlnScreener: req.flash('pageHasApiErrors')[0] != null,
    }
    return res.render('pages/additional-learning-needs-screener/check-your-answers/index', viewRenderArgs)
  }

  submitCheckYourAnswersForm = async (req: Request, res: Response, next: NextFunction) => {
    const { alnScreenerDto } = req.journeyData
    const { prisonNumber } = alnScreenerDto

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.alnService.recordAlnScreener(req.user.username, alnScreenerDto),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('check-your-answers')
    }

    req.journeyData.alnScreenerDto = undefined
    this.auditService.logRecordAlnScreener(this.createRecordAlnScreenerAuditData(req)) // no need to wait for response
    return res.redirect(`/profile/${prisonNumber}/overview`)
  }

  private createRecordAlnScreenerAuditData = (req: Request): BaseAuditData => {
    return {
      details: {},
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }
}

/**
 * Given an array of values representing the challenge or strength types entered by the user, and the corresponding
 * reference data (eg: challenges or strengths ref data); returns an object where each key is a category, and the value
 * is an array of the relevant types from the function argument.
 *
 * EG: where the array of values representing the challenge types entered is:
 *    ['WRITING', 'PROBLEM_SOLVING', 'READING_EMOTIONS', 'EMPATHY']
 * and the reference data is the Challenges reference data, the expected output is:
 *    {
 *      LITERACY_SKILLS:
 *        ['WRITING'],
 *      ATTENTION_ORGANISING_TIME:
 *        ['PROBLEM_SOLVING'],
 *      EMOTIONS_FEELINGS:
 *        ['READING_EMOTIONS','EMPATHY'],
 *    }
 *
 * The resultant object only contains keys (categories) where there are matching types. It will not return a key with
 * an empty array.
 */
export const mapSelectedTypesToCategories = (
  selectedTypes: Array<string>,
  referenceData: Record<string, Array<ReferenceDataItemDto>>,
): Record<string, Array<string>> => {
  return Object.entries(referenceData)
    .flatMap(([key, values]) => [
      key,
      values
        .map(referenceDataItem => {
          const referenceDataItemType = referenceDataItem.code
          return (selectedTypes || []).includes(referenceDataItemType) ? referenceDataItemType : null
        })
        .filter(referenceDataItem => referenceDataItem != null),
    ])
    .reduce<Record<string, Array<string>>>((acc, key, idx, source) => {
      if (idx % 2 === 0) {
        const value = asArray(source[idx + 1])
        if (value.length > 0) {
          acc[key as string] = value
        }
      }
      return acc
    }, {})
}
