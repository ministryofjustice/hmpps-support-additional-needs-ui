import { Router } from 'express'
import { Services } from '../../services'
import overviewRoute from './overview'

const profileRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/overview', overviewRoute(services))
}

export default profileRoutes
