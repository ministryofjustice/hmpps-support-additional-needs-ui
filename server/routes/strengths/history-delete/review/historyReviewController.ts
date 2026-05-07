import { NextFunction, Request, Response } from 'express'
import type { StrengthResponseDto } from 'dto'
import { StrengthService } from '../../../../services'

export default class HistoryReviewController {
  constructor(private readonly strengthService: StrengthService) {}

  getReviewView = async (req: Request, res: Response, _next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const strengthResponseDto = req.journeyData.strengthDto as StrengthResponseDto

    const viewRenderArgs = {
      prisonerSummary,
      mode: 'history',
      dto: strengthResponseDto,
    }

    return res.render('pages/strengths/delete/review/index', viewRenderArgs)
  }

  submitReviewForm = async (req: Request, res: Response, _next: NextFunction) => {
    return res.redirect('confirm')
  }
}
