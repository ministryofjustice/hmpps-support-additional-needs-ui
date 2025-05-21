declare module 'viewModels' {
  import SentenceType from '../../enums/sentenceType'

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
    hasSupportPlan: boolean
    hasSupportNeeds: boolean
  }

  export interface Pagination {
    totalElements: number
    totalPages: number
    page: number
    last: boolean
    first: boolean
    pageSize: number
  }

  export interface PrisonerSearch {
    pagination: Pagination
    prisoners: PrisonerSearchSummary[]
  }
}
