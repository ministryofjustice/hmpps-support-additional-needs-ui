import { NextFunction, Request, Response } from 'express'
import type { ScreenerDeletionDto } from 'dto'
import { AdditionalLearningNeedsScreenerService, AuditService } from '../../../../services'
import { BaseAuditData } from '../../../../services/auditService'
import { Result } from '../../../../utils/result/result'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

export default class ConfirmController {
  constructor(
    private readonly alnScreenerService: AdditionalLearningNeedsScreenerService,
    private readonly auditService: AuditService,
  ) {}

  getConfirmView = async (req: Request, res: Response, _next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const dto = req.journeyData.screenerDeletionDto as ScreenerDeletionDto

    const viewRenderArgs = {
      prisonerSummary,
      dto,
      errorDeletingScreener: req.flash('pageHasApiErrors')[0] != null,
    }

    return res.render('pages/additional-learning-needs-screener/delete/confirm/index', viewRenderArgs)
  }

  submitConfirmForm = async (req: Request, res: Response, _next: NextFunction) => {
    const { activeCaseLoadId, username } = res.locals.user as PrisonUser
    const dto = req.journeyData.screenerDeletionDto as ScreenerDeletionDto
    const { prisonNumber, deleteReason, returnTo } = dto

    const { apiErrorCallback } = res.locals
    const result = await Result.wrap(
      this.alnScreenerService.deleteLatestScreener(username, prisonNumber, activeCaseLoadId, deleteReason),
      apiErrorCallback,
    )
    if (!result.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('confirm')
    }

    req.journeyData.screenerDeletionDto = undefined
    this.auditService.logDeleteAlnScreener(this.deleteAlnScreenerAuditData(req, dto))
    return res.redirectWithSuccess(returnTo ?? `/profile/${prisonNumber}/overview`, 'Screener results deleted.')
  }

  private deleteAlnScreenerAuditData = (req: Request, dto: ScreenerDeletionDto): BaseAuditData => {
    return {
      details: {
        screenerReference: dto.latestScreener?.reference,
        screenerDate: dto.latestScreener?.screenerDate,
      },
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }
}
