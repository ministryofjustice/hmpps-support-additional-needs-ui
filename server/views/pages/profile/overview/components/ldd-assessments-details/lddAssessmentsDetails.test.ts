import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import type { CuriousLddAssessmentDto } from 'dto'
import formatDateFilter from '../../../../../../filters/formatDateFilter'
import aValidPrisonerSummary from '../../../../../../testsupport/prisonerSummaryTestDataBuilder'
import formatPrisonerNameFilter, { NameFormat } from '../../../../../../filters/formatPrisonerNameFilter'
import { aCuriousLddAssessmentDto } from '../../../../../../testsupport/curiousAlnAndLddAssessmentsDtoTestDataBuilder'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatFirst_name_Last_name', formatPrisonerNameFilter(NameFormat.First_name_Last_name))

const prisonerSummary = aValidPrisonerSummary({ firstName: 'IFEREECA', lastName: 'PEIGH' })
const prisonNamesById = {
  BXI: 'Brixton (HMP)',
  LEI: 'Leeds (HMP)',
}
const templateParams = {
  prisonerSummary,
  prisonNamesById,
  lddAssessments: [aCuriousLddAssessmentDto()],
}

const template = 'lddAssessmentsDetails.test.njk'

describe('Tests for the LDD Assessments Details component', () => {
  it('should render the component', () => {
    // Given
    const params = {
      ...templateParams,
      lddAssessments: [
        aCuriousLddAssessmentDto({
          prisonId: 'LEI',
          rapidAssessmentDate: startOfDay('2024-10-13'),
          inDepthAssessmentDate: null,
          primaryLddAndHealthNeed: 'Dyslexia',
          additionalLddAndHealthNeeds: [],
        }),
        aCuriousLddAssessmentDto({
          prisonId: 'BXI',
          rapidAssessmentDate: startOfDay('2023-01-06'),
          inDepthAssessmentDate: startOfDay('2023-03-28'),
          primaryLddAndHealthNeed: 'Visual impairment',
          additionalLddAndHealthNeeds: ['Colour blindness', 'Short sightedness'],
        }),
      ],
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const assessmentAtLeeds = $('[data-qa=ldd-assessment-from-LEI]')
    expect(assessmentAtLeeds.length).toEqual(1)
    expect(assessmentAtLeeds.find('h3').text().trim().replaceAll(/\s\s+/g, ' ')).toEqual(
      `Ifereeca Peigh's learning difficulties, disabilities and health needs recorded whilst at Leeds (HMP)`,
    )
    expect(assessmentAtLeeds.find('[data-qa=rapid-assessment-date]').text().trim()).toEqual('13 October 2024')
    expect(assessmentAtLeeds.find('[data-qa=in-depth-assessment-date]').text().trim()).toEqual(
      'Not recorded in Curious',
    )
    expect(assessmentAtLeeds.find('[data-qa=primary-ldd-need]').text().trim()).toEqual('Dyslexia')
    expect(assessmentAtLeeds.find('[data-qa=additional-ldd-needs]').text().trim()).toEqual('Not recorded in Curious')

    const assessmentAtBrixton = $('[data-qa=ldd-assessment-from-BXI]')
    expect(assessmentAtBrixton.length).toEqual(1)
    expect(assessmentAtBrixton.find('h3').text().trim().replaceAll(/\s\s+/g, ' ')).toEqual(
      `Ifereeca Peigh's learning difficulties, disabilities and health needs recorded whilst at Brixton (HMP)`,
    )
    expect(assessmentAtBrixton.find('[data-qa=rapid-assessment-date]').text().trim()).toEqual('6 January 2023')
    expect(assessmentAtBrixton.find('[data-qa=in-depth-assessment-date]').text().trim()).toEqual('28 March 2023')
    expect(assessmentAtBrixton.find('[data-qa=primary-ldd-need]').text().trim()).toEqual('Visual impairment')
    expect(assessmentAtBrixton.find('[data-qa=additional-ldd-needs] li').eq(0).text().trim()).toEqual(
      'Colour blindness',
    )
    expect(assessmentAtBrixton.find('[data-qa=additional-ldd-needs] li').eq(1).text().trim()).toEqual(
      'Short sightedness',
    )
  })

  it('should render the component given prison name lookup does not resolve prisons', () => {
    // Given
    const params = {
      ...templateParams,
      prisonNamesById: {},
      lddAssessments: [
        aCuriousLddAssessmentDto({
          prisonId: 'LEI',
          rapidAssessmentDate: startOfDay('2024-10-13'),
          inDepthAssessmentDate: null,
          primaryLddAndHealthNeed: 'Dyslexia',
          additionalLddAndHealthNeeds: [],
        }),
        aCuriousLddAssessmentDto({
          prisonId: 'BXI',
          rapidAssessmentDate: startOfDay('2023-01-06'),
          inDepthAssessmentDate: startOfDay('2023-03-28'),
          primaryLddAndHealthNeed: 'Visual impairment',
          additionalLddAndHealthNeeds: ['Colour blindness', 'Short sightedness'],
        }),
      ],
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const assessmentAtLeeds = $('[data-qa=ldd-assessment-from-LEI]')
    expect(assessmentAtLeeds.length).toEqual(1)
    expect(assessmentAtLeeds.find('h3').text().trim().replaceAll(/\s\s+/g, ' ')).toEqual(
      `Ifereeca Peigh's learning difficulties, disabilities and health needs recorded whilst at LEI`,
    )

    const assessmentAtBrixton = $('[data-qa=ldd-assessment-from-BXI]')
    expect(assessmentAtBrixton.length).toEqual(1)
    expect(assessmentAtBrixton.find('h3').text().trim().replaceAll(/\s\s+/g, ' ')).toEqual(
      `Ifereeca Peigh's learning difficulties, disabilities and health needs recorded whilst at BXI`,
    )
  })

  it('should not render the component given no conditions', () => {
    // Given
    const params = { ...templateParams, lddAssessments: [] as Array<CuriousLddAssessmentDto> }

    // When
    const content = njkEnv.render(template, params)

    // Then
    expect(content.trim()).toEqual('')
  })
})
