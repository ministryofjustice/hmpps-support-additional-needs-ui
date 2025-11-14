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
  .addGlobal('featureToggles', { editAndArchiveEnabled: true })

const prisonNamesById = {
  BXI: 'Brixton (HMP)',
  LEI: 'Leeds (HMP)',
}
const userHasPermissionTo = jest.fn()
const templateParams = {
  title: 'Attention, organising and time management',
  supportStrategies: [aValidSupportStrategyResponseDto()],
  prisonNamesById,
  userHasPermissionTo,
  showActions: true,
}

const template = 'supportStrategiesSummaryCard.test.njk'

describe('Tests for Support Strategies Summary Card component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the component given support strategies', () => {
    // Given
    const params = {
      ...templateParams,
      supportStrategies: [
        aValidSupportStrategyResponseDto({
          details:
            'Needs instructions broken down into short manageable steps, and presented both verbally and in writing',
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10T09:01:00'),
        }),
        aValidSupportStrategyResponseDto({
          details: 'He can be more attentive when the context of conversation does not change frequently.',
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10T09:00:00'),
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
      'Last updated 10 Feb 2025 by Person 1, Leeds (HMP)',
    )

    const secondSupportStrategy = supportStrategies.eq(1)
    expect(secondSupportStrategy.find('p').eq(0).text().trim()).toEqual(
      'He can be more attentive when the context of conversation does not change frequently.',
    )
    expect(secondSupportStrategy.find('[data-qa=support-strategy-audit]').text().trim()).toEqual(
      'Last updated 10 Feb 2025 by Person 1, Leeds (HMP)',
    )
  })

  it('should render the component given prisonNamesById does not contain the prison', () => {
    // Given
    const params = {
      ...templateParams,
      supportStrategies: [
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
    expect($('[data-qa=support-strategy-audit]').text().trim()).toEqual('Last updated 13 Jun 2025 by Person 3, BXI')
  })

  it('should not render the component given no support strategies', () => {
    // Given
    const params = {
      ...templateParams,
      supportStrategies: [] as Array<SupportStrategyResponseDto>,
    }

    // When
    const content = njkEnv.render(template, params)

    // Then
    expect(content.trim()).toEqual('')
  })

  it('should not render any actions given the showActions flag is false', () => {
    const params = {
      ...templateParams,
      showActions: false,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(1)
    expect(supportStrategies.eq(0).find('.govuk-summary-card__actions').length).toEqual(0)
    expect(userHasPermissionTo).not.toHaveBeenCalled()
  })

  it('should not render any actions given the showActions flag is true but the user does not have any permissions', () => {
    userHasPermissionTo.mockReturnValue(false)

    const params = {
      ...templateParams,
      showActions: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(1)
    expect(supportStrategies.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(supportStrategies.eq(0).find('[data-qa=edit-support-strategy-button]').length).toEqual(0)
    expect(supportStrategies.eq(0).find('[data-qa=archive-support-strategy-button]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_SUPPORT_STRATEGIES')
  })

  it('should render edit strength action given the showActions flag is true and the user only has permission to edit support strategies', () => {
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)

    const params = {
      ...templateParams,
      showActions: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(1)
    expect(supportStrategies.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(supportStrategies.eq(0).find('[data-qa=edit-support-strategy-button]').length).toEqual(1)
    expect(supportStrategies.eq(0).find('[data-qa=archive-support-strategy-button]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_SUPPORT_STRATEGIES')
  })

  it('should render archive strength action given the showActions flag is true and the user only has permission to archive support strategies', () => {
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)

    const params = {
      ...templateParams,
      showActions: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(1)
    expect(supportStrategies.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(supportStrategies.eq(0).find('[data-qa=edit-support-strategy-button]').length).toEqual(0)
    expect(supportStrategies.eq(0).find('[data-qa=archive-support-strategy-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_SUPPORT_STRATEGIES')
  })

  it('should render both strength actions given the showActions flag is true and the user has permissions to edit and archive support strategies', () => {
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
      showActions: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const supportStrategies = $('.govuk-summary-list__row.support-strategy')
    expect(supportStrategies.length).toEqual(1)
    expect(supportStrategies.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(supportStrategies.eq(0).find('[data-qa=edit-support-strategy-button]').length).toEqual(1)
    expect(supportStrategies.eq(0).find('[data-qa=archive-support-strategy-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_SUPPORT_STRATEGIES')
  })
})
