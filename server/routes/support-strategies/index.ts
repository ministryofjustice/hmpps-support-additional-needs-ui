import { Router } from 'express'
import { Services } from '../../services'
import createSupportStrategiesRoutes from './create'
import editSupportStrategiesRoutes from './edit'

const supportStrategiesRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/create', createSupportStrategiesRoutes(services))
    .use('/:supportStrategyReference/edit', editSupportStrategiesRoutes(services))
}

export default supportStrategiesRoutes
