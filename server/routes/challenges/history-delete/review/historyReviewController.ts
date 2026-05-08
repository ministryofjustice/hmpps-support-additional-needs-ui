import { NextFunction, Request, Response } from 'express'
import type { ChallengeResponseDto } from 'dto'
import { ChallengeService } from '../../../../services'

export default class HistoryReviewController {
  constructor(private readonly challengeService: ChallengeService) {}

  getReviewView = async (req: Request, res: Response, _next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const challengeResponseDto = req.journeyData.challengeDto as ChallengeResponseDto

    const viewRenderArgs = {
      prisonerSummary,
      mode: 'history',
      dto: challengeResponseDto,
    }

    return res.render('pages/challenges/delete/review/index', viewRenderArgs)
  }

  submitReviewForm = async (req: Request, res: Response, _next: NextFunction) => {
    return res.redirect('confirm')
  }
}
