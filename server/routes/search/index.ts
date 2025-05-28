import { NextFunction, Request, Response, Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import SearchController from './searchController'
import SearchSortField from '../../enums/searchSortField'
import SearchSortDirection from '../../enums/searchSortDirection'
import config from '../../config'
import { Result } from '../../utils/result/result'
import { PrisonUser } from '../../interfaces/hmppsUser'

const DEFAULT_SORT_FIELD = SearchSortField.PRISONER_NAME
const DEFAULT_SORT_DIRECTION = SearchSortDirection.ASC

const searchRoutes = (services: Services): Router => {
  const router = Router({ mergeParams: true })
  const { searchService } = services
  const searchController = new SearchController()

  const performSearch = async (req: Request, res: Response, next: NextFunction) => {
    const sortOptions = ((req.query.sort as string) || `${DEFAULT_SORT_FIELD},${DEFAULT_SORT_DIRECTION}`)
      .trim()
      .split(',')
      .map(value => value.trim().toUpperCase())
    const sortField = Object.values(SearchSortField).find(value => value === sortOptions[0]) || DEFAULT_SORT_FIELD
    const sortDirection =
      Object.values(SearchSortDirection).find(value => value === sortOptions[1]) || DEFAULT_SORT_DIRECTION

    const searchTerm = (req.query.searchTerm as string) || ''
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
      ),
      apiErrorCallback,
    )
    res.locals.searchTerm = searchTerm
    res.locals.sortField = sortField
    res.locals.sortDirection = sortDirection
    res.locals.page = page

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
