import { Router } from 'express'
import { Services } from '../../services'
import overviewRoutes from './overview'
import supportStrategiesRoutes from './support-strategies'
import challengesRoutes from './challenges'
import strengthsRoutes from './strengths'
import conditionsRoutes from './conditions'
import educationSupportPlanRoutes from './education-support-plan'
import challengesAndSupportRoutes from './challenges-and-support'

const profileRoutes = (services: Services): Router => {
  return Router({ mergeParams: true }) //
    .use('/overview', overviewRoutes(services))
    .use('/support-strategies', supportStrategiesRoutes(services)) // TODO - delete route when feature toggle `DISPLAY_CHALLENGES_AND_SUPPORT_STRATEGIES_COMBINED` is removed
    .use('/challenges', challengesRoutes(services)) // TODO - delete route when feature toggle `DISPLAY_CHALLENGES_AND_SUPPORT_STRATEGIES_COMBINED` is removed
    .use('/strengths', strengthsRoutes(services))
    .use('/conditions', conditionsRoutes(services))
    .use('/education-support-plan', educationSupportPlanRoutes(services))
    .use('/challenges-and-support', challengesAndSupportRoutes(services))
}

export default profileRoutes
