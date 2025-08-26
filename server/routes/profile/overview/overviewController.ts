import { NextFunction, Request, RequestHandler, Response } from 'express'
import { Result } from '../../../utils/result/result'
import StrengthCategory from '../../../enums/strengthCategory'
import {
  getActiveChallengesFromAlnScreener,
  getActiveStrengthsFromAlnScreener,
  getLatestAlnScreener,
  getNonAlnActiveChallenges,
  getNonAlnActiveStrengths,
  reWrapRejectedPromises,
} from '../profileStrengthsFunctions'
import enumComparator from '../../enumComparator'
import ChallengeCategory from '../../../enums/challengeCategory'

export default class OverviewController {
  getOverviewView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {
      prisonerSummary,
      alnScreeners,
      conditions,
      curiousAlnAndLddAssessments,
      educationSupportPlanCreationSchedule,
      strengths,
      challenges
    } = res.locals

    let strengthCategoriesPromise: Result<Array<StrengthCategory>, Error>
    let challengeCategoriesPromise: Result<Array<ChallengeCategory>, Error>

    if (alnScreeners.isFulfilled() && strengths.isFulfilled()) {
      const nonAlnStrengths = getNonAlnActiveStrengths(strengths)
      const latestAlnScreener = getLatestAlnScreener(alnScreeners)
      const strengthsFromLatestAlnScreener = getActiveStrengthsFromAlnScreener(latestAlnScreener)
      const nonAlnChallenges = getNonAlnActiveChallenges(challenges)
      const challengesFromLatestAlnScreener = getActiveChallengesFromAlnScreener(latestAlnScreener)

      const strengthCategories = Array.from(
        new Set(nonAlnStrengths.concat(strengthsFromLatestAlnScreener).map(strength => strength.strengthCategory)),
      ).sort(enumComparator)
      strengthCategoriesPromise = Result.fulfilled(strengthCategories)

      const challengeCategories = Array.from(
        new Set(nonAlnChallenges.concat(challengesFromLatestAlnScreener).map(challenge => challenge.challengeCategory)),
      ).sort(enumComparator)
      challengeCategoriesPromise = Result.fulfilled(challengeCategories)
    } else {
      // At least one of the API calls has failed; we need data from both APIs in order to properly render the data on the overview page
      // Set the strengths and challenges result to be a rejected Result containing the error message(s) from the original rejected promise(s)
      strengthCategoriesPromise = reWrapRejectedPromises(alnScreeners, strengths)
      challengeCategoriesPromise = reWrapRejectedPromises(alnScreeners, challenges)
    }

    const viewRenderArgs = {
      prisonerSummary,
      conditions,
      educationSupportPlanCreationSchedule,
      strengthCategories: strengthCategoriesPromise,
      challengeCategories: challengeCategoriesPromise,
      curiousAlnAndLddAssessments,
      tab: 'overview',
    }
    return res.render('pages/profile/overview/index', viewRenderArgs)
  }
}
