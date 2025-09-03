import { Router } from 'express'
import createEducationSupportPlanRoutes from './create'
import refuseEducationSupportPlanRoutes from './refuse-plan'
import { Services } from '../../services'

const educationSupportPlanRoutes = (services: Services): Router => {
  const router = Router({ mergeParams: true })

  router.use('/create', createEducationSupportPlanRoutes(services))
  router.use('/refuse-plan', refuseEducationSupportPlanRoutes(services))

  return router
}

export default educationSupportPlanRoutes
