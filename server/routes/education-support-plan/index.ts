import { Router } from 'express'
import createEducationSupportPlanRoutes from './create'
import { Services } from '../../services'

const educationSupportPlanRoutes = (services: Services): Router => {
  const router = Router({ mergeParams: true })

  router.use('/create', createEducationSupportPlanRoutes(services))

  // TODO - implement the /update routes when we have stories
  // router.use('/update', updateEducationSupportPlanRoutes(services))

  return router
}

export default educationSupportPlanRoutes
