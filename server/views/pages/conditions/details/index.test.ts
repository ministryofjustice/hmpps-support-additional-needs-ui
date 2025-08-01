import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatPrisonerNameFilter, { NameFormat } from '../../../../filters/formatPrisonerNameFilter'
import formatConditionTypeScreenValueFilter from '../../../../filters/formatConditionTypeFilter'
import findErrorFilter from '../../../../filters/findErrorFilter'
import { aValidConditionDto, aValidConditionsList } from '../../../../testsupport/conditionDtoTestDataBuilder'
import ConditionType from '../../../../enums/conditionType'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])
njkEnv //
  .addFilter('assetMap', () => '')
  .addFilter('formatFirst_name_Last_name', formatPrisonerNameFilter(NameFormat.First_name_Last_name))
  .addFilter('formatConditionTypeScreenValue', formatConditionTypeScreenValueFilter)
  .addFilter('findError', findErrorFilter)

const userHasPermissionTo = jest.fn()
const prisonerSummary = aValidPrisonerSummary({ firstName: 'IFEREECA', lastName: 'PEIGH' })
const templateParams = {
  prisonerSummary,
  userHasPermissionTo,
  form: {
    conditionDetails: {},
  },
  dto: aValidConditionsList({
    conditions: [
      aValidConditionDto({ conditionTypeCode: ConditionType.ADHD }),
      aValidConditionDto({ conditionTypeCode: ConditionType.DYSLEXIA }),
    ],
  }),
}

describe('Add Conditions - Details page', () => {
  it('should render template given the user does not have permissions to create diagnosed conditions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)

    const params = { ...templateParams }

    // When
    const content = nunjucks.render('index.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('h1').text().trim()).toEqual(`Provide details for Ifereeca Peigh's self-declared conditions`)
    expect($('input[type=radio]').length).toEqual(0) // expect no radio buttons as the user does not have permission to create diagnosed conditions, so is not asked about them
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_DIAGNOSED_CONDITIONS')
  })

  it('should render template given the user has permissions to create diagnosed conditions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = { ...templateParams }

    // When
    const content = nunjucks.render('index.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('h1').text().trim()).toEqual(
      'Select if the condition is self-declared by Ifereeca Peigh or a confirmed diagnosis',
    )
    expect($('input[type=radio]').length).toEqual(4) // expect 4 radio buttons as the user has permission to create diagnosed conditions, so is asked about them (the DTO has 2 conditions; 2 radios for each condition)
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_DIAGNOSED_CONDITIONS')
  })
})
