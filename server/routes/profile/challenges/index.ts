import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import ChallengesController from './challengesController'
import { Services } from '../../../services'

const challengesRoutes = (services: Services): Router => {
  const controller = new ChallengesController(services.challengeService)

  return Router({ mergeParams: true }) //
    .get('/', [asyncMiddleware(controller.getChallengesView)])
}

export default challengesRoutes
