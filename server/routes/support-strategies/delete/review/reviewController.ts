import { NextFunction, Request, Response } from 'express'
import type { SupportStrategyResponseDto } from 'dto'
import { SupportStrategyService } from '../../../../services'

export default class ReviewController {
  constructor(private readonly supportStrategyService: SupportStrategyService) {}

  getReviewView = async (req: Request, res: Response, _next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const supportStrategyResponseDto = req.journeyData.supportStrategyDto as SupportStrategyResponseDto

    const viewRenderArgs = {
      prisonerSummary,
      mode: 'active',
      dto: supportStrategyResponseDto,
    }

    return res.render('pages/support-strategies/delete/review/index', viewRenderArgs)
  }

  submitReviewForm = async (req: Request, res: Response, _next: NextFunction) => {
    return res.redirect('confirm')
  }
}
