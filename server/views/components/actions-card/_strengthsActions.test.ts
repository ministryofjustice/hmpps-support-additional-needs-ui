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

describe('_strengthsActions', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the strengths actions section given user has permission to create strengths', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = { ...templateParams }

    // When
    const content = nunjucks.render('_strengthsActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=strengths-actions]').length).toEqual(1) // expect the containing div to be present
    expect($('[data-qa=strengths-action-items] li').length).toEqual(2) // expect there to be 2 actions within; 1 for creating strengths, 1 for recording ALN screener results
    expect($('[data-qa=add-strength-button]').length).toEqual(1)
    expect($('[data-qa=record-screener-results-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
  })

  it('should render the strengths actions section given user does not have permission to create strengths', () => {
    // Given
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)

    const params = { ...templateParams }

    // When
    const content = nunjucks.render('_strengthsActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=strengths-actions]').length).toEqual(1) // expect the containing div to be present
    expect($('[data-qa=strengths-action-items] li').length).toEqual(1) // expect there to be 1 actions within; 1 for recording ALN screener results
    expect($('[data-qa=add-strength-button]').length).toEqual(0)
    expect($('[data-qa=record-screener-results-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
  })

  it('should render the strengths actions section given given user does not have permission to record ALN Screener results', () => {
    // Given
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)

    const params = { ...templateParams }

    // When
    const content = nunjucks.render('_strengthsActions.njk', { params })
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=strengths-actions]').length).toEqual(1) // expect the containing div to be present
    expect($('[data-qa=strengths-action-items] li').length).toEqual(1) // expect there to be 1 actions within; 1 for creating strengths
    expect($('[data-qa=add-strength-button]').length).toEqual(1)
    expect($('[data-qa=record-screener-results-button]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
  })
})
