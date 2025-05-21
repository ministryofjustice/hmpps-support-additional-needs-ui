import type { PrisonerSearch } from 'viewModels'
import SupportAdditionalNeedsApiClient from '../data/supportAdditionalNeedsApiClient'
import SearchSortField from '../enums/searchSortField'
import SearchSortDirection from '../enums/searchSortDirection'
import { toPrisonerSearch } from '../data/mappers/prisonerSearchMapper'

export default class SearchService {
  constructor(private readonly supportAdditionalNeedsApiClient: SupportAdditionalNeedsApiClient) {}

  async searchPrisonersInPrison(
    prisonId: string,
    username: string,
    page: number,
    pageSize: number,
    sortBy: SearchSortField,
    sortDirection: SearchSortDirection,
    prisonerNameOrNumber?: string,
  ): Promise<PrisonerSearch> {
    return toPrisonerSearch(
      await this.supportAdditionalNeedsApiClient.getPrisonersByPrisonId(
        prisonId,
        username,
        prisonerNameOrNumber,
        page,
        pageSize,
        sortBy,
        sortDirection,
      ),
      prisonId,
    )
  }
}
