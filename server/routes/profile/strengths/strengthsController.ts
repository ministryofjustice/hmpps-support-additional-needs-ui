import { NextFunction, Request, RequestHandler, Response } from 'express'
import toGroupedStrengthsPromise from '../../utils/groupedStrengthsMapper'

export default class StrengthsController {
  getStrengthsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { alnScreeners, educationSupportPlanLifecycleStatus, prisonerSummary, prisonNamesById, strengths } =
      res.locals

    const viewRenderArgs = {
      prisonerSummary,
      prisonNamesById,
      educationSupportPlanLifecycleStatus,
      activeStrengths: toGroupedStrengthsPromise({ strengths, alnScreeners, active: true }),
      archivedStrengths: toGroupedStrengthsPromise({ strengths, alnScreeners, active: false }),
      tab: 'strengths',
    }
    return res.render('pages/profile/strengths/index', viewRenderArgs)
  }
}
