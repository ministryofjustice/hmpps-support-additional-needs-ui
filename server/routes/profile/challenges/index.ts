import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import ChallengesController from './challengesController'
import { Services } from '../../../services'
import retrieveCurrentChallenges from '../middleware/retrieveCurrentChallenges'

const challengesRoutes = (services: Services): Router => {
  const controller = new ChallengesController()

  return Router({ mergeParams: true }) //
    .get('/', [retrieveCurrentChallenges(services.challengeService), asyncMiddleware(controller.getChallengesView)])
}

export default challengesRoutes
