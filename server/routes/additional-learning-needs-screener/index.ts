import { Router } from 'express'
import { Services } from '../../services'
import createAlnScreenerRoutes from './create'

const alnScreenerRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/create', createAlnScreenerRoutes(services))
}

export default alnScreenerRoutes
