import { NextFunction, Request, Response } from 'express'
import type { AlnScreenerDto } from 'dto'
import ChallengeType from '../../../../enums/challengeType'
import { asArray } from '../../../../utils/utils'

export default class AddChallengesController {
  getAddChallengesView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const { alnScreenerDto } = req.journeyData

    const addChallengesForm = invalidForm
      ? {
          ...invalidForm,
          challengeTypeCodes: asArray(invalidForm.challengeTypeCodes),
        }
      : this.populateFormFromDto(alnScreenerDto)

    const viewRenderArgs = { form: addChallengesForm }
    return res.render('pages/additional-learning-needs-screener/add-challenges/index', viewRenderArgs)
  }

  submitAddChallengesForm = async (req: Request, res: Response, next: NextFunction) => {
    const addChallengesForm = { ...req.body }
    this.updateDtoFromForm(req, addChallengesForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'add-strengths' : 'check-your-answers')
  }

  private populateFormFromDto = (dto: AlnScreenerDto) => {
    return {
      challengeTypeCodes: dto.challenges ?? [],
    }
  }

  private updateDtoFromForm = (req: Request, form: { challengeTypeCodes: Array<ChallengeType> }) => {
    const { alnScreenerDto } = req.journeyData
    alnScreenerDto.challenges = form.challengeTypeCodes
    req.journeyData.educationSupportPlanDto = alnScreenerDto
  }
}
