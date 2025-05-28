import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { startOfDay } from 'date-fns'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import formatDate from '../../../filters/formatDateFilter'
import formatPrisonerNameFilter, { NameFormat } from '../../../filters/formatPrisonerNameFilter'

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
  .addFilter('formatLast_name_comma_First_name', formatPrisonerNameFilter(NameFormat.Last_name_comma_First_name))

describe('Test for the Prisoner Summary Banner component', () => {
  it('should render the component given all dates fields are populated with 2 digit days', () => {
    // Given
    const params = {
      prisonerSummary: aValidPrisonerSummary({
        prisonNumber: 'A1234AA',
        firstName: 'IFEREECA',
        lastName: 'PEIGH',
        releaseDate: startOfDay('2025-12-31'),
        receptionDate: startOfDay('1999-08-29'),
        dateOfBirth: startOfDay('1969-02-12'),
      }),
    }

    // When
    const content = njkEnv.render('template.njk', { params })
    const $ = cheerio.load(content)

    // Then
    const prisonerSummaryBanner = $('.prisoner-summary-banner')
    expect(prisonerSummaryBanner.find('dl dt').eq(0).text().trim()).toEqual('Peigh, Ifereeca')
    expect(prisonerSummaryBanner.find('dl dd').eq(0).text().trim()).toEqual('A1234AA')
    expect(prisonerSummaryBanner.find('dl dd').eq(1).text().trim()).toEqual('29 Aug 1999')
    expect(prisonerSummaryBanner.find('dl dd').eq(2).text().trim()).toEqual('31 Dec 2025')
    expect(prisonerSummaryBanner.find('dl dd').eq(3).text().trim()).toEqual('12 Feb 1969')
  })

  it('should render the component given all dates fields are populated with 1 digit days and release date it not present', () => {
    // Given
    const params = {
      prisonerSummary: aValidPrisonerSummary({
        prisonNumber: 'A1234AA',
        firstName: 'IFEREECA',
        lastName: 'PEIGH',
        releaseDate: null,
        receptionDate: startOfDay('1999-08-09'),
        dateOfBirth: startOfDay('1969-02-02'),
      }),
    }

    // When
    const content = njkEnv.render('template.njk', { params })
    const $ = cheerio.load(content)

    // Then
    const prisonerSummaryBanner = $('.prisoner-summary-banner')
    expect(prisonerSummaryBanner.find('dl dt').eq(0).text().trim()).toEqual('Peigh, Ifereeca')
    expect(prisonerSummaryBanner.find('dl dd').eq(0).text().trim()).toEqual('A1234AA')
    expect(prisonerSummaryBanner.find('dl dd').eq(1).text().trim()).toEqual('9 Aug 1999')
    expect(prisonerSummaryBanner.find('dl dd').eq(2).text().trim()).toEqual('N/A')
    expect(prisonerSummaryBanner.find('dl dd').eq(3).text().trim()).toEqual('2 Feb 1969')
  })
})
