import { Router } from 'express'
import { Services } from '../../services'
import archiveChallengeRoutes from './archive'
import createChallengeRoutes from './create'
import editChallengeRoutes from './edit'

const challengesRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/create', createChallengeRoutes(services))
    .use('/:challengeReference/edit', editChallengeRoutes(services))
    .use('/:challengeReference/archive', archiveChallengeRoutes(services))
}

export default challengesRoutes
