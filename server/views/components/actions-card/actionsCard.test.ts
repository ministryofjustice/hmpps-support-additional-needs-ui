import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import type { ActionsCardParams } from 'viewModels'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDateFilter from '../../../filters/formatDateFilter'
import aValidPlanCreationScheduleDto from '../../../testsupport/planCreationScheduleDtoTestDataBuilder'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv.addFilter('formatDate', formatDateFilter)

const userHasPermissionTo = jest.fn()
const templateParams: ActionsCardParams = {
  prisonerSummary: aValidPrisonerSummary(),
  userHasPermissionTo,
  educationSupportPlanCreationSchedule: aValidPlanCreationScheduleDto(),
}

const template = 'actionCards.test.njk'

describe('Tests for actions card component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the actions card component', () => {
    // Given
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=education-support-plan-actions]').length).toEqual(1)
  })

  it('should render the actions card component based on challenges menu type', () => {
    // Given
    const params = {
      ...templateParams,
      actionMenuType: 'challenges',
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=challenges-actions]').length).toEqual(1)
    expect($('[data-qa=add-challenge-button]').length).toEqual(1)
    expect($('[data-qa=record-screener-results-button]').length).toEqual(1)
  })

  it('should render the actions card component based on strengths menu type', () => {
    // Given
    const params = {
      ...templateParams,
      actionMenuType: 'strengths',
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=strengths-actions]').length).toEqual(1)
    expect($('[data-qa=add-strength-button]').length).toEqual(1)
    expect($('[data-qa=record-screener-results-button]').length).toEqual(1)
  })

  it('should render the actions card component based on conditions menu type', () => {
    // Given
    const params = {
      ...templateParams,
      actionMenuType: 'conditions',
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=conditions-actions]').length).toEqual(1)
    expect($('[data-qa=record-conditions-button]').length).toEqual(1)
    expect($('[data-qa=record-screener-results-button]').length).toEqual(0)
  })

  it('should render the actions card component based on support-strategies menu type', () => {
    // Given
    const params = {
      ...templateParams,
      actionMenuType: 'support-strategies',
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('[data-qa=support-strategies-actions]').length).toEqual(1)
    expect($('[data-qa=add-support-strategy-button]').length).toEqual(1)
    expect($('[data-qa=record-screener-results-button]').length).toEqual(0)
  })

  it('should render the actions card component based on menu type, default to esp actions', () => {
    // Given
    const params = {
      ...templateParams,
      actionMenuType: '',
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    // When no option is provided, default to the education support plan menu
    expect($('[data-qa=education-support-plan-actions]').length).toEqual(1)
  })
})
