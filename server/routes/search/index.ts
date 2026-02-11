import { NextFunction, Request, Response, Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import SearchController from './searchController'
import SearchSortField from '../../enums/searchSortField'
import SearchSortDirection from '../../enums/searchSortDirection'
import config from '../../config'
import { Result } from '../../utils/result/result'
import { PrisonUser } from '../../interfaces/hmppsUser'
import ApplicationAction from '../../enums/applicationAction'
import PlanActionStatus from '../../enums/planActionStatus'

const searchRoutes = (services: Services): Router => {
  const router = Router({ mergeParams: true })
  const { searchService } = services
  const searchController = new SearchController()

  const performSearch = async (req: Request, res: Response, next: NextFunction) => {
    const { defaultSortField, defaultSortDirection } = res.locals.userHasPermissionTo(
      ApplicationAction.VIEW_ELSP_DEADLINES_AND_STATUSES_ON_SEARCH,
    )
      ? { defaultSortField: SearchSortField.DEADLINE_DATE, defaultSortDirection: SearchSortDirection.ASC }
      : { defaultSortField: SearchSortField.PRISONER_NAME, defaultSortDirection: SearchSortDirection.ASC }

    const sortOptions = ((req.query.sort as string) || `${defaultSortField},${defaultSortDirection}`)
      .trim()
      .split(',')
      .map(value => value.trim().toUpperCase())

    const sortField = Object.values(SearchSortField).find(value => value === sortOptions[0]) || defaultSortField
    const sortDirection =
      Object.values(SearchSortDirection).find(value => value === sortOptions[1]) || defaultSortDirection

    const searchTerm = (req.query.searchTerm as string) || ''
    const planStatusFilter = Object.values(PlanActionStatus).find(values => values === req.query.planStatusFilter)
    const page = parseInt((req.query.page as string) || '1', 10)
    const pageSize = config.searchUiDefaultPaginationPageSize
    const { activeCaseLoadId, username } = res.locals.user as PrisonUser

    const { apiErrorCallback } = res.locals

    res.locals.searchResults = await Result.wrap(
      searchService.searchPrisonersInPrison(
        activeCaseLoadId,
        username,
        page,
        pageSize,
        sortField,
        sortDirection,
        searchTerm,
        planStatusFilter,
      ),
      apiErrorCallback,
    )
    res.locals.searchOptions = { searchTerm, planStatusFilter, sortField, sortDirection, page }

    next()
  }

  router.get('/', [
    // comment to aid formatting
    asyncMiddleware(performSearch),
    asyncMiddleware(searchController.getSearchView),
  ])

  return router
}

export default searchRoutes
