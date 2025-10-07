import type {
  ChallengeDto,
  EducationSupportPlanDto,
  ReviewEducationSupportPlanDto,
  StrengthDto,
  SupportStrategyDto,
  RefuseEducationSupportPlanDto,
  AlnScreenerDto,
} from 'dto'
import { HmppsUser } from '../../interfaces/hmppsUser'

export declare module 'express-session' {
  // Declare that the session will potentially contain these additional fields
  interface SessionData {
    returnTo: string
    nowInMinutes: number
  }
}

export declare global {
  namespace Express {
    interface User {
      username: string
      token: string
      authSource: string
    }

    interface JourneyData {
      educationSupportPlanDto?: EducationSupportPlanDto
      reviewEducationSupportPlanDto?: ReviewEducationSupportPlanDto
      refuseEducationSupportPlanDto?: RefuseEducationSupportPlanDto
      challengeDto?: ChallengeDto
      conditionsList?: ConditionsList
      strengthDto?: StrengthDto
      supportStrategyDto?: SupportStrategyDto
      alnScreenerDto?: AlnScreenerDto
    }

    interface Response {
      redirectWithSuccess?(path: string, message: string): void
      redirectWithErrors?(path: string, message: Record<string, string>[]): void
    }

    interface Request {
      verified?: boolean
      id: string
      journeyData: JourneyData
      logout(done: (err: unknown) => void): void
      userClickedOnButton(buttonName: string): boolean
    }

    interface Locals {
      user: HmppsUser
    }
  }
}
