import { Router } from 'express'
import { Services } from '../../services'
import archiveConditionRoutes from './archive'
import createConditionsRoutes from './create'
import editConditionRoutes from './edit'
import deleteConditionRoutes from './delete'

const conditionsRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/create', createConditionsRoutes(services))
    .use('/:conditionReference/edit', editConditionRoutes(services))
    .use('/:conditionReference/archive', archiveConditionRoutes(services))
    .use('/:conditionReference/delete', deleteConditionRoutes(services))
}

export default conditionsRoutes
