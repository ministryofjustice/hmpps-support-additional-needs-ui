import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import type { ActionsCardParams } from 'viewModels'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'

nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

const userHasPermissionTo = jest.fn()
const templateParams: ActionsCardParams = {
  prisonerSummary: aValidPrisonerSummary(),
  userHasPermissionTo,
}

const template = 'actionCards.test.njk'

describe('Tests for Profile pages actions card component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the actions card component given the user has permissions for all actions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('li').length).toEqual(5) // expect all 5 links to be present
    // Assert each one in turn
    expect($('[data-qa=record-screener-results-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
    expect($('[data-qa=add-challenge-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
    expect($('[data-qa=add-strength-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect($('[data-qa=add-support-strategy-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
    expect($('[data-qa=add-conditions-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
  })

  it('should render the actions card component given the user has permissions for no actions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('li').length).toEqual(0) // expect 0 links to be present
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
  })

  it('should render the actions card component given the user only has permission to record ALN screeners', () => {
    // Given
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('li').length).toEqual(1) // expect 1 link to be present
    expect($('[data-qa=record-screener-results-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
  })

  it('should render the actions card component given the user only has permission to record challenges', () => {
    // Given
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('li').length).toEqual(1) // expect 1 link to be present
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
    expect($('[data-qa=add-challenge-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
  })

  it('should render the actions card component given the user only has permission to record strengths', () => {
    // Given
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('li').length).toEqual(1) // expect 1 link to be present
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
    expect($('[data-qa=add-strength-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
  })

  it('should render the actions card component given the user only has permission to record support strategies', () => {
    // Given
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('li').length).toEqual(1) // expect 1 link to be present
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect($('[data-qa=add-support-strategy-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
  })

  it('should render the actions card component given the user only has permission to record conditions', () => {
    // Given
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)
    const params = {
      ...templateParams,
    }

    // When
    const content = nunjucks.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('li').length).toEqual(1) // expect 1 link to be present
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_ALN_SCREENER')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SUPPORT_STRATEGIES')
    expect($('[data-qa=add-conditions-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
  })
})
