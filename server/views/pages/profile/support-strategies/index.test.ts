import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import formatDate from '../../../../filters/formatDateFilter'
import formatPrisonerNameFilter, { NameFormat } from '../../../../filters/formatPrisonerNameFilter'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'
import { formatSupportStrategyTypeScreenValueFilter } from '../../../../filters/formatSupportStrategyTypeFilter'
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
  .addFilter('formatSupportStrategyTypeScreenValue', formatSupportStrategyTypeScreenValueFilter)

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
  tab: 'support-strategies',
  supportStrategies: Result.fulfilled({}),
  prisonNamesById: Result.fulfilled(prisonNamesById),
  educationSupportPlanLifecycleStatus: Result.fulfilled(aPlanLifecycleStatusDto()),
  pageHasApiErrors: false,
}

describe('Profile support strategies page', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the profile support strategies page', () => {
    // Given
    const params = {
      ...templateParams,
      supportStrategies: Result.fulfilled({
        LITERACY_SKILLS: [
          {
            supportStrategyDetails: 'Uses audio books and text-to-speech software',
            updatedAt: '2024-01-01',
            updatedByDisplayName: 'John Smith',
            updatedAtPrison: 'BXI',
          },
        ],
        NUMERACY_SKILLS: [
          {
            supportStrategyDetails: 'Requires additional time for mathematical tasks',
            updatedAt: '2024-01-02',
            updatedByDisplayName: 'Jane Doe',
            updatedAtPrison: 'LEI',
          },
        ],
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=support-strategy-summary-card-LITERACY_SKILLS]').length).toEqual(1)
    const literacySkillsEntry = $('[data-qa=support-strategy-summary-card-LITERACY_SKILLS]').eq(0)

    expect(literacySkillsEntry.find('[data-qa=support-strategy-details]').text().trim()).toEqual(
      'Uses audio books and text-to-speech software',
    )
    expect(literacySkillsEntry.find('[data-qa=support-strategy-audit]').text().trim()).toEqual(
      'Added on 1 January 2024 by John Smith, Brixton (HMP)',
    )
    expect($('[data-qa=support-strategy-summary-card-NUMERACY_SKILLS]').length).toEqual(1)

    const numeracySkillsEntry = $('[data-qa=support-strategy-summary-card-NUMERACY_SKILLS]').eq(0)

    expect(numeracySkillsEntry.find('[data-qa=support-strategy-details]').text().trim()).toEqual(
      'Requires additional time for mathematical tasks',
    )
    expect(numeracySkillsEntry.find('[data-qa=support-strategy-audit]').text().trim()).toEqual(
      'Added on 2 January 2024 by Jane Doe, Leeds (HMP)',
    )
    expect($('[data-qa=no-support-strategies-summary-card]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
  })

  it('should render the profile support strategies page given prisoner has no support strategies', () => {
    // Given
    const params = {
      ...templateParams,
      supportStrategies: Result.fulfilled({}),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-support-strategies-summary-card]').length).toEqual(1)
    expect($('[data-qa=no-support-strategies-summary-card] a').length).toEqual(1)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
  })

  it('should render the profile support strategies page given prisoner has no support strategies and the user does not have permission to create support strategies', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)
    const params = {
      ...templateParams,
      supportStrategies: Result.fulfilled({}),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-support-strategies-summary-card]').length).toEqual(1)
    expect($('[data-qa=no-support-strategies-summary-card] a').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
  })

  it('should render the profile support strategies page given the Support Strategies service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      supportStrategies: Result.rejected(new Error('Failed to get support strategies')),
      pageHasApiErrors: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-support-strategies-summary-card]').length).toEqual(0)
    expect($('[data-qa=api-error-banner]').length).toEqual(1)
  })
})
