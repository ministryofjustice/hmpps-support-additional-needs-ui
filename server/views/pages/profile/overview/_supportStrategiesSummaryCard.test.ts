import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'
import { formatSupportStrategyTypeScreenValueFilter } from '../../../../filters/formatSupportStrategyTypeFilter'
import aValidSupportStrategyResponseDto from '../../../../testsupport/supportStrategyResponseDtoTestDataBuilder'
import SupportStrategyType from '../../../../enums/supportStrategyType'

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
  .addFilter('formatSupportStrategyTypeScreenValue', formatSupportStrategyTypeScreenValueFilter)

const prisonNumber = 'A1234BC'
const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
const template = '_supportStrategiesSummaryCard.njk'

const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary,
  userHasPermissionTo,
}

const groupedSupportStrategies = Result.fulfilled({
  SENSORY: [
    aValidSupportStrategyResponseDto({
      supportStrategyCategoryTypeCode: SupportStrategyType.SENSORY,
      updatedAt: parseISO('2021-01-01T00:00:00.000Z'),
      createdAt: parseISO('2021-01-01T00:00:00.000Z'),
      details: 'This is the oldest entry',
    }),
  ],
})

describe('_supportStrategiesSummaryCard', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the summary card given the prisoner has support strategies', () => {
    // Given
    const params = {
      ...templateParams,
      groupedSupportStrategies,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(1)
    expect($('[data-qa=view-support-strategies-button]').length).toEqual(1)

    const supportStrategyRows = $('[data-qa=support-strategy-summary-list-row]')
    expect(supportStrategyRows.length).toEqual(1)
    expect(supportStrategyRows.eq(0).find('h3').eq(0).text().trim()).toEqual('Sensory')
    expect(supportStrategyRows.eq(0).find('[data-qa=support-strategy-details]').eq(0).text().trim()).toEqual(
      'This is the oldest entry',
    )
    expect($('[data-qa=no-support-strategies-recorded-message]').length).toEqual(0)
    expect($('[data-qa=support-strategies-unavailable-message]').length).toEqual(0)
  })

  it('should render the summary card given the prisoner has no support strategies and the user has permission to create support strategies', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
      groupedSupportStrategies: Result.fulfilled({}),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(1)
    expect($('[data-qa=add-support-strategies-button]').length).toEqual(1)
    expect($('[data-qa=no-support-strategies-recorded-message]').length).toEqual(1)
    expect($('[data-qa=support-strategies-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
  })
  //
  it('should render the summary card given the prisoner has no support strategies and the user does not have permission to create support strategies', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)

    const params = {
      ...templateParams,
      groupedSupportStrategies: Result.fulfilled({}),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(0) // Expect no actions in the summary card header because the user does not have permissions
    expect($('[data-qa=no-support-strategies-recorded-message]').length).toEqual(1)
    expect($('[data-qa=support-strategies-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
  })

  it('should render the summary card given the Support Strategies service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      groupedSupportStrategies: Result.rejected(new Error('Failed to get support strategies')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(0) // Expect no actions in the summary card header - The API to return the Support Strategies failed so we do not know whether to show the "add" or "view" link
    expect($('[data-qa=support-strategies-unavailable-message]').length).toEqual(1)
  })
})
