import { Router } from 'express'
import { Services } from '../../services'
import asyncMiddleware from '../../middleware/asyncMiddleware'
import SearchController from './searchController'

const searchRoutes = (_services: Services): Router => {
  const router = Router({ mergeParams: true })
  const searchController = new SearchController()

  router.get('/', [asyncMiddleware(searchController.getSearchView)])

  return router
}

export default searchRoutes
