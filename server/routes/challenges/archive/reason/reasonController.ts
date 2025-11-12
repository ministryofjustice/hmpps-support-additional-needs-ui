import { NextFunction, Request, Response } from 'express'
import type { ChallengeResponseDto } from 'dto'
import { AuditService, ChallengeService } from '../../../../services'
import { BaseAuditData } from '../../../../services/auditService'
import { Result } from '../../../../utils/result/result'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

export default class ReasonController {
  constructor(
    private readonly challengeService: ChallengeService,
    private readonly auditService: AuditService,
  ) {}

  getReasonView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm, prisonerSummary, prisonNamesById } = res.locals
    const challengeResponseDto = req.journeyData.challengeDto as ChallengeResponseDto

    const reasonForm = invalidForm ?? { archiveReason: '' }

    const viewRenderArgs = {
      prisonerSummary,
      prisonNamesById,
      mode: 'archive',
      dto: challengeResponseDto,
      form: reasonForm,
      errorRecordingChallenge: req.flash('pageHasApiErrors')[0] != null,
    }

    return res.render('pages/challenges/reason/archive-journey/index', viewRenderArgs)
  }

  submitReasonForm = async (req: Request, res: Response, next: NextFunction) => {
    const reasonForm = { ...req.body }
    this.updateDtoFromForm(req, reasonForm)

    const { activeCaseLoadId, username } = res.locals.user as PrisonUser

    const challengeResponseDto = req.journeyData.challengeDto as ChallengeResponseDto
    const { reference } = challengeResponseDto
    const challengeDto = { ...challengeResponseDto, prisonId: activeCaseLoadId }

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.challengeService.archiveChallenge(username, reference, challengeDto),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('reason')
    }

    const { prisonNumber } = challengeResponseDto
    req.journeyData.challengeDto = undefined
    this.auditService.logArchiveChallenge(this.archiveChallengeAuditData(req, challengeResponseDto)) // no need to wait for response
    return res.redirectWithSuccess(
      `/profile/${prisonNumber}/challenges#archived-challenges`,
      'Challenge moved to History',
    )
  }

  private updateDtoFromForm = (req: Request, form: { archiveReason: string }) => {
    const { challengeDto } = req.journeyData
    challengeDto.archiveReason = form.archiveReason
    req.journeyData.challengeDto = challengeDto
  }

  private archiveChallengeAuditData = (req: Request, challengeDto: ChallengeResponseDto): BaseAuditData => {
    return {
      details: {
        challengeReference: challengeDto.reference,
      },
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }
}
