import { Router } from 'express'
import { Services } from '../../services'
import createChallengeRoutes from './create'

const challengeRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/create', createChallengeRoutes(services))
}

export default challengeRoutes
