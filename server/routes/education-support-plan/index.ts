import { Router } from 'express'
import createEducationSupportPlanRoutes from './create'
import refuseEducationSupportPlanRoutes from './refuse-plan'
import { Services } from '../../services'
import reviewEducationSupportPlanRoutes from './review'
import updateEducationSupportPlanRoutes from './update'

const educationSupportPlanRoutes = (services: Services): Router => {
  const router = Router({ mergeParams: true })

  router.use('/create', createEducationSupportPlanRoutes(services))
  router.use('/update', updateEducationSupportPlanRoutes(services))
  router.use('/refuse-plan', refuseEducationSupportPlanRoutes(services))
  router.use('/review', reviewEducationSupportPlanRoutes(services))

  return router
}

export default educationSupportPlanRoutes
