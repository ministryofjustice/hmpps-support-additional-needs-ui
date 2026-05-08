import { Router } from 'express'
import { Services } from '../../services'
import archiveSupportStrategiesRoutes from './archive'
import createSupportStrategiesRoutes from './create'
import editSupportStrategiesRoutes from './edit'
import deleteSupportStrategyRoutes from './delete'

const supportStrategiesRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/create', createSupportStrategiesRoutes(services))
    .use('/:supportStrategyReference/edit', editSupportStrategiesRoutes(services))
    .use('/:supportStrategyReference/archive', archiveSupportStrategiesRoutes(services))
    .use('/:supportStrategyReference/delete', deleteSupportStrategyRoutes(services))
}

export default supportStrategiesRoutes
