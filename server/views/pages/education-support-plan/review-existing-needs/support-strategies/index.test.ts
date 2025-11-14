import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import formatDate from '../../../../../filters/formatDateFilter'
import formatPrisonerNameFilter, { NameFormat } from '../../../../../filters/formatPrisonerNameFilter'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../../utils/result/result'
import aValidSupportStrategyResponseDto from '../../../../../testsupport/supportStrategyResponseDtoTestDataBuilder'
import SupportStrategyType from '../../../../../enums/supportStrategyType'
import { formatSupportStrategyTypeScreenValueFilter } from '../../../../../filters/formatSupportStrategyTypeFilter'
import SupportStrategyCategory from '../../../../../enums/supportStrategyCategory'

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

const templateParams = {
  prisonerSummary,
  prisonNamesById: Result.fulfilled(prisonNamesById),
  supportStrategies: Result.fulfilled({}),
}

describe('Create ELSP - review existing support strategies page', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the Review Support Strategies page', () => {
    // Given
    const params = {
      ...templateParams,
      supportStrategies: Result.fulfilled({
        SENSORY: [
          aValidSupportStrategyResponseDto({
            supportStrategyCategoryTypeCode: SupportStrategyType.SENSORY,
            supportStrategyCategory: SupportStrategyCategory.SENSORY,
            details: 'Have patience with him and speak softly and clearly.',
            updatedAtPrison: 'BXI',
            updatedByDisplayName: 'Alex Smith',
            updatedAt: startOfDay('2024-05-02'),
            createdAt: startOfDay('2024-05-02'),
          }),
          aValidSupportStrategyResponseDto({
            supportStrategyCategoryTypeCode: SupportStrategyType.SENSORY,
            supportStrategyCategory: SupportStrategyCategory.SENSORY,
            details: 'Use of noise cancelling headphones will help Chris concentrate better.',
            updatedAtPrison: 'BXI',
            updatedByDisplayName: 'A.Smith',
            updatedAt: startOfDay('2024-01-01'),
            createdAt: startOfDay('2024-01-01'),
          }),
        ],
        MEMORY: [
          aValidSupportStrategyResponseDto({
            supportStrategyCategoryTypeCode: SupportStrategyType.MEMORY,
            supportStrategyCategory: SupportStrategyCategory.MEMORY,
            details: 'Use of flash cards will help Chris remember more easily.',
            updatedByDisplayName: 'Brian Jones',
            updatedAtPrison: 'LEI',
            updatedAt: startOfDay('2023-08-20'),
            createdAt: startOfDay('2023-08-20'),
          }),
        ],
        NUMERACY_SKILLS_DEFAULT: [
          aValidSupportStrategyResponseDto({
            supportStrategyCategoryTypeCode: SupportStrategyType.NUMERACY_SKILLS_DEFAULT,
            supportStrategyCategory: SupportStrategyCategory.NUMERACY_SKILLS,
            details: 'Chris uses his fingers to count and it works well for him.',
            updatedByDisplayName: 'Brian Jones',
            updatedAtPrison: 'LEI',
            updatedAt: startOfDay('2023-08-20'),
            createdAt: startOfDay('2023-08-20'),
          }),
        ],
      }),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card').length).toEqual(3) // expect summary cards for Sensory, Memory and Numeracy Skills

    const sensoryCard = $('[data-qa=support-strategy-summary-card_SENSORY]')
    expect(sensoryCard.length).toEqual(1)
    expect(sensoryCard.find('h2').text().trim()).toEqual('Sensory')
    expect(
      sensoryCard.find('.govuk-summary-list__row').eq(0).find('[data-qa=support-strategy-details]').text().trim(),
    ).toEqual('Have patience with him and speak softly and clearly.')
    expect(
      sensoryCard.find('.govuk-summary-list__row').eq(0).find('[data-qa=support-strategy-audit]').text().trim(),
    ).toEqual('Last updated 2 May 2024 by Alex Smith, Brixton (HMP)')
    expect(
      sensoryCard.find('.govuk-summary-list__row').eq(1).find('[data-qa=support-strategy-details]').text().trim(),
    ).toEqual('Use of noise cancelling headphones will help Chris concentrate better.')
    expect(
      sensoryCard.find('.govuk-summary-list__row').eq(1).find('[data-qa=support-strategy-audit]').text().trim(),
    ).toEqual('Last updated 1 Jan 2024 by A.Smith, Brixton (HMP)')

    const memoryCard = $('[data-qa=support-strategy-summary-card_MEMORY]')
    expect(memoryCard.length).toEqual(1)
    expect(memoryCard.find('h2').text().trim()).toEqual('Memory')
    expect(
      memoryCard.find('.govuk-summary-list__row').eq(0).find('[data-qa=support-strategy-details]').text().trim(),
    ).toEqual('Use of flash cards will help Chris remember more easily.')
    expect(
      memoryCard.find('.govuk-summary-list__row').eq(0).find('[data-qa=support-strategy-audit]').text().trim(),
    ).toEqual('Last updated 20 Aug 2023 by Brian Jones, Leeds (HMP)')

    const numeracySkillsCard = $('[data-qa=support-strategy-summary-card_NUMERACY_SKILLS_DEFAULT]')
    expect(numeracySkillsCard.length).toEqual(1)
    expect(numeracySkillsCard.find('h2').text().trim()).toEqual('Numeracy skills')
    expect(
      numeracySkillsCard
        .find('.govuk-summary-list__row')
        .eq(0)
        .find('[data-qa=support-strategy-details]')
        .text()
        .trim(),
    ).toEqual('Chris uses his fingers to count and it works well for him.')
    expect(
      numeracySkillsCard.find('.govuk-summary-list__row').eq(0).find('[data-qa=support-strategy-audit]').text().trim(),
    ).toEqual('Last updated 20 Aug 2023 by Brian Jones, Leeds (HMP)')

    expect($('[data-qa=no-support-strategies-summary-card]').length).toEqual(0)
    expect($('[data-qa=support-strategies-unavailable-message]').length).toEqual(0)
  })

  it('should render the Review Strengths page given prisoner has no Strengths', () => {
    // Given
    const params = {
      ...templateParams,
      supportStrategies: Result.fulfilled([]),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=no-support-strategies-summary-card]').length).toEqual(1)
    expect($('[data-qa=support-strategies-unavailable-message]').length).toEqual(0)
  })

  it('should render the Review Strengths page given the Strengths service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      supportStrategies: Result.rejected(new Error('Failed to get support strategies')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=support-strategies-unavailable-message]').length).toEqual(1)
    expect($('[data-qa=no-support-strategies-summary-card]').length).toEqual(0)
  })
})
