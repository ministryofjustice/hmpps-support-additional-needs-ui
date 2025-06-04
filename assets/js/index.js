import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import initBackLinks from './backLink.mjs'

govukFrontend.initAll()
mojFrontend.initAll()

initBackLinks()
