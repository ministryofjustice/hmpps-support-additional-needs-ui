import { Router } from 'express'
import { Services } from '../../services'
import overviewRoutes from './overview'
import supportStrategiesRoutes from './support-strategies'
import challengesRoutes from './challenges'
import strengthsRoutes from './strengths'
import conditionsRoutes from './conditions'
import educationSupportPlanRoutes from './education-support-plan'

const profileRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/overview', overviewRoutes(services))
    .use('/support-strategies', supportStrategiesRoutes())
    .use('/challenges', challengesRoutes(services))
    .use('/strengths', strengthsRoutes(services))
    .use('/conditions', conditionsRoutes(services))
    .use('/education-support-plan', educationSupportPlanRoutes(services))
}

export default profileRoutes
