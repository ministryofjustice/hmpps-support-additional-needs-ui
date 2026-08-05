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

  it('should render the profile challenges and support page with the correct tab heading counts', () => {
    // Given
    const params = {
      ...templateParams,
      activeChallengesAndSupport: Result.fulfilled({
        dataGroupedByCategory: {
          LITERACY_SKILLS: {/* Controller and mapper would populate this field - not required for this test */},
          PHYSICAL_SKILLS: {/* Controller and mapper would populate this field - not required for this test */},
          SENSORY: {/* Controller and mapper would populate this field - not required for this test */},
        },
        summary: {
          categoryCount: 3,
        },
      }),
      archivedChallengesAndSupport: Result.fulfilled({
        dataGroupedByCategory: {
          EMOTIONS_FEELINGS: {/* Controller and mapper would populate this field - not required for this test */},
          MEMORY: {/* Controller and mapper would populate this field - not required for this test */},
        },
        summary: {
          categoryCount: 2,
        },
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-tabs__list-item').eq(0).text().trim()).toEqual(`Current (3)`)
    expect($('.govuk-tabs__list-item').eq(1).text().trim()).toEqual(`History (2)`)
    expect($('[data-qa=challenges-and-support-unavailable-message]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
  })

  it('should render the profile challenges and support page given there are no active challenges and the user has permission to create challenges', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
      activeChallengesAndSupport: Result.fulfilled({
        dataGroupedByCategory: {/* Controller and mapper would populate this field - not required for this test */},
        summary: {
          challengesCount: 0,
          supportStrategiesCount: 1,
        },
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const parentTab = $('#current-challenges-and-support')
    expect(parentTab.find('[data-qa=no-active-challenges-message]').length).toEqual(1)
    expect(parentTab.find('[data-qa=add-challenge-button]').length).toEqual(1)
    expect(parentTab.find('[data-qa=no-active-support-strategies-message]').length).toEqual(0)
    expect(parentTab.find('[data-qa=add-support-strategy-button]').length).toEqual(0)
    expect($('[data-qa=challenges-and-support-unavailable-message]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
  })

  it('should render the profile challenges and support page given there are no active challenges and the user does not have permission to create challenges', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)

    const params = {
      ...templateParams,
      activeChallengesAndSupport: Result.fulfilled({
        dataGroupedByCategory: {/* Controller and mapper would populate this field - not required for this test */},
        summary: {
          challengesCount: 0,
          supportStrategiesCount: 1,
        },
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const parentTab = $('#current-challenges-and-support')
    expect(parentTab.find('[data-qa=no-active-challenges-message]').length).toEqual(1)
    expect(parentTab.find('[data-qa=add-challenge-button]').length).toEqual(0)
    expect(parentTab.find('[data-qa=no-active-support-strategies-message]').length).toEqual(0)
    expect(parentTab.find('[data-qa=add-support-strategy-button]').length).toEqual(0)
    expect($('[data-qa=challenges-and-support-unavailable-message]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
  })

  it('should render the profile challenges and support page given there are no active support strategies and the user has permission to create support strategies', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
      activeChallengesAndSupport: Result.fulfilled({
        dataGroupedByCategory: {/* Controller and mapper would populate this field - not required for this test */},
        summary: {
          challengesCount: 1,
          supportStrategiesCount: 0,
        },
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const parentTab = $('#current-challenges-and-support')
    expect(parentTab.find('[data-qa=no-active-challenges-message]').length).toEqual(0)
    expect(parentTab.find('[data-qa=add-challenge-button]').length).toEqual(0)
    expect(parentTab.find('[data-qa=no-active-support-strategies-message]').length).toEqual(1)
    expect(parentTab.find('[data-qa=add-support-strategy-button]').length).toEqual(1)
    expect($('[data-qa=challenges-and-support-unavailable-message]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
  })

  it('should render the profile challenges and support page given there are no active support strategies and the user does not have permission to create support strategies', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)

    const params = {
      ...templateParams,
      activeChallengesAndSupport: Result.fulfilled({
        dataGroupedByCategory: {/* Controller and mapper would populate this field - not required for this test */},
        summary: {
          challengesCount: 1,
          supportStrategiesCount: 0,
        },
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const parentTab = $('#current-challenges-and-support')
    expect(parentTab.find('[data-qa=no-active-challenges-message]').length).toEqual(0)
    expect(parentTab.find('[data-qa=add-challenge-button]').length).toEqual(0)
    expect(parentTab.find('[data-qa=no-active-support-strategies-message]').length).toEqual(1)
    expect(parentTab.find('[data-qa=add-support-strategy-button]').length).toEqual(0)
    expect($('[data-qa=challenges-and-support-unavailable-message]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
  })

  it('should render the profile challenges and support page given there are some archived challenges or support strategies', () => {
    // Given
    const params = {
      ...templateParams,
      archivedChallengesAndSupport: Result.fulfilled({
        dataGroupedByCategory: {
          EMOTIONS_FEELINGS: {/* Controller and mapper would populate this field - not required for this test */},
          MEMORY: {/* Controller and mapper would populate this field - not required for this test */},
        },
        summary: {
          categoryCount: 2,
        },
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-tabs__list-item').eq(1).text().trim()).toEqual(`History (2)`)
    expect($('[data-qa=no-archived-challenges-or-support-message]').length).toEqual(0)
    expect($('[data-qa=challenges-and-support-unavailable-message]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
  })

  it('should render the profile challenges and support page given there are no archived challenges or support strategies', () => {
    // Given
    const params = {
      ...templateParams,
      archivedChallengesAndSupport: Result.fulfilled({
        dataGroupedByCategory: {},
        summary: {
          categoryCount: 0,
        },
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-tabs__list-item').eq(1).text().trim()).toEqual(`History (0)`)
    expect($('[data-qa=no-archived-challenges-or-support-message]').length).toEqual(1)
    expect($('[data-qa=challenges-and-support-unavailable-message]').length).toEqual(0)
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
    expect($('[data-qa=challenges-and-support-unavailable-message]').length).toEqual(1)
    expect($('[data-qa=api-error-banner]').length).toEqual(1)
  })
})
