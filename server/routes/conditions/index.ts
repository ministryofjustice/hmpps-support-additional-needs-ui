import { Router } from 'express'
import { Services } from '../../services'
import createConditionsRoutes from './create'
import editConditionsRoutes from './edit'

const conditionsRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/create', createConditionsRoutes(services))
    .use('/:conditionReference/edit', editConditionsRoutes(services))
}

export default conditionsRoutes
