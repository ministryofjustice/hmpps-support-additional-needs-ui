import { Router } from 'express'
import { Services } from '../../services'
import archiveStrengthRoutes from './archive'
import createStrengthRoutes from './create'
import editStrengthRoutes from './edit'
import deleteStrengthRoutes from './delete'
import historyDeleteStrengthRoutes from './history-delete'

const strengthsRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/create', createStrengthRoutes(services))
    .use('/:strengthReference/edit', editStrengthRoutes(services))
    .use('/:strengthReference/archive', archiveStrengthRoutes(services))
    .use('/:strengthReference/delete', deleteStrengthRoutes(services))
    .use('/:strengthReference/history-delete', historyDeleteStrengthRoutes(services))
}

export default strengthsRoutes
