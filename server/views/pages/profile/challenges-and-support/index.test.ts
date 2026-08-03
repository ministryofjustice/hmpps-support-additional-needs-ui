import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import formatDate from '../../../../filters/formatDateFilter'
import formatPrisonerNameFilter, { NameFormat } from '../../../../filters/formatPrisonerNameFilter'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'
import formatChallengeCategoryScreenValueFilter from '../../../../filters/formatChallengeCategoryFilter'
import formatChallengeIdentificationSourceScreenValueFilter from '../../../../filters/formatChallengeIdentificationSourceFilter'
import { formatChallengeTypeScreenValueFilter } from '../../../../filters/formatChallengeTypeFilter'
import aPlanLifecycleStatusDto from '../../../../testsupport/planLifecycleStatusDtoTestDataBuilder'
import challengeStaffSupportTextLookupFilter from '../../../../filters/challengeStaffSupportTextLookupFilter'

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
  .addFilter('formatChallengeCategoryScreenValue', formatChallengeCategoryScreenValueFilter)
  .addFilter('formatChallengeIdentificationSourceScreenValue', formatChallengeIdentificationSourceScreenValueFilter)
  .addFilter('formatChallengeTypeScreenValue', formatChallengeTypeScreenValueFilter)
  .addFilter('challengeSupportTextLookup', challengeStaffSupportTextLookupFilter)

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
  userHasPermissionTo,
  tab: 'challenges-and-support',
  activeChallenges: Result.fulfilled({}),
  archivedChallenges: Result.fulfilled({}),
  activeSupportStrategies: Result.fulfilled({}),
  archivedSupportStrategies: Result.fulfilled({}),
  prisonNamesById: Result.fulfilled(prisonNamesById),
  educationSupportPlanLifecycleStatus: Result.fulfilled(aPlanLifecycleStatusDto()),
  pageHasApiErrors: false,
}

describe('Profile challenges and support page', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the profile challenges and support page given the Challenges service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      activeChallenges: Result.rejected(new Error('Failed to get challenges')),
      archivedChallenges: Result.rejected(new Error('Failed to get challenges')),
      pageHasApiErrors: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-challenges-and-support-summary-card]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(1)
  })

  it('should render the profile challenges and support page given the Support Strategies service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      activeSupportStrategies: Result.rejected(new Error('Failed to get support strategies')),
      archivedSupportStrategies: Result.rejected(new Error('Failed to get support strategies')),
      pageHasApiErrors: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-challenges-and-support-summary-card]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(1)
  })

  it('should render the profile challenges and support page given both the Challenges and Support Strategies service APIs promises are not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      activeChallenges: Result.rejected(new Error('Failed to get challenges')),
      archivedChallenges: Result.rejected(new Error('Failed to get challenges')),
      activeSupportStrategies: Result.rejected(new Error('Failed to get support strategies')),
      archivedSupportStrategies: Result.rejected(new Error('Failed to get support strategies')),
      pageHasApiErrors: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-challenges-and-support-summary-card]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(1)
  })
})
