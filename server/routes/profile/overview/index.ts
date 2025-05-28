import { Router } from 'express'
import { Services } from '../../../services'
import OverviewController from './overviewController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'

const overviewRoute = (_services: Services): Router => {
  const controller = new OverviewController()
  return Router({ mergeParams: true }) //
    .get('/', [asyncMiddleware(controller.getOverviewView)])
}

export default overviewRoute
