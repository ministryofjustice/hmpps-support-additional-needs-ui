import { NextFunction, Request, Response } from 'express'
import { format, parse } from 'date-fns'
import type { AlnScreenerDto } from 'dto'

export default class ScreenerDateController {
  getScreenerDateView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const { alnScreenerDto } = req.journeyData

    const screenerDateForm = invalidForm ?? this.populateFormFromDto(alnScreenerDto)

    const viewRenderArgs = { form: screenerDateForm }
    return res.render('pages/additional-learning-needs-screener/screener-date/index', viewRenderArgs)
  }

  submitScreenerDateView = async (req: Request, res: Response, next: NextFunction) => {
    const screenerDateForm = { ...req.body }
    this.updateDtoFromForm(req, screenerDateForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'add-challenges' : 'check-your-answers')
  }

  private populateFormFromDto = (dto: AlnScreenerDto) => {
    if (dto.screenerDate == null) {
      return {}
    }
    return {
      screenerDate: format(dto.screenerDate, 'd/M/yyyy'),
    }
  }

  private updateDtoFromForm = (req: Request, form: { screenerDate: string }) => {
    const { alnScreenerDto } = req.journeyData
    alnScreenerDto.screenerDate = parse(form.screenerDate, 'd/M/yyyy', new Date())
    req.journeyData.educationSupportPlanDto = alnScreenerDto
  }
}
