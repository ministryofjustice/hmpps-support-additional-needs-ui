import { NextFunction, Request, Response } from 'express'
import type { StrengthResponseDto } from 'dto'
import { AuditService, StrengthService } from '../../../../services'
import { BaseAuditData } from '../../../../services/auditService'
import { Result } from '../../../../utils/result/result'
import { PrisonUser } from '../../../../interfaces/hmppsUser'
import {
  clearRedirectPendingFlag,
  setRedirectPendingFlag,
} from '../../../middleware/checkRedirectAtEndOfJourneyIsNotPending'

export default class ConfirmController {
  constructor(
    private readonly strengthService: StrengthService,
    private readonly auditService: AuditService,
  ) {}

  getConfirmView = async (req: Request, res: Response, _next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const strengthResponseDto = req.journeyData.strengthDto as StrengthResponseDto

    clearRedirectPendingFlag(req)

    const viewRenderArgs = {
      prisonerSummary,
      mode: 'active',
      dto: strengthResponseDto,
    }

    return res.render('pages/strengths/delete/confirm/index', viewRenderArgs)
  }

  submitConfirmForm = async (req: Request, res: Response, _next: NextFunction) => {
    const { activeCaseLoadId, username } = res.locals.user as PrisonUser
    const dto = req.journeyData.strengthDto as StrengthResponseDto
    const { reference, prisonNumber, deleteReason } = dto

    const { apiErrorCallback } = res.locals
    const result = await Result.wrap(
      this.strengthService.deleteStrength(username, prisonNumber, reference, activeCaseLoadId, deleteReason),
      apiErrorCallback,
    )
    if (!result.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('confirm')
    }

    req.journeyData.strengthDto = undefined
    this.auditService.logDeleteStrength(this.deleteStrengthAuditData(req, dto))
    setRedirectPendingFlag(req)
    return res.redirectWithSuccess(
      `/profile/${prisonNumber}/strengths#current-strengths`,
      'Strength or interest deleted',
    )
  }

  private deleteStrengthAuditData = (req: Request, dto: StrengthResponseDto): BaseAuditData => {
    return {
      details: {
        strengthReference: dto.reference,
        mode: 'active',
      },
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }
}
