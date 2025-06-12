import { NextFunction, Request, RequestHandler, Response } from 'express'
import { EducationSupportPlanService } from '../../../../services'
import { Result } from '../../../../utils/result/result'

export default class CheckYourAnswersController {
  constructor(private readonly educationSupportPlanService: EducationSupportPlanService) {}

  getCheckYourAnswersView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const viewRenderArgs = {
      prisonerSummary,
      dto: educationSupportPlanDto,
      errorSavingEducationSupportPlan: req.flash('pageHasApiErrors')[0] != null,
    }
    return res.render('pages/education-support-plan/check-your-answers/index', viewRenderArgs)
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

    req.journeyData.educationSupportPlanDto = undefined
    return res.redirectWithSuccess(`/profile/${prisonNumber}/overview`, 'Education support plan created')
  }
}
