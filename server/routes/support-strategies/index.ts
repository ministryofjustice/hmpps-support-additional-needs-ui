import { Router } from 'express'
import { Services } from '../../services'
import createSupportStrategiesRoutes from './create'

const supportStrategiesRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/create', createSupportStrategiesRoutes(services))
}

export default supportStrategiesRoutes
