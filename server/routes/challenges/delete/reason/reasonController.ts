import { NextFunction, Request, Response } from 'express'
import type { ChallengeResponseDto } from 'dto'
import { ChallengeService } from '../../../../services'

export default class ReasonController {
  constructor(private readonly challengeService: ChallengeService) {}

  getReasonView = async (req: Request, res: Response, _next: NextFunction) => {
    const { invalidForm, prisonerSummary } = res.locals
    const challengeResponseDto = req.journeyData.challengeDto as ChallengeResponseDto

    const form = invalidForm ?? { deleteReason: '' }

    const viewRenderArgs = {
      prisonerSummary,
      mode: 'active',
      dto: challengeResponseDto,
      form,
    }

    return res.render('pages/challenges/delete/reason/index', viewRenderArgs)
  }

  submitReasonForm = async (req: Request, res: Response, _next: NextFunction) => {
    const { deleteReason } = req.body

    const challengeDto = req.journeyData.challengeDto as ChallengeResponseDto
    challengeDto.deleteReason = deleteReason
    req.journeyData.challengeDto = challengeDto

    return res.redirect('review')
  }
}
