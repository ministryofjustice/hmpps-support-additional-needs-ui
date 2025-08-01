import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { ChallengeDto } from 'dto'
import ChallengeIdentificationSource from '../../../../enums/challengeIdentificationSource'
import { Result } from '../../../../utils/result/result'
import { ChallengeService } from '../../../../services'
import { asArray } from '../../../../utils/utils'

export default class DetailController {
  constructor(private readonly challengeService: ChallengeService) {}

  getDetailView = async (req: Request, res: Response, next: NextFunction) => {
    const { invalidForm } = res.locals
    const { challengeDto } = req.journeyData

    const detailForm = invalidForm
      ? {
          ...invalidForm,
          howIdentified: asArray(invalidForm.howIdentified),
        }
      : this.populateFormFromDto(challengeDto)

    const viewRenderArgs = {
      form: detailForm,
      category: challengeDto.challengeTypeCode,
      errorRecordingChallenge: req.flash('pageHasApiErrors')[0] != null,
    }
    return res.render('pages/challenges/detail/index', viewRenderArgs)
  }

  submitDetailForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const detailsForm = { ...req.body }
    this.updateDtoFromForm(req, detailsForm)

    const { challengeDto } = req.journeyData
    const { apiErrorCallback } = res.locals
    const apiResult = await Result.wrap(
      this.challengeService.createChallenges(req.user.username, [challengeDto]),
      apiErrorCallback,
    )
    if (!apiResult.isFulfilled()) {
      req.flash('pageHasApiErrors', 'true')
      return res.redirect('detail')
    }

    const { prisonNumber } = challengeDto
    req.journeyData.challengeDto = undefined
    return res.redirectWithSuccess(`/profile/${prisonNumber}/challenges`, 'Challenge added')
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

  private populateFormFromDto = (challengeDto: ChallengeDto) => {
    return {
      description: challengeDto.symptoms,
      howIdentified: challengeDto.howIdentified || [],
      howIdentifiedOther: challengeDto.howIdentifiedOther,
    }
  }
}
