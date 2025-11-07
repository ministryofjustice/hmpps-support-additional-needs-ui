import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import aValidPrisonerSummary from '../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatPrisonerNameFilter, { NameFormat } from '../../../../../filters/formatPrisonerNameFilter'
import formatConditionTypeScreenValueFilter from '../../../../../filters/formatConditionTypeFilter'
import findErrorFilter from '../../../../../filters/findErrorFilter'
import { aValidConditionDto } from '../../../../../testsupport/conditionDtoTestDataBuilder'
import ConditionType from '../../../../../enums/conditionType'
import ConditionSource from '../../../../../enums/conditionSource'
import conditionsThatRequireNaming from '../../../../../routes/conditions/conditionsThatRequireNaming'

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
const conditionDto = aValidConditionDto({
  conditionTypeCode: ConditionType.VISUAL_IMPAIR,
  source: ConditionSource.SELF_DECLARED,
  conditionName: 'Colour blindness',
  conditionDetails: 'Has red-green colour blindness',
})
const templateParams = {
  prisonerSummary,
  userHasPermissionTo,
  form: {
    conditionSource: 'SELF_DECLARED',
    conditionDetails: 'Has red-green colour blindness',
    conditionName: 'Colour blindness',
  },
  dto: conditionDto,
  conditionsThatRequireNaming,
}

describe('Edit Condition - Detail page', () => {
  it('should render template given the user does not have permissions to record diagnosed conditions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(false)

    const params = { ...templateParams }

    // When
    const content = nunjucks.render('index.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('h1').text().trim()).toEqual(`Edit Ifereeca Peigh's condition details`)
    expect($('h2').text().trim()).toEqual('Visual impairment')
    expect($('input[type=radio]').length).toEqual(0) // expect no radio buttons as the user does not have permission to record diagnosed conditions, so is not asked about them
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_DIAGNOSED_CONDITIONS')
  })

  it('should render template given the user has permissions to record diagnosed conditions', () => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = { ...templateParams }

    // When
    const content = nunjucks.render('index.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('h1').text().trim()).toEqual(`Edit Ifereeca Peigh's condition details`)
    expect($('h2').text().trim()).toEqual('Visual impairment')
    expect($('input[type=radio]').length).toEqual(2) // expect 2 radio buttons as the user has permission to record diagnosed conditions, so is offered the choice to change the answer
    expect(userHasPermissionTo).toHaveBeenCalledWith('RECORD_DIAGNOSED_CONDITIONS')
  })

  it.each([
    ConditionType.ABI,
    ConditionType.ADHD,
    ConditionType.ASC,
    ConditionType.DLD_LANG,
    ConditionType.LD_DOWN,
    ConditionType.DYSCALCULIA,
    ConditionType.DYSLEXIA,
    ConditionType.DYSPRAXIA,
    ConditionType.FASD,
    ConditionType.DLD_HEAR,
    ConditionType.TOURETTES,
  ])('should render template without condition name field given condition type %s', conditionType => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = { ...templateParams, dto: aValidConditionDto({ conditionTypeCode: conditionType }) }

    // When
    const content = nunjucks.render('index.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('input[name=conditionName]').length).toEqual(0)
  })

  it.each([
    ConditionType.LD_OTHER,
    ConditionType.MENTAL_HEALTH,
    ConditionType.NEURODEGEN,
    ConditionType.PHYSICAL_OTHER,
    ConditionType.VISUAL_IMPAIR,
    ConditionType.OTHER,
    ConditionType.DLD_OTHER,
    ConditionType.LEARN_DIFF_OTHER,
    ConditionType.LONG_TERM_OTHER,
    ConditionType.NEURO_OTHER,
  ])('should render template with condition name field given condition type %s', conditionType => {
    // Given
    userHasPermissionTo.mockReturnValue(true)

    const params = { ...templateParams, dto: aValidConditionDto({ conditionTypeCode: conditionType }) }

    // When
    const content = nunjucks.render('index.njk', params)
    const $ = cheerio.load(content)

    // Then
    expect($('input[name=conditionName]').length).toEqual(1)
  })
})
