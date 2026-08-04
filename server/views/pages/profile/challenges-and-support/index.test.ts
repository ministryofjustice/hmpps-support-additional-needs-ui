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
  activeChallengesAndSupport: Result.fulfilled({}),
  archivedChallengesAndSupport: Result.fulfilled({}),
  prisonNamesById: Result.fulfilled(prisonNamesById),
  educationSupportPlanLifecycleStatus: Result.fulfilled(aPlanLifecycleStatusDto()),
  pageHasApiErrors: false,
}

describe('Profile challenges and support page', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it.each([
    {
      activeChallengesAndSupport: [],
      archivedChallengesAndSupport: [],
      expectedActiveCount: 0,
      expectedArchivedCount: 0,
    },
    {
      activeChallengesAndSupport: ['SENSORY'],
      archivedChallengesAndSupport: ['EMOTIONS_FEELINGS'],
      expectedActiveCount: 1,
      expectedArchivedCount: 1,
    },
    {
      activeChallengesAndSupport: ['LITERACY_SKILLS', 'PHYSICAL_SKILLS', 'SENSORY'],
      archivedChallengesAndSupport: ['EMOTIONS_FEELINGS', 'MEMORY'],
      expectedActiveCount: 3,
      expectedArchivedCount: 2,
    },
  ])('should render the profile challenges and support page with the correct tab heading counts', spec => {
    // Given
    const params = {
      ...templateParams,
      activeChallengesAndSupport: Result.fulfilled(
        spec.activeChallengesAndSupport.reduce(
          (acc, category) => {
            acc[category] = {}
            return acc
          },
          {} as Record<string, unknown>,
        ),
      ),
      archivedChallengesAndSupport: Result.fulfilled(
        spec.archivedChallengesAndSupport.reduce(
          (acc, category) => {
            acc[category] = {}
            return acc
          },
          {} as Record<string, unknown>,
        ),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-tabs__list-item').eq(0).text().trim()).toEqual(`Current (${spec.expectedActiveCount})`)
    expect($('.govuk-tabs__list-item').eq(1).text().trim()).toEqual(`History (${spec.expectedArchivedCount})`)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
  })

  it('should render the profile challenges and support page given the Active Challenges and Support promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      activeChallengesAndSupport: Result.rejected(new Error('Failed to get active challenges and support')),
      pageHasApiErrors: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-challenges-and-support-summary-card]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(1)
  })

  it('should render the profile challenges and support page given the Archived Challenges and Support promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      archivedChallengesAndSupport: Result.rejected(new Error('Failed to get active challenges and support')),
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
