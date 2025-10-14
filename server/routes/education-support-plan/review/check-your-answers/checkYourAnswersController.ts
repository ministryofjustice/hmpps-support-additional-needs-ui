import { NextFunction, Request, RequestHandler, Response } from 'express'
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
    const { educationSupportPlanDto } = req.journeyData
    const { prisonNumber } = educationSupportPlanDto

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
}
