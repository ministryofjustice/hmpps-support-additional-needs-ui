import { Router } from 'express'
import { Services } from '../../services'
import createAlnScreenerRoutes from './create'
import deleteAlnScreenerRoutes from './delete'

const alnScreenerRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/create', createAlnScreenerRoutes(services))
    .use('/delete', deleteAlnScreenerRoutes(services))
}

export default alnScreenerRoutes
