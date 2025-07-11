import { Router } from 'express'
import asyncMiddleware from '../../../middleware/asyncMiddleware'
import ChallengesController from './challengesController'

const challengesRoutes = (): Router => {
  const controller = new ChallengesController()

  return Router({ mergeParams: true }) //
    .get('/', [asyncMiddleware(controller.getChallengesView)])
}

export default challengesRoutes
