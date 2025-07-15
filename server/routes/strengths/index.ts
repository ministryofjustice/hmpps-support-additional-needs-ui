import { Router } from 'express'
import { Services } from '../../services'
import createStrengthRoutes from './create'

const strengthsRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/create', createStrengthRoutes(services))
}

export default strengthsRoutes
