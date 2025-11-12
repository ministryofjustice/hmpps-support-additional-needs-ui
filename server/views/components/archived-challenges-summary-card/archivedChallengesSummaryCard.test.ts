import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import type { ChallengeResponseDto } from 'dto'
import aValidChallengeResponseDto from '../../../testsupport/challengeResponseDtoTestDataBuilder'
import formatDateFilter from '../../../filters/formatDateFilter'
import { formatChallengeTypeScreenValueFilter } from '../../../filters/formatChallengeTypeFilter'
import ChallengeType from '../../../enums/challengeType'
import ChallengeCategory from '../../../enums/challengeCategory'
import ChallengeIdentificationSource from '../../../enums/challengeIdentificationSource'
import formatChallengeIdentificationSourceScreenValueFilter from '../../../filters/formatChallengeIdentificationSourceFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatChallengeTypeScreenValue', formatChallengeTypeScreenValueFilter)
  .addFilter('formatChallengeIdentificationSourceScreenValue', formatChallengeIdentificationSourceScreenValueFilter)

const prisonNamesById = {
  BXI: 'Brixton (HMP)',
  LEI: 'Leeds (HMP)',
}
const templateParams = {
  title: 'Literacy skills',
  archivedChallenges: [aValidChallengeResponseDto()],
  prisonNamesById,
}

const template = 'archivedChallengesSummaryCard.test.njk'

describe('Tests for Archived Challenges Summary Card component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the component given archived challenges', () => {
    // Given
    const params = {
      ...templateParams,
      archivedChallenges: [
        aValidChallengeResponseDto({
          challengeTypeCode: ChallengeType.WRITING,
          challengeCategory: ChallengeCategory.LITERACY_SKILLS,
          symptoms: 'Hand-written text is well written and easy to read',
          howIdentified: [ChallengeIdentificationSource.COLLEAGUE_INFO, ChallengeIdentificationSource.OTHER],
          howIdentifiedOther: `I have seen and experienced John's written text before`,
          fromALNScreener: false,
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10T09:01:00'),
          active: false,
          archiveReason: 'Challenge added for the wrong prisoner by mistake',
        }),
        aValidChallengeResponseDto({
          challengeTypeCode: ChallengeType.READING,
          challengeCategory: ChallengeCategory.LITERACY_SKILLS,
          symptoms: 'Can read at speed',
          howIdentified: [ChallengeIdentificationSource.EDUCATION_SKILLS_WORK],
          howIdentifiedOther: null,
          fromALNScreener: false,
          updatedByDisplayName: 'Person 1',
          updatedAtPrison: 'LEI',
          updatedAt: parseISO('2025-02-10T09:00:00'),
          active: false,
          archiveReason: 'Challenge added in error',
        }),
      ],
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    const archivedChallenges = $('.govuk-summary-list__row.archived-challenge')
    expect(archivedChallenges.length).toEqual(2)

    const firstChallenge = archivedChallenges.eq(0)
    expect(firstChallenge.find('p').eq(0).text().trim()).toEqual('Hand-written text is well written and easy to read')
    expect(firstChallenge.find('[data-qa=archived-challenge-how-identified] li').length).toEqual(2)
    expect(firstChallenge.find('[data-qa=archived-challenge-how-identified] li').eq(0).text().trim()).toEqual(
      'Based on information shared by colleagues or other professionals',
    ) // COLLEAGUE_INFO
    expect(firstChallenge.find('[data-qa=archived-challenge-how-identified] li').eq(1).text().trim()).toEqual(
      `I have seen and experienced John's written text before`,
    ) // 'other' text
    expect(firstChallenge.find('[data-qa=archived-challenge-audit]').text().trim()).toEqual(
      'Moved to history on 10 Feb 2025 by Person 1, Leeds (HMP)',
    )
    expect(firstChallenge.find('[data-qa=archived-challenge-reason]').text().trim()).toEqual(
      'Challenge added for the wrong prisoner by mistake',
    )

    const secondChallenge = archivedChallenges.eq(1)
    expect(secondChallenge.find('p').eq(0).text().trim()).toEqual('Can read at speed')
    expect(secondChallenge.find('[data-qa=archived-challenge-how-identified] li').length).toEqual(1)
    expect(secondChallenge.find('[data-qa=archived-challenge-how-identified] li').eq(0).text().trim()).toEqual(
      'Direct observation in education, skills and work',
    ) // EDUCATION_SKILLS_WORK
    expect(secondChallenge.find('[data-qa=archived-challenge-audit]').text().trim()).toEqual(
      'Moved to history on 10 Feb 2025 by Person 1, Leeds (HMP)',
    )
    expect(secondChallenge.find('[data-qa=archived-challenge-reason]').text().trim()).toEqual(
      'Challenge added in error',
    )
  })

  it('should not render the component given no challenges', () => {
    // Given
    const params = {
      ...templateParams,
      archivedChallenges: [] as Array<ChallengeResponseDto>,
    }

    // When
    const content = njkEnv.render(template, params)

    // Then
    expect(content.trim()).toEqual('')
  })
})
