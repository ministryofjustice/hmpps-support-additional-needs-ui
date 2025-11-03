import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { StrengthResponseDto } from 'dto'
import StrengthIdentificationSource from '../../../../enums/strengthIdentificationSource'
import { Result } from '../../../../utils/result/result'
import { AuditService, StrengthService } from '../../../../services'
import { asArray } from '../../../../utils/utils'
import { BaseAuditData } from '../../../../services/auditService'
import { PrisonUser } from '../../../../interfaces/hmppsUser'

export default class DetailController {
  constructor(
    private readonly strengthService: StrengthService,
    private readonly auditService: AuditService,
  ) {}

  getDetailView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const strengthDto = req.journeyData.strengthDto as StrengthResponseDto

    const detailForm = invalidForm
      ? {
          ...invalidForm,
          howIdentified: asArray(invalidForm.howIdentified),
        }
      : this.populateFormFromDto(strengthDto)

    const viewRenderArgs = {
      form: detailForm,
      category: strengthDto.strengthTypeCode,
      mode: 'edit',
      errorRecordingStrength: req.flash('pageHasApiErrors')[0] != null,
    }
    return res.render('pages/strengths/detail/edit-journey/index', viewRenderArgs)
  }

  submitDetailForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const detailsForm = { ...req.body }
    this.updateDtoFromForm(req, detailsForm)

    const { activeCaseLoadId, username } = res.locals.user as PrisonUser

    const strengthResponseDto = req.journeyData.strengthDto as StrengthResponseDto
    const { reference } = strengthResponseDto
    const strengthDto = { ...strengthResponseDto, prisonId: activeCaseLoadId }

    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.strengthService.updateStrength(username, reference, strengthDto),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('detail')
    }

    const { prisonNumber } = strengthResponseDto
    req.journeyData.strengthDto = undefined
    this.auditService.logEditStrength(this.editStrengthsAuditData(req, strengthResponseDto)) // no need to wait for response
    return res.redirectWithSuccess(`/profile/${prisonNumber}/strengths`, 'Strength updated')
  }

  private updateDtoFromForm = (
    req: Request,
    form: { description: string; howIdentified: Array<StrengthIdentificationSource>; howIdentifiedOther?: string },
  ) => {
    const { strengthDto } = req.journeyData
    strengthDto.symptoms = form.description
    strengthDto.howIdentified = form.howIdentified
    strengthDto.howIdentifiedOther = form.howIdentifiedOther
    req.journeyData.strengthDto = strengthDto
  }

  private populateFormFromDto = (strengthDto: StrengthResponseDto) => {
    return {
      description: strengthDto.symptoms,
      howIdentified: strengthDto.howIdentified || [],
      howIdentifiedOther: strengthDto.howIdentifiedOther,
    }
  }

  private editStrengthsAuditData = (req: Request, strengthDto: StrengthResponseDto): BaseAuditData => {
    return {
      details: {
        strengthReference: strengthDto.reference,
      },
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }
}
