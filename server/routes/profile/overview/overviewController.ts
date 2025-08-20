import { NextFunction, Request, RequestHandler, Response } from 'express'
import { Result } from '../../../utils/result/result'
import StrengthCategory from '../../../enums/strengthCategory'
import {
  getActiveStrengthsFromAlnScreener,
  getLatestAlnScreener,
  getNonAlnActiveStrengths,
  reWrapRejectedPromises,
} from '../profileStrengthsFunctions'
import enumComparator from '../../enumComparator'

export default class OverviewController {
  getOverviewView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, alnScreeners, conditions, educationSupportPlanCreationSchedule, strengths } = res.locals

    let strengthCategoriesPromise: Result<Array<StrengthCategory>, Error>
    if (alnScreeners.isFulfilled() && strengths.isFulfilled()) {
      const nonAlnStrengths = getNonAlnActiveStrengths(strengths)
      const latestAlnScreener = getLatestAlnScreener(alnScreeners)
      const strengthsFromLatestAlnScreener = getActiveStrengthsFromAlnScreener(latestAlnScreener)

      const strengthCategories = Array.from(
        new Set(nonAlnStrengths.concat(strengthsFromLatestAlnScreener).map(strength => strength.strengthCategory)),
      ).sort(enumComparator)
      strengthCategoriesPromise = Result.fulfilled(strengthCategories)
    } else {
      // At least one of the API calls has failed; we need data from both APIs in order to properly render the Strengths page
      // Set the groupedStrengths to be a rejected Result containing the error message(s) from the original rejected promise(s)
      strengthCategoriesPromise = reWrapRejectedPromises(alnScreeners, strengths)
    }

    const viewRenderArgs = {
      prisonerSummary,
      conditions,
      educationSupportPlanCreationSchedule,
      strengthCategories: strengthCategoriesPromise,
      tab: 'overview',
    }
    return res.render('pages/profile/overview/index', viewRenderArgs)
  }
}
