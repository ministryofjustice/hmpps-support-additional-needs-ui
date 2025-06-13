import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class OtherPeopleConsultedListController {
  getOtherPeopleConsultedListView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const viewRenderArgs = { prisonerSummary, dto: educationSupportPlanDto }
    return res.render('pages/education-support-plan/other-people-consulted/people-consulted-list/index', viewRenderArgs)
  }

  submitOtherPeopleConsultedListForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const submitToCheckYourAnswersQueryString =
      req.query?.submitToCheckAnswers === 'true' ? '?submitToCheckAnswers=true' : ''

    if (req.userClickedOnButton('addPerson')) {
      return res.redirect(`add-person${submitToCheckYourAnswersQueryString}`)
    }

    if (req.userClickedOnButton('removePerson')) {
      const personIndexToRemove = req.body.removePerson as number
      const numberOfPeopleOnDto = this.updateDtoWithRemovedPerson(req, personIndexToRemove)
      return res.redirect(
        numberOfPeopleOnDto >= 1
          ? `list${submitToCheckYourAnswersQueryString}`
          : `../other-people-consulted${submitToCheckYourAnswersQueryString}`,
      )
    }

    return res.redirect(
      req.query?.submitToCheckAnswers !== 'true' ? '../review-needs-conditions-and-strengths' : '../check-your-answers',
    )
  }

  private updateDtoWithRemovedPerson = (req: Request, personIndexToRemove: number): number => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.otherPeopleConsulted.splice(personIndexToRemove, 1)
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
    return educationSupportPlanDto.otherPeopleConsulted.length
  }
}
