import { Router } from 'express'
import { Services } from '../../services'
import createConditionsRoutes from './create'

const conditionsRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/create', createConditionsRoutes(services))
}

export default conditionsRoutes
