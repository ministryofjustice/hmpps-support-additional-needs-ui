import { Router } from 'express'
import { Services } from '../../services'
import archiveChallengeRoutes from './archive'
import createChallengeRoutes from './create'
import editChallengeRoutes from './edit'
import deleteChallengeRoutes from './delete'
import historyDeleteChallengeRoutes from './history-delete'

const challengesRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/create', createChallengeRoutes(services))
    .use('/:challengeReference/edit', editChallengeRoutes(services))
    .use('/:challengeReference/archive', archiveChallengeRoutes(services))
    .use('/:challengeReference/delete', deleteChallengeRoutes(services))
    .use('/:challengeReference/history-delete', historyDeleteChallengeRoutes(services))
}

export default challengesRoutes
