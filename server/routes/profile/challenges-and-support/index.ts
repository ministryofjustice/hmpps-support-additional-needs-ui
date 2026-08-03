import { Router } from 'express'
import { Services } from '../../../services'
import ChallengesAndSupportController from './challengesAndSupportController'
import asyncMiddleware from '../../../middleware/asyncMiddleware'

const challengesAndSupportRoutes = (_services: Services): Router => {
  const controller = new ChallengesAndSupportController()

  return Router({ mergeParams: true }) //
    .get('/', [asyncMiddleware(controller.getChallengesAndSupportView)])
}

export default challengesAndSupportRoutes
