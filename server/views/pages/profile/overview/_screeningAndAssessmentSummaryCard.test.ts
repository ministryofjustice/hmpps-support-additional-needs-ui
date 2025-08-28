import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { Result } from '../../../../utils/result/result'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import {
  aCuriousAlnAndLddAssessmentsDto,
  aCuriousLddAssessmentDto,
} from '../../../../testsupport/curiousAlnAndLddAssessmentsDtoTestDataBuilder'
import formatPrisonerNameFilter, { NameFormat } from '../../../../filters/formatPrisonerNameFilter'
import formatDateFilter from '../../../../filters/formatDateFilter'
import formatAlnAssessmentReferralScreenValueFilter from '../../../../filters/formatAlnAssessmentReferralFilter'

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
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatFirst_name_Last_name', formatPrisonerNameFilter(NameFormat.First_name_Last_name))
  .addFilter('formatAlnAssessmentReferralScreenValue', formatAlnAssessmentReferralScreenValueFilter)

const prisonNumber = 'A1234BC'
const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
const prisonNamesById = {
  BXI: 'Brixton (HMP)',
  LEI: 'Leeds (HMP)',
}
const template = '_screeningAndAssessmentSummaryCard.njk'

const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary,
  curiousAlnAndLddAssessments: Result.fulfilled(aCuriousAlnAndLddAssessmentsDto()),
  prisonNamesById: Result.fulfilled(prisonNamesById),
  userHasPermissionTo,
}

describe('_screeningAndAssessmentSummaryCard', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the summary card given the prisoner has no Assessments', () => {
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
    expect($('[data-qa=no-aln-assessments]').length).toEqual(1)
    expect($('[data-qa=ldd-assessments]').length).toEqual(0)
    expect($('[data-qa=curious-screeners-unavailable-message]').length).toEqual(0)
  })

  it('should render the summary card given the prisoner has no ALN Assessments but has LDD Assessments', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
      curiousAlnAndLddAssessments: Result.fulfilled(
        aCuriousAlnAndLddAssessmentsDto({
          lddAssessments: [aCuriousLddAssessmentDto()],
          alnAssessments: [],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-aln-assessments]').length).toEqual(1)
    expect($('[data-qa=ldd-assessments]').length).toEqual(1)
    expect($('[data-qa=curious-screeners-unavailable-message]').length).toEqual(0)
  })

  it('should include link to record screener results given the user has permission to record screener results', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = { ...templateParams }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(1)
    expect($('[data-qa=record-screener-results-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
  })

  it('should not include link to record screener results given the user does not have permission to record screener results', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)

    const params = { ...templateParams }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(0) // Expect no actions in the summary card header because the user does not have permission to record screener results
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
