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

describe('_challengesActions', () => {
  it('should render the challenges actions section given user has permission to create challenges', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = { ...templateParams }

    // When
    const content = nunjucks.render('_challengesActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=challenges-actions]').length).toEqual(1) // expect the containing div to be present
    expect($('[data-qa=challenges-action-items] li').length).toEqual(2) // expect there to be 2 actions within; 1 for creating challenges, 1 for creating the ELSP
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
  })

  it('should render the challenges actions section given user does not have permission to create challenges', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)

    const params = { ...templateParams }

    // When
    const content = nunjucks.render('_challengesActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=challenges-actions]').length).toEqual(1) // expect the containing div to be present
    expect($('[data-qa=challenges-action-items] li').length).toEqual(1) // expect there to be 1 actions within; 1 for creating the ELSP
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
  })
})
