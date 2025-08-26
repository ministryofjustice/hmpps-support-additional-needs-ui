import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { Result } from '../../../../utils/result/result'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { aCuriousAlnAndLddAssessmentsDto } from '../../../../testsupport/curiousAlnAndLddAssessmentsDtoTestDataBuilder'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/govuk/',
  'node_modules/govuk-frontend/govuk/components/',
  'node_modules/govuk-frontend/govuk/template/',
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('assetMap', () => '')

const prisonNumber = 'A1234BC'
const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
const template = '_screeningAndAssessmentSummaryCard.njk'

const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary,
  curiousAlnAndLddAssessments: Result.fulfilled(aCuriousAlnAndLddAssessmentsDto()),
  userHasPermissionTo,
}

describe('_screeningAndAssessmentSummaryCard', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the summary card given the prisoner has no Assessments and the user has permission to record screener results', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
      curiousAlnAndLddAssessments: Result.fulfilled(
        aCuriousAlnAndLddAssessmentsDto({
          lddAssessments: [],
          alnAssessments: [],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(1)
    expect($('[data-qa=record-screener-results-button]').length).toEqual(1)
    expect($('[data-qa=no-screeners-in-curious-message]').length).toEqual(1)
    expect($('[data-qa=curious-screeners-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
  })

  it('should render the summary card given the prisoner has no Assessments and the user does not have permission to record screener results', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)

    const params = {
      ...templateParams,
      curiousAlnAndLddAssessments: Result.fulfilled(
        aCuriousAlnAndLddAssessmentsDto({
          lddAssessments: [],
          alnAssessments: [],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(0) // Expect no actions in the summary card header because the user does not have permission to record screener results
    expect($('[data-qa=no-screeners-in-curious-message]').length).toEqual(1)
    expect($('[data-qa=scurious-screeners-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
  })

  it('should render the summary card given the Curious service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      curiousAlnAndLddAssessments: Result.rejected(new Error('Failed to get Curious assessments')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=curious-screeners-unavailable-message]').length).toEqual(1)
  })
})
