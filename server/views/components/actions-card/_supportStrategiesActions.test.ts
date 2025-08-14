import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import type { ActionsCardParams } from 'viewModels'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import aValidPlanCreationScheduleDto from '../../../testsupport/planCreationScheduleDtoTestDataBuilder'

nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

const userHasPermissionTo = jest.fn()
const templateParams: ActionsCardParams = {
  prisonerSummary: aValidPrisonerSummary(),
  userHasPermissionTo,
  educationSupportPlanCreationSchedule: aValidPlanCreationScheduleDto(),
}

describe('_supportStrategiesActions', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the support strategies actions section given user has permission to create support strategies', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = { ...templateParams }

    // When
    const content = nunjucks.render('_supportStrategiesActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=support-strategies-actions]').length).toEqual(1) // expect the containing div to be present
    expect($('[data-qa=support-strategies-action-items] li').length).toEqual(1) // expect there to be 1 action within for creating support strategies
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
  })

  it('should render the support strategies actions section given user does not have permission to create support strategies', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)

    const params = { ...templateParams }

    // When
    const content = nunjucks.render('_supportStrategiesActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=support-strategies-actions]').length).toEqual(1) // expect the containing div to be present
    expect($('[data-qa=support-strategies-action-items] li').length).toEqual(0) // but expect it to be empty
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
  })
})
