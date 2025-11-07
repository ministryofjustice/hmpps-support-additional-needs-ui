import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatPrisonerNameFilter, { NameFormat } from '../../../../filters/formatPrisonerNameFilter'
import formatConditionTypeScreenValueFilter from '../../../../filters/formatConditionTypeFilter'
import findErrorFilter from '../../../../filters/findErrorFilter'
import conditionsThatRequireNaming from '../../../../routes/conditions/conditionsThatRequireNaming'

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
    conditions: [] as Array<string>,
  },
  conditionsThatRequireNaming,
}

describe('Select Conditions', () => {
  it('should render template given the user does not have permissions to create diagnosed conditions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)

    const params = { ...templateParams }

    // When
    const content = nunjucks.render('index.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('h1').text().trim()).toEqual('What self-declared condition do you want to record for Ifereeca Peigh?')
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
      'What self-declared or diagnosed condition do you want to record for Ifereeca Peigh?',
    )
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_DIAGNOSED_CONDITIONS')
  })
})
