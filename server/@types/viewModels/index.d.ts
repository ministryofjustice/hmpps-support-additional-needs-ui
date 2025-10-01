declare module 'viewModels' {
  import type { PlanCreationScheduleDto } from 'dto'
  import SentenceType from '../../enums/sentenceType'
  import PlanActionStatus from '../../enums/planActionStatus'

  export interface PrisonerSummary {
    prisonNumber: string
    prisonId: string
    releaseDate?: Date
    firstName: string
    lastName: string
    receptionDate?: Date
    dateOfBirth?: Date
    location: string
    restrictedPatient?: boolean
    supportingPrisonId?: string
    sentenceType: SentenceType
  }

  export interface PrisonerSearchSummary extends PrisonerSummary {
    isInEducation: boolean
    hasAdditionalNeeds: boolean
    planStatus: PlanActionStatus
    deadlineDate?: Date
  }

  export interface PrisonerSearch {
    pagination: MojPaginationParams
    prisoners: PrisonerSearchSummary[]
  }

  export interface MojPaginationParams {
    items: {
      type?: string
      text?: string
      href?: string
      selected?: boolean
    }[]
    results?: {
      count: number
      from: number
      to: number
      text?: string
    }
    previous?: {
      text: string
      href: string
    }
    next?: {
      text: string
      href: string
    }
  }

  export interface ActionsCardParams {
    prisonerSummary: PrisonerSummary
    userHasPermissionTo: () => boolean
    educationSupportPlanCreationSchedule?: PlanCreationScheduleDto
    actionMenuType?: 'challenges' | 'strengths' | 'conditions' | 'support-strategies'
  }
}
