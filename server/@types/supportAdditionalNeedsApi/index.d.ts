/**
 * This file was auto-generated by openapi-typescript.
 * Do not make direct changes to the file.
 */

export interface paths {
  '/search/prisons/{prisonId}/people': {
    parameters: {
      query?: never
      header?: never
      path?: never
      cookie?: never
    }
    get: operations['searchByPrison']
    put?: never
    post?: never
    delete?: never
    options?: never
    head?: never
    patch?: never
    trace?: never
  }
}
export type webhooks = Record<string, never>
export interface components {
  schemas: {
    AdditionalNeedsSummary: {
      /**
       * @description Whether this person has any Conditions recorded in the service.
       * @example true
       */
      hasConditions: boolean
      /**
       * @description Whether this person has any Challenges recorded in the service.
       * @example true
       */
      hasChallenges: boolean
      /**
       * @description Whether this person has any Strengths recorded in the service.
       * @example true
       */
      hasStrengths: boolean
      /**
       * @description Whether this person has any Support Recommendations recorded in the service.
       * @example true
       */
      hasSupportRecommendations: boolean
    }
    PaginationMetaData: {
      /**
       * Format: int32
       * @description Total number of elements matching the criteria
       * @example 100
       */
      totalElements: number
      /**
       * Format: int32
       * @description Total number of pages
       * @example 5
       */
      totalPages: number
      /**
       * Format: int32
       * @description Current page number
       * @example 2
       */
      page: number
      /**
       * @description Indicates this is the last page
       * @example false
       */
      last: boolean
      /**
       * @description Indicates this is the first page
       * @example false
       */
      first: boolean
      /**
       * Format: int32
       * @description Number of items per page
       * @example 20
       */
      pageSize: number
    }
    Person: {
      /**
       * @description The prisoner's forename.
       * @example Bob
       */
      forename: string
      /**
       * @description The prisoner's surname.
       * @example Smith
       */
      surname: string
      /**
       * @description The prisoner's NOMIS number.
       * @example A1234BC
       */
      prisonNumber: string
      /**
       * Format: date
       * @description The prisoner's date of birth.
       * @example 1999-12-01
       */
      dateOfBirth: string
      /**
       * @description The prisoner's sentence type.
       * @example null
       * @enum {string}
       */
      sentenceType:
        | 'RECALL'
        | 'DEAD'
        | 'INDETERMINATE_SENTENCE'
        | 'SENTENCED'
        | 'CONVICTED_UNSENTENCED'
        | 'CIVIL_PRISONER'
        | 'IMMIGRATION_DETAINEE'
        | 'REMAND'
        | 'UNKNOWN'
        | 'OTHER'
      /**
       * @description The prisoner's cell location within prison
       * @example B-3-047
       */
      cellLocation?: string
      /**
       * Format: date
       * @description The prisoner's release date as returned by prisoner-search-api.
       * @example 2035-11-01
       */
      releaseDate?: string
      /**
       * @description Optional object containing summary data held in this service about the person.   The object is only populated if the person has Additional Needs data in this service.   If the person does not yet have any data recorded in this service this field will be null.
       * @example null
       */
      additionalNeeds?: components['schemas']['AdditionalNeedsSummary']
    }
    SearchByPrisonResponse: {
      /** @example null */
      pagination: components['schemas']['PaginationMetaData']
      /**
       * @description A List containing zero or more people matching the search.
       * @example null
       */
      people: components['schemas']['Person'][]
    }
  }
  responses: never
  parameters: never
  requestBodies: never
  headers: never
  pathItems: never
}
export type $defs = Record<string, never>
export interface operations {
  searchByPrison: {
    parameters: {
      query?: {
        prisonerNameOrNumber?: string
        sortBy?: 'PRISONER_NAME' | 'PRISON_NUMBER' | 'CELL_LOCATION' | 'RELEASE_DATE'
        sortDirection?: 'ASC' | 'DESC'
        page?: number
        pageSize?: number
      }
      header?: never
      path: {
        prisonId: string
      }
      cookie?: never
    }
    requestBody?: never
    responses: {
      /** @description OK */
      200: {
        headers: {
          [name: string]: unknown
        }
        content: {
          '*/*': components['schemas']['SearchByPrisonResponse']
        }
      }
    }
  }
}
