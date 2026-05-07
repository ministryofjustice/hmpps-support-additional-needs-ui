import { NextFunction, Request, Response } from 'express'
import type { SupportStrategyResponseDto } from 'dto'
import { SupportStrategyService } from '../../../../services'

export default class ReasonController {
  constructor(private readonly supportStrategyService: SupportStrategyService) {}

  getReasonView = async (req: Request, res: Response, _next: NextFunction) => {
    const { invalidForm, prisonerSummary } = res.locals
    const supportStrategyResponseDto = req.journeyData.supportStrategyDto as SupportStrategyResponseDto

    const form = invalidForm ?? { deleteReason: '' }

    const viewRenderArgs = {
      prisonerSummary,
      mode: 'active',
      dto: supportStrategyResponseDto,
      form,
    }

    return res.render('pages/support-strategies/delete/reason/index', viewRenderArgs)
  }

  submitReasonForm = async (req: Request, res: Response, _next: NextFunction) => {
    const { deleteReason } = req.body

    const supportStrategyDto = req.journeyData.supportStrategyDto as SupportStrategyResponseDto
    supportStrategyDto.deleteReason = deleteReason
    req.journeyData.supportStrategyDto = supportStrategyDto

    return res.redirect('review')
  }
}
