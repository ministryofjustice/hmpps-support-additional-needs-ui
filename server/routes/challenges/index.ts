import { Router } from 'express'
import { Services } from '../../services'
import createChallengeRoutes from './create'

const challengesRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/create', createChallengeRoutes(services))
}

export default challengesRoutes
