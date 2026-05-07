import { NextFunction, Request, Response } from 'express'
import type { StrengthResponseDto } from 'dto'
import { StrengthService } from '../../../../services'

export default class ReasonController {
  constructor(private readonly strengthService: StrengthService) {}

  getReasonView = async (req: Request, res: Response, _next: NextFunction) => {
    const { invalidForm, prisonerSummary } = res.locals
    const strengthResponseDto = req.journeyData.strengthDto as StrengthResponseDto

    const form = invalidForm ?? { deleteReason: '' }

    const viewRenderArgs = {
      prisonerSummary,
      mode: 'active',
      dto: strengthResponseDto,
      form,
    }

    return res.render('pages/strengths/delete/reason/index', viewRenderArgs)
  }

  submitReasonForm = async (req: Request, res: Response, _next: NextFunction) => {
    const { deleteReason } = req.body

    const strengthDto = req.journeyData.strengthDto as StrengthResponseDto
    strengthDto.deleteReason = deleteReason
    req.journeyData.strengthDto = strengthDto

    return res.redirect('review')
  }
}
