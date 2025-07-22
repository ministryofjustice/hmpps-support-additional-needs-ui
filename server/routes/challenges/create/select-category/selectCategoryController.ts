import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ChallengeDto } from 'dto'
import ChallengeType from '../../../../enums/challengeType'

export default class SelectCategoryController {
  populateFormFromDto = (challengeDto: ChallengeDto) => {
    return {
      category: challengeDto?.challengeTypeCode,
    }
  }

  getSelectCategoryView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const { challengeDto } = req.journeyData || {}
    const selectCategoryForm = invalidForm ?? this.populateFormFromDto(challengeDto)

    const viewRenderArgs = { form: selectCategoryForm }
    return res.render('pages/challenges/select-category/index', viewRenderArgs)
  }

  submitSelectCategoryForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const selectCategoryForm = { ...req.body }
    this.updateDtoFromForm(req, selectCategoryForm)

    return res.redirect('detail')
  }

  updateDtoFromForm = (req: Request, form: { category: ChallengeType }) => {
    const { challengeDto } = req.journeyData
    challengeDto.challengeTypeCode = form.category
    req.journeyData.challengeDto = challengeDto
  }
}
