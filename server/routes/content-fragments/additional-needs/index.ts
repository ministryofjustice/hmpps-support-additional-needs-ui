import { Router } from 'express'
import { Services } from '../../../services'
import AdditionalNeedsContentFragmentController from './additionalNeedsContentFragmentController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import retrieveAdditionalNeedsFactors from '../../middleware/retrieveAdditionalNeedsFactors'

const additionalNeedsContentFragmentRoutes = (services: Services): Router => {
  const { additionalNeedsService } = services
  const router = Router({ mergeParams: true })

  const additionalNeedsContentFragmentController = new AdditionalNeedsContentFragmentController()

  router.get('/', [
    retrieveAdditionalNeedsFactors(additionalNeedsService),
    asyncMiddleware(additionalNeedsContentFragmentController.getAdditionalNeedsContentFragment),
  ])

  return router
}

export default additionalNeedsContentFragmentRoutes
