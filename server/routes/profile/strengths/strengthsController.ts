import { NextFunction, Request, RequestHandler, Response } from 'express'
import toGroupedStrengthsPromise from '../../utils/groupedStrengthsMapper'

export default class StrengthsController {
  getStrengthsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { alnScreeners, educationSupportPlanLifecycleStatus, prisonerSummary, prisonNamesById, strengths } =
      res.locals

    const groupedStrengthsPromise = toGroupedStrengthsPromise(strengths, alnScreeners)

    const viewRenderArgs = {
      prisonerSummary,
      prisonNamesById,
      educationSupportPlanLifecycleStatus,
      groupedStrengths: groupedStrengthsPromise,
      tab: 'strengths',
    }
    return res.render('pages/profile/strengths/index', viewRenderArgs)
  }
}
