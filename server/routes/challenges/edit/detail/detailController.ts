import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ChallengeResponseDto } from 'dto'
import ChallengeIdentificationSource from '../../../../enums/challengeIdentificationSource'
import { Result } from '../../../../utils/result/result'
import { AuditService, ChallengeService } from '../../../../services'
import { asArray } from '../../../../utils/utils'
import { BaseAuditData } from '../../../../services/auditService'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

export default class DetailController {
  constructor(
    private readonly challengeService: ChallengeService,
    private readonly auditService: AuditService,
  ) {}

  getDetailView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const challengeDto = req.journeyData.challengeDto as ChallengeResponseDto

    const detailForm = invalidForm
      ? {
          ...invalidForm,
          howIdentified: asArray(invalidForm.howIdentified),
        }
      : this.populateFormFromDto(challengeDto)

    const viewRenderArgs = {
      form: detailForm,
      category: challengeDto.challengeTypeCode,
      mode: 'edit',
      errorRecordingChallenge: req.flash('pageHasApiErrors')[0] != null,
    }
    return res.render('pages/challenges/detail/edit-journey/index', viewRenderArgs)
  }

  submitDetailForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const detailsForm = { ...req.body }
    this.updateDtoFromForm(req, detailsForm)

    const { activeCaseLoadId, username } = res.locals.user as PrisonUser

    const challengeResponseDto = req.journeyData.challengeDto as ChallengeResponseDto
    const { reference } = challengeResponseDto
    const challengeDto = { ...challengeResponseDto, prisonId: activeCaseLoadId }

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.challengeService.updateChallenge(username, reference, challengeDto),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('detail')
    }

    const { prisonNumber } = challengeResponseDto
    req.journeyData.challengeDto = undefined
    this.auditService.logEditChallenge(this.editChallengesAuditData(req, challengeResponseDto)) // no need to wait for response
    return res.redirectWithSuccess(`/profile/${prisonNumber}/challenges`, 'Challenge updated')
  }

  private updateDtoFromForm = (
    req: Request,
    form: { description: string; howIdentified: Array<ChallengeIdentificationSource>; howIdentifiedOther?: string },
  ) => {
    const { challengeDto } = req.journeyData
    challengeDto.symptoms = form.description
    challengeDto.howIdentified = form.howIdentified
    challengeDto.howIdentifiedOther = form.howIdentifiedOther
    req.journeyData.challengeDto = challengeDto
  }

  private populateFormFromDto = (challengeDto: ChallengeResponseDto) => {
    return {
      description: challengeDto.symptoms,
      howIdentified: challengeDto.howIdentified || [],
      howIdentifiedOther: challengeDto.howIdentifiedOther,
    }
  }

  private editChallengesAuditData = (req: Request, challengeDto: ChallengeResponseDto): BaseAuditData => {
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
