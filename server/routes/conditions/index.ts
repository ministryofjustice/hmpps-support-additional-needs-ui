import { Router } from 'express'
import { Services } from '../../services'
import archiveConditionRoutes from './archive'
import createConditionsRoutes from './create'
import editConditionRoutes from './edit'

const conditionsRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/create', createConditionsRoutes(services))
    .use('/:conditionReference/edit', editConditionRoutes(services))
    .use('/:conditionReference/archive', archiveConditionRoutes(services))
}

export default conditionsRoutes
