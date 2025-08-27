import { NextFunction, Request, RequestHandler, Response } from 'express'
import { Result } from '../../../utils/result/result'
import StrengthCategory from '../../../enums/strengthCategory'
import {
  getActiveStrengthsFromAlnScreener,
  getLatestAlnScreener,
  getNonAlnActiveStrengths,
} from '../profileStrengthsFunctions'
import enumComparator from '../../enumComparator'
import ChallengeCategory from '../../../enums/challengeCategory'
import { getActiveChallengesFromAlnScreener, getNonAlnActiveChallenges } from '../profileChallengesFunctions'

export default class OverviewController {
  getOverviewView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const {
      prisonerSummary,
      alnScreeners,
      conditions,
      challenges,
      curiousAlnAndLddAssessments,
      educationSupportPlanCreationSchedule,
      prisonNamesById,
      strengths,
    } = res.locals

    let strengthCategoriesPromise: Result<Array<StrengthCategory>, Error>
    let challengeCategoriesPromise: Result<Array<ChallengeCategory>, Error>

    // Set Strengths categories or passthrough error if screener or strength api call has an error
    if (alnScreeners.isFulfilled() && strengths.isFulfilled()) {
      const nonAlnStrengths = getNonAlnActiveStrengths(strengths)
      const latestAlnScreener = getLatestAlnScreener(alnScreeners)
      const strengthsFromLatestAlnScreener = getActiveStrengthsFromAlnScreener(latestAlnScreener)

      const strengthCategories = Array.from(
        new Set(nonAlnStrengths.concat(strengthsFromLatestAlnScreener).map(strength => strength.strengthCategory)),
      ).sort(enumComparator)
      strengthCategoriesPromise = Result.fulfilled(strengthCategories)
    } else {
      // At least one of the API calls has failed; we need data from all APIs in order to properly render the data on the overview page
      // Set the strength result to be a rejected Result containing the error message(s) from the original rejected promise(s)
      strengthCategoriesPromise = Result.rewrapRejected(alnScreeners, strengths)
    }

    // Set Challenges categories or passthrough error if screener or challenges api call has an error
    if (alnScreeners.isFulfilled() && challenges.isFulfilled()) {
      const latestAlnScreener = getLatestAlnScreener(alnScreeners)
      const nonAlnChallenges = getNonAlnActiveChallenges(challenges)
      const challengesFromLatestAlnScreener = getActiveChallengesFromAlnScreener(latestAlnScreener)

      const challengeCategories = Array.from(
        new Set(nonAlnChallenges.concat(challengesFromLatestAlnScreener).map(challenge => challenge.challengeCategory)),
      ).sort(enumComparator)
      challengeCategoriesPromise = Result.fulfilled(challengeCategories)
    } else {
      // At least one of the API calls has failed; we need data from all APIs in order to properly render the data on the overview page
      // Set the challenges result to be a rejected Result containing the error message(s) from the original rejected promise(s)
      challengeCategoriesPromise = Result.rewrapRejected(alnScreeners, challenges)
    }

    const viewRenderArgs = {
      prisonerSummary,
      conditions,
      educationSupportPlanCreationSchedule,
      strengthCategories: strengthCategoriesPromise,
      challengeCategories: challengeCategoriesPromise,
      curiousAlnAndLddAssessments,
      prisonNamesById,
      tab: 'overview',
    }
    return res.render('pages/profile/overview/index', viewRenderArgs)
  }
}
