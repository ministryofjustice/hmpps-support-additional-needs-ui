import { NextFunction, Request, Response } from 'express'
import type { ChallengeResponseDto } from 'dto'
import { AuditService, ChallengeService } from '../../../../services'
import { BaseAuditData } from '../../../../services/auditService'
import { Result } from '../../../../utils/result/result'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

export default class ConfirmController {
  constructor(
    private readonly challengeService: ChallengeService,
    private readonly auditService: AuditService,
  ) {}

  getConfirmView = async (req: Request, res: Response, _next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const challengeResponseDto = req.journeyData.challengeDto as ChallengeResponseDto

    const viewRenderArgs = {
      prisonerSummary,
      mode: 'active',
      dto: challengeResponseDto,
    }

    return res.render('pages/challenges/delete/confirm/index', viewRenderArgs)
  }

  submitConfirmForm = async (req: Request, res: Response, _next: NextFunction) => {
    const { activeCaseLoadId, username } = res.locals.user as PrisonUser
    const dto = req.journeyData.challengeDto as ChallengeResponseDto
    const { reference, prisonNumber, deleteReason } = dto

    const { apiErrorCallback } = res.locals
    const result = await Result.wrap(
      this.challengeService.deleteChallenge(username, prisonNumber, reference, activeCaseLoadId, deleteReason),
      apiErrorCallback,
    )
    if (!result.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('confirm')
    }

    req.journeyData.challengeDto = undefined
    this.auditService.logDeleteChallenge(this.deleteChallengeAuditData(req, dto))
    return res.redirectWithSuccess(`/profile/${prisonNumber}/challenges#current-challenges`, 'Challenge deleted.')
  }

  private deleteChallengeAuditData = (req: Request, dto: ChallengeResponseDto): BaseAuditData => {
    return {
      details: {
        challengeReference: dto.reference,
        mode: 'active',
      },
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }
}
