import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import type { SupportStrategyResponseDto } from 'dto'
import formatDateFilter from '../../../filters/formatDateFilter'
import { formatStrengthTypeScreenValueFilter } from '../../../filters/formatStrengthTypeFilter'
import formatStrengthIdentificationSourceScreenValueFilter from '../../../filters/formatStrengthIdentificationSourceFilter'
import aValidSupportStrategyResponseDto from '../../../testsupport/supportStrategyResponseDtoTestDataBuilder'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatStrengthTypeScreenValue', formatStrengthTypeScreenValueFilter)
  .addFilter('formatStrengthIdentificationSourceScreenValue', formatStrengthIdentificationSourceScreenValueFilter)

const prisonNamesById = {
  BXI: 'Brixton (HMP)',
  LEI: 'Leeds (HMP)',
}
const templateParams = {
  title: 'Attention, organising and time management',
  archivedSupportStrategies: [aValidSupportStrategyResponseDto()],
  prisonNamesById,
}

const template = 'archivedSupportStrategiesSummaryCard.test.njk'

describe('Tests for Archived Support Strategies Summary Card component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the component given archived support strategies', () => {
    // Given
    const params = {
      ...templateParams,
      archivedSupportStrategies: [
        aValidSupportStrategyResponseDto({
          details:
            'Needs instructions broken down into short manageable steps, and presented both verbally and in writing',
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10T09:01:00'),
          active: false,
          archiveReason: 'Support strategy added for the wrong prisoner by mistake',
        }),
        aValidSupportStrategyResponseDto({
          details: 'He can be more attentive when the context of conversation does not change frequently.',
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10T09:00:00'),
          active: false,
          archiveReason: 'Support strategy added in error',
        }),
      ],
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Attention, organising and time management')

    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(2)

    const firstSupportStrategy = supportStrategies.eq(0)
    expect(firstSupportStrategy.find('p').eq(0).text().trim()).toEqual(
      'Needs instructions broken down into short manageable steps, and presented both verbally and in writing',
    )
    expect(firstSupportStrategy.find('[data-qa=support-strategy-audit]').text().trim()).toEqual(
      'Moved to history on 10 Feb 2025 by Person 1, Leeds (HMP)',
    )

    const secondSupportStrategy = supportStrategies.eq(1)
    expect(secondSupportStrategy.find('p').eq(0).text().trim()).toEqual(
      'He can be more attentive when the context of conversation does not change frequently.',
    )
    expect(secondSupportStrategy.find('[data-qa=support-strategy-audit]').text().trim()).toEqual(
      'Moved to history on 10 Feb 2025 by Person 1, Leeds (HMP)',
    )
  })

  it('should render the component given prisonNamesById does not contain the prison', () => {
    // Given
    const params = {
      ...templateParams,
      archivedSupportStrategies: [
        aValidSupportStrategyResponseDto({
          details:
            'Needs instructions broken down into short manageable steps, and presented both verbally and in writing',
          updatedByDisplayName: 'Person 3',
          updatedAtPrison: 'BXI',
          updatedAt: parseISO('2025-06-13'),
        }),
      ],
      prisonNamesById: {},
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Attention, organising and time management')

    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(1)
    expect($('[data-qa=support-strategy-audit]').text().trim()).toEqual(
      'Moved to history on 13 Jun 2025 by Person 3, BXI',
    )
  })

  it('should not render the component given no archived support strategies', () => {
    // Given
    const params = {
      ...templateParams,
      archivedSupportStrategies: [] as Array<SupportStrategyResponseDto>,
    }

    // When
    const content = njkEnv.render(template, params)

    // Then
    expect(content.trim()).toEqual('')
  })
})
