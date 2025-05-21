import { NextFunction, Request, Response, Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import SearchController from './searchController'
import SearchSortField from '../../enums/searchSortField'
import SearchSortDirection from '../../enums/searchSortDirection'
import config from '../../config'
import { Result } from '../../utils/result/result'

const DEFAULT_SORT_FIELD = SearchSortField.PRISONER_NAME
const DEFAULT_SORT_DIRECTION = SearchSortDirection.ASC

const searchRoutes = (services: Services): Router => {
  const router = Router({ mergeParams: true })
  const { searchService } = services
  const searchController = new SearchController()

  const performSearch = async (req: Request, res: Response, next: NextFunction) => {
    const searchTerm = (req.query.searchTerm as string) || ''
    const sortField = (req.query.sortField as SearchSortField) || DEFAULT_SORT_FIELD
    const sortDirection = (req.query.sortDirection as SearchSortDirection) || DEFAULT_SORT_DIRECTION
    const page = parseInt((req.query.page as string) || '1', 10)
    const pageSize = config.searchUiDefaultPaginationPageSize
    const { activeCaseLoadId, username } = res.locals.user

    res.locals = {
      ...res.locals,
      searchResults: await Result.wrap(
        searchService.searchPrisonersInPrison(
          activeCaseLoadId,
          username,
          page,
          pageSize,
          sortField,
          sortDirection,
          searchTerm,
        ),
      ),
      searchTerm,
      sortField,
      sortDirection,
    }
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
