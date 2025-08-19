import { NextFunction, Request, Response } from 'express'
import type { SupportStrategyDto } from 'dto'
import { SupportStrategyService } from '../../../../services'
import { Result } from '../../../../utils/result/result'

export default class DetailController {
  constructor(private readonly supportStrategyService: SupportStrategyService) {}

  getDetailView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const { supportStrategyDto } = req.journeyData

    const detailForm = invalidForm ?? this.populateFormFromDto(supportStrategyDto)

    const viewRenderArgs = {
      form: detailForm,
      category: supportStrategyDto.supportStrategyTypeCode,
      errorRecordingSupportStrategy: req.flash('pageHasApiErrors')[0] != null,
    }
    return res.render('pages/support-strategies/detail/index', viewRenderArgs)
  }

  submitDetailForm = async (req: Request, res: Response, next: NextFunction) => {
    const detailForm = { ...req.body }
    this.updateDtoFromForm(req, detailForm)

    const { supportStrategyDto } = req.journeyData
    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.supportStrategyService.createSupportStrategies(req.user.username, [supportStrategyDto]),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('detail')
    }

    const { prisonNumber } = supportStrategyDto
    req.journeyData.supportStrategyDto = undefined
    return res.redirect(`/profile/${prisonNumber}/support-strategies`)
  }

  private populateFormFromDto = (dto: SupportStrategyDto) => {
    return {
      description: dto.supportStrategyDetails,
    }
  }

  private updateDtoFromForm = (req: Request, form: { description: string }) => {
    const { supportStrategyDto } = req.journeyData
    supportStrategyDto.supportStrategyDetails = form.description
    req.journeyData.supportStrategyDto = supportStrategyDto
  }
}
