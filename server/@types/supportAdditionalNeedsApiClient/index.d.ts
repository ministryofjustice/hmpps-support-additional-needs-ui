declare module 'supportAdditionalNeedsApiClient' {
  import { components } from '../supportAdditionalNeedsApi'

  export type AdditionalNeedsSummary = components['schemas']['AdditionalNeedsSummary']
  export type Person = components['schemas']['Person']
  export type SearchByPrisonResponse = components['schemas']['SearchByPrisonResponse']
}
