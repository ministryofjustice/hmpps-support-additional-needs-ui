import { NextFunction, Request, Response } from 'express'
import type { ConditionDto } from 'dto'
import { ConditionService } from '../../../../services'

export default class ReviewController {
  constructor(private readonly conditionService: ConditionService) {}

  getReviewView = async (req: Request, res: Response, _next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const conditionDto = req.journeyData.conditionDto as ConditionDto

    const viewRenderArgs = {
      prisonerSummary,
      mode: 'active',
      dto: conditionDto,
    }

    return res.render('pages/conditions/delete/review/index', viewRenderArgs)
  }

  submitReviewForm = async (req: Request, res: Response, _next: NextFunction) => {
    return res.redirect('confirm')
  }
}
