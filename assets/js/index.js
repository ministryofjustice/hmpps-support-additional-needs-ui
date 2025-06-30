import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import initBackLinks from './backLink.mjs'
import applicationInsights from './applicationinsights.mjs'

govukFrontend.initAll()
mojFrontend.initAll()

initBackLinks()

window.initApplicationInsights = (connectionString, applicationInsightsRoleName, authenticatedUser) => {
  applicationInsights.init(connectionString, applicationInsightsRoleName, authenticatedUser)
}
