import { NextFunction, Request, RequestHandler, Response } from 'express'

export default class SpecificTeachingSkillsController {
  getSpecificTeachingSkillsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals

    const specificTeachingSkillsForm = invalidForm ?? undefined // TODO - populate form from the DTO in journeyData

    const viewRenderArgs = { prisonerSummary, form: specificTeachingSkillsForm }
    return res.render('pages/education-support-plan/specific-teaching-skills/index', viewRenderArgs)
  }

  submitSpecificTeachingSkillsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    return res.redirect('exam-arrangements')
  }
}
