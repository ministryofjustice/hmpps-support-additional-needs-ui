import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import filterArrayOnPropertyFilter from '../../../../filters/filterArrayOnPropertyFilter'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../../utils/result/result'
import { aValidConditionDto, aValidConditionsList } from '../../../../testsupport/conditionDtoTestDataBuilder'
import formatConditionTypeScreenValueFilter from '../../../../filters/formatConditionTypeFilter'
import ConditionType from '../../../../enums/conditionType'
import ConditionSource from '../../../../enums/conditionSource'

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
  .addFilter('filterArrayOnProperty', filterArrayOnPropertyFilter)
  .addFilter('formatConditionTypeScreenValue', formatConditionTypeScreenValueFilter)

const prisonNumber = 'A1234BC'
const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
const template = '_conditionsSummaryCard.njk'

const userHasPermissionTo = jest.fn()
const templateParams = {
  prisonerSummary,
  conditions: Result.fulfilled(aValidConditionsList()),
  userHasPermissionTo,
}

describe('_conditionsSummaryCard', () => {
  beforeEach(() => {
    jest.resetAllMocks()
    userHasPermissionTo.mockReturnValue(true)
  })

  it('should render the summary card given the prisoner has Conditions', () => {
    // Given
    const params = {
      ...templateParams,
      conditions: Result.fulfilled(
        aValidConditionsList({
          conditions: [
            aValidConditionDto({
              conditionTypeCode: ConditionType.TOURETTES,
              conditionName: null,
              source: ConditionSource.CONFIRMED_DIAGNOSIS,
            }),
            aValidConditionDto({
              conditionTypeCode: ConditionType.VISUAL_IMPAIR,
              conditionName: 'Colour blindness',
              source: ConditionSource.CONFIRMED_DIAGNOSIS,
            }),
            aValidConditionDto({
              conditionTypeCode: ConditionType.ADHD,
              conditionName: null,
              source: ConditionSource.SELF_DECLARED,
            }),
            aValidConditionDto({
              conditionTypeCode: ConditionType.DYSLEXIA,
              conditionName: null,
              source: ConditionSource.SELF_DECLARED,
            }),
          ],
        }),
      ),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(1)
    expect($('[data-qa=view-conditions-button]').length).toEqual(1)
    expect($('.govuk-summary-list__row').length).toEqual(4) // Expect 4 rows, one for each Condition

    expect($('[data-qa=confirmed-diagnosis-condition_TOURETTES] p').eq(0).text().trim()).toEqual(
      `Tourette's syndrome or tic disorder (Confirmed diagnosis)`,
    )
    expect($('[data-qa=confirmed-diagnosis-condition_TOURETTES] p').eq(1).length).toEqual(0)
    expect($('[data-qa=confirmed-diagnosis-condition_VISUAL_IMPAIR] p').eq(0).text().trim()).toEqual(
      'Visual impairment (Confirmed diagnosis)',
    )
    expect($('[data-qa=confirmed-diagnosis-condition_VISUAL_IMPAIR] p').eq(1).text().trim()).toEqual('Colour blindness')
    expect($('[data-qa=self-declared-condition_ADHD] p').eq(0).text().trim()).toEqual(
      'Attention deficit hyperactivity disorder (ADHD or ADD) (Self-declared)',
    )
    expect($('[data-qa=self-declared-condition_ADHD] p').eq(1).length).toEqual(0)
    expect($('[data-qa=self-declared-condition_DYSLEXIA] p').eq(0).text().trim()).toEqual('Dyslexia (Self-declared)')
    expect($('[data-qa=self-declared-condition_DYSLEXIA] p').eq(1).length).toEqual(0)

    expect($('[data-qa=no-conditions-recorded-message]').length).toEqual(0)
    expect($('[data-qa=conditions-unavailable-message]').length).toEqual(0)
  })

  it('should render the summary card given the prisoner has no Conditions and the user has permission to create Conditions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
      conditions: Result.fulfilled(aValidConditionsList({ conditions: [] })),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(1)
    expect($('[data-qa=add-condition-button]').length).toEqual(1)
    expect($('[data-qa=no-conditions-recorded-message]').length).toEqual(1)
    expect($('[data-qa=conditions-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
  })

  it('should render the summary card given the prisoner has no Conditions and the user does not have permission to create Conditions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)

    const params = {
      ...templateParams,
      conditions: Result.fulfilled(aValidConditionsList({ conditions: [] })),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(0) // Expect no actions in the summary card header because the user does not have permission to create Conditions
    expect($('[data-qa=no-conditions-recorded-message]').length).toEqual(1)
    expect($('[data-qa=conditions-unavailable-message]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_SELF_DECLARED_CONDITIONS')
  })

  it('should render the summary card given the Conditions service API promise is not resolved', () => {
    // Given
    const params = {
      ...templateParams,
      conditions: Result.rejected(new Error('Failed to get conditions')),
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__actions li').length).toEqual(0) // Expect no actions in the summary card header - The API to return the Conditions failed so we do not know whether to show the "add" or "view" link
    expect($('[data-qa=conditions-unavailable-message]').length).toEqual(1)
  })
})
