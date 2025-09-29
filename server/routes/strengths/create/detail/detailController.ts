import { NextFunction, Request, Response } from 'express'
import type { StrengthDto } from 'dto'
import StrengthIdentificationSource from '../../../../enums/strengthIdentificationSource'
import { AuditService, StrengthService } from '../../../../services'
import { Result } from '../../../../utils/result/result'
import { asArray } from '../../../../utils/utils'
import { BaseAuditData } from '../../../../services/auditService'

export default class DetailController {
  constructor(
    private readonly strengthService: StrengthService,
    private readonly auditService: AuditService,
  ) {}

  getDetailView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const { strengthDto } = req.journeyData

    const detailForm = invalidForm
      ? {
          ...invalidForm,
          howIdentified: asArray(invalidForm.howIdentified),
        }
      : this.populateFormFromDto(strengthDto)

    const viewRenderArgs = {
      form: detailForm,
      category: strengthDto.strengthTypeCode,
      errorRecordingStrength: req.flash('pageHasApiErrors')[0] != null,
    }
    return res.render('pages/strengths/detail/index', viewRenderArgs)
  }

  submitDetailForm = async (req: Request, res: Response, next: NextFunction) => {
    const detailForm = { ...req.body }
    this.updateDtoFromForm(req, detailForm)

    const { strengthDto } = req.journeyData
    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.strengthService.createStrengths(req.user.username, [strengthDto]),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('detail')
    }

    const { prisonNumber } = strengthDto
    req.journeyData.strengthDto = undefined
    this.auditService.logCreateStrength(this.createStrengthAuditData(req)) // no need to wait for response
    return res.redirectWithSuccess(`/profile/${prisonNumber}/strengths`, 'Strength added')
  }

  private populateFormFromDto = (dto: StrengthDto) => {
    return {
      description: dto.symptoms,
      howIdentified: dto.howIdentified || [],
      howIdentifiedOther: dto.howIdentifiedOther,
    }
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

  private createStrengthAuditData = (req: Request): BaseAuditData => {
    return {
      details: {},
      subjectType: 'PRISONER_ID',
      subjectId: req.params.prisonNumber,
      who: req.user?.username ?? 'UNKNOWN',
      correlationId: req.id,
    }
  }
}
