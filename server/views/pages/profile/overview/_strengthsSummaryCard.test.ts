import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'
import formatStrengthCategoryScreenValueFilter from '../../../../filters/formatStrengthCategoryFilter'
import StrengthCategory from '../../../../enums/strengthCategory'

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
  .addFilter('formatStrengthCategoryScreenValue', formatStrengthCategoryScreenValueFilter)

const prisonNumber = 'A1234BC'
const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
const template = '_strengthsSummaryCard.njk'

const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary,
  strengthCategories: Result.fulfilled([StrengthCategory.LITERACY_SKILLS, StrengthCategory.NUMERACY_SKILLS]),
  userHasPermissionTo,
}

describe('_strengthsSummaryCard', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the summary card given the prisoner has Strengths', () => {
    // Given
    const params = {
      ...templateParams,
      strengthCategories: Result.fulfilled([
        StrengthCategory.ATTENTION_ORGANISING_TIME,
        StrengthCategory.LITERACY_SKILLS,
        StrengthCategory.MEMORY,
        StrengthCategory.NUMERACY_SKILLS,
        StrengthCategory.SENSORY,
      ]),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(1)
    expect($('[data-qa=view-strengths-button]').length).toEqual(1)

    const strengthListItems = $('.govuk-summary-card__content li')
    expect(strengthListItems.length).toEqual(5) // Expect 5 list items, one for each Strength
    expect(strengthListItems.eq(0).text().trim()).toEqual('Attention, organising and time management')
    expect(strengthListItems.eq(1).text().trim()).toEqual('Literacy skills')
    expect(strengthListItems.eq(2).text().trim()).toEqual('Memory')
    expect(strengthListItems.eq(3).text().trim()).toEqual('Numeracy skills')
    expect(strengthListItems.eq(4).text().trim()).toEqual('Sensory')

    expect($('[data-qa=no-strengths-recorded-message]').length).toEqual(0)
    expect($('[data-qa=strengths-unavailable-message]').length).toEqual(0)
  })

  it('should render the summary card given the prisoner has no Strengths and the user has permission to create Strengths', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
      strengthCategories: Result.fulfilled([]),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(1)
    expect($('[data-qa=add-strength-button]').length).toEqual(1)
    expect($('[data-qa=no-strengths-recorded-message]').length).toEqual(1)
    expect($('[data-qa=strengths-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
  })

  it('should render the summary card given the prisoner has no Strengths and the user does not have permission to create Strengths', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)

    const params = {
      ...templateParams,
      strengthCategories: Result.fulfilled([]),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(0) // Expect no actions in the summary card header because the user does not have permission to create Strengths
    expect($('[data-qa=no-strengths-recorded-message]').length).toEqual(1)
    expect($('[data-qa=strengths-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
  })

  it('should render the summary card given the Strengths service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      strengthCategories: Result.rejected(new Error('Failed to get strengths')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(0) // Expect no actions in the summary card header - The API to return the Strengths failed so we do not know whether to show the "add" or "view" link
    expect($('[data-qa=strengths-unavailable-message]').length).toEqual(1)
  })
})
