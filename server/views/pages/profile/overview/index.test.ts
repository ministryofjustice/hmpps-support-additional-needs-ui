import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDate from '../../../../filters/formatDateFilter'
import formatPrisonerNameFilter, { NameFormat } from '../../../../filters/formatPrisonerNameFilter'
import { Result } from '../../../../utils/result/result'
import { aValidConditionsList } from '../../../../testsupport/conditionDtoTestDataBuilder'
import filterArrayOnPropertyFilter from '../../../../filters/filterArrayOnPropertyFilter'
import formatConditionTypeScreenValueFilter from '../../../../filters/formatConditionTypeFilter'
import StrengthCategory from '../../../../enums/strengthCategory'
import formatStrengthCategoryScreenValueFilter from '../../../../filters/formatStrengthCategoryFilter'
import ChallengeCategory from '../../../../enums/challengeCategory'
import formatChallengeCategoryScreenValueFilter from '../../../../filters/formatChallengeCategoryFilter'
import { aCuriousAlnAndLddAssessmentsDto } from '../../../../testsupport/curiousAlnAndLddAssessmentsDtoTestDataBuilder'
import formatAlnAssessmentReferralScreenValueFilter from '../../../../filters/formatAlnAssessmentReferralFilter'
import aPlanLifecycleStatusDto from '../../../../testsupport/planLifecycleStatusDtoTestDataBuilder'

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
  .addFilter('formatDate', formatDate)
  .addFilter('formatFirst_name_Last_name', formatPrisonerNameFilter(NameFormat.First_name_Last_name))
  .addFilter('formatLast_name_comma_First_name', formatPrisonerNameFilter(NameFormat.Last_name_comma_First_name))
  .addFilter('filterArrayOnProperty', filterArrayOnPropertyFilter)
  .addFilter('formatConditionTypeScreenValue', formatConditionTypeScreenValueFilter)
  .addFilter('formatStrengthCategoryScreenValue', formatStrengthCategoryScreenValueFilter)
  .addFilter('formatChallengeCategoryScreenValue', formatChallengeCategoryScreenValueFilter)
  .addFilter('formatAlnAssessmentReferralScreenValue', formatAlnAssessmentReferralScreenValueFilter)

const prisonerSummary = aValidPrisonerSummary({
  firstName: 'IFEREECA',
  lastName: 'PEIGH',
})
const prisonNamesById = {
  BXI: 'Brixton (HMP)',
  LEI: 'Leeds (HMP)',
}
const template = 'index.njk'

const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary,
  tab: 'overview',
  educationSupportPlanLifecycleStatus: Result.fulfilled(aPlanLifecycleStatusDto()),
  conditions: Result.fulfilled(aValidConditionsList()),
  strengthCategories: Result.fulfilled([StrengthCategory.LITERACY_SKILLS, StrengthCategory.NUMERACY_SKILLS]),
  challengeCategories: Result.fulfilled([ChallengeCategory.LITERACY_SKILLS, ChallengeCategory.NUMERACY_SKILLS]),
  curiousAlnAndLddAssessments: Result.fulfilled(aCuriousAlnAndLddAssessmentsDto()),
  prisonNamesById: Result.fulfilled(prisonNamesById),
  pageHasApiErrors: false,
  userHasPermissionTo,
}

describe('Profile overview page', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the profile overview page given all service API promises are resolved', () => {
    // Given
    const pageViewModel = {
      ...templateParams,
      educationSupportPlanLifecycleStatus: Result.fulfilled(aPlanLifecycleStatusDto()),
      pageHasApiErrors: false,
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('h1').text().trim()).toEqual(`Ifereeca Peigh's support for additional needs`)
    expect($('.prisoner-summary-banner').length).toEqual(1)
    expect($('[data-qa=screening-and-assessment-summary-card]').length).toEqual(1)
    expect($('[data-qa=conditions-summary-card]').length).toEqual(1)
    expect($('[data-qa=strengths-summary-card]').length).toEqual(1)
    expect($('[data-qa=challenges-summary-card]').length).toEqual(1)
    expect($('[data-qa=support-recommendations-summary-card]').length).toEqual(1)
    expect($('[data-qa=actions-card]').length).toEqual(1)
    expect($('[data-qa=actions-card] li').length).toEqual(6)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
  })

  it('should render the profile overview page given the plan action status service API promise is not resolved', () => {
    // Given
    const pageViewModel = {
      ...templateParams,
      educationSupportPlanLifecycleStatus: Result.rejected(new Error('Failed to get plan action status')),
      pageHasApiErrors: true,
    }

    // When
    const content = njkEnv.render(template, pageViewModel)
    const $ = cheerio.load(content)

    // Then
    expect($('h1').text().trim()).toEqual(`Ifereeca Peigh's support for additional needs`)
    expect($('.prisoner-summary-banner').length).toEqual(1)
    expect($('[data-qa=screening-and-assessment-summary-card]').length).toEqual(1)
    expect($('[data-qa=conditions-summary-card]').length).toEqual(1)
    expect($('[data-qa=strengths-summary-card]').length).toEqual(1)
    expect($('[data-qa=challenges-summary-card]').length).toEqual(1)
    expect($('[data-qa=support-recommendations-summary-card]').length).toEqual(1)
    expect($('[data-qa=actions-card]').length).toEqual(1)
    expect($('[data-qa=actions-card] li').length).toEqual(5)
    expect($('[data-qa=api-error-banner]').length).toEqual(1)
  })
})
