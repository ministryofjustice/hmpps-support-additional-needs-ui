import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto, ReviewEducationSupportPlanDto } from 'dto'
import { EducationSupportPlanService } from '../../../../services'
import { Result } from '../../../../utils/result/result'
import AuditService, { BaseAuditData } from '../../../../services/auditService'

export default class CheckYourAnswersController {
  constructor(
    private readonly educationSupportPlanService: EducationSupportPlanService,
    private readonly auditService: AuditService,
  ) {}

  getCheckYourAnswersView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { reviewEducationSupportPlanDto } = req.journeyData

    const viewRenderArgs = {
      dto: reviewEducationSupportPlanDto,
      errorSavingEducationSupportPlan: req.flash('pageHasApiErrors')[0] != null,
      mode: 'review',
    }
    return res.render('pages/education-support-plan/check-your-answers/review-journey/index', viewRenderArgs)
  }

  submitCheckYourAnswersForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { educationSupportPlanDto, reviewEducationSupportPlanDto } = req.journeyData
    const { prisonNumber } = educationSupportPlanDto

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const anyChanges = this.anyChangesToSupportPlan(reviewEducationSupportPlanDto, educationSupportPlanDto)

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.educationSupportPlanService.createEducationSupportPlan(req.user.username, educationSupportPlanDto),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('check-your-answers')
    }
    this.auditService.logReviewEducationLearnerSupportPlan(this.reviewEducationLearnerSupportPlanAuditData(req)) // no need to wait for response
    req.journeyData.educationSupportPlanDto = undefined
    req.journeyData.reviewEducationSupportPlanDto = undefined

    return res.redirectWithSuccess(`/profile/${prisonNumber}/overview`, 'Review of education support plan recorded')
  }

  private reviewEducationLearnerSupportPlanAuditData = (req: Request): BaseAuditData => {
    return {
      details: {},
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }

  /**
   * Returns 'true' if the [ReviewEducationSupportPlanDto] would result in a change to the prisoner's ELSP
   * The significant questions/sections of the ELSP are:
   *   * teaching adjustments (teachingAdjustmentsNeeded and teachingAdjustments properties)
   *   * teaching skills (specificTeachingSkillsNeeded and specificTeachingSkills properties)
   *   * exam access arrangements (examArrangementsNeeded and examArrangements properties)
   *   * LNSP support (lnspSupportNeeded, lnspSupport and lnspSupportHours properties)
   *   * Additional information (additionalInformation property)
   *
   * If any of the above properties have changed then it represents a change to the prisoner's ELSP
   */
  private anyChangesToSupportPlan = (
    reviewEducationSupportPlanDto: ReviewEducationSupportPlanDto,
    educationSupportPlanDto: EducationSupportPlanDto,
  ): boolean => {
    return (
      educationSupportPlanDto.teachingAdjustmentsNeeded !== reviewEducationSupportPlanDto.teachingAdjustmentsNeeded ||
      educationSupportPlanDto.teachingAdjustments !== reviewEducationSupportPlanDto.teachingAdjustments ||
      educationSupportPlanDto.specificTeachingSkillsNeeded !==
        reviewEducationSupportPlanDto.specificTeachingSkillsNeeded ||
      educationSupportPlanDto.specificTeachingSkills !== reviewEducationSupportPlanDto.specificTeachingSkills ||
      educationSupportPlanDto.examArrangementsNeeded !== reviewEducationSupportPlanDto.examArrangementsNeeded ||
      educationSupportPlanDto.examArrangements !== reviewEducationSupportPlanDto.examArrangements ||
      educationSupportPlanDto.lnspSupportNeeded !== reviewEducationSupportPlanDto.lnspSupportNeeded ||
      educationSupportPlanDto.lnspSupport !== reviewEducationSupportPlanDto.lnspSupport ||
      educationSupportPlanDto.lnspSupportHours !== reviewEducationSupportPlanDto.lnspSupportHours ||
      educationSupportPlanDto.additionalInformation !== reviewEducationSupportPlanDto.additionalInformation
    )
  }
}
