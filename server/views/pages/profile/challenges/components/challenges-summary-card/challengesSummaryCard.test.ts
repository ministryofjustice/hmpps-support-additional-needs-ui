import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO } from 'date-fns'
import type { ChallengeResponseDto } from 'dto'
import formatDateFilter from '../../../../../../filters/formatDateFilter'
import formatStrengthIdentificationSourceScreenValueFilter from '../../../../../../filters/formatStrengthIdentificationSourceFilter'
import { formatChallengeTypeScreenValueFilter } from '../../../../../../filters/formatChallengeTypeFilter'
import aValidChallengeResponseDto from '../../../../../../testsupport/challengeResponseDtoTestDataBuilder'
import ChallengeType from '../../../../../../enums/challengeType'
import ChallengeCategory from '../../../../../../enums/challengeCategory'
import ChallengeIdentificationSource from '../../../../../../enums/challengeIdentificationSource'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatChallengeTypeScreenValue', formatChallengeTypeScreenValueFilter)
  .addFilter('formatStrengthIdentificationSourceScreenValue', formatStrengthIdentificationSourceScreenValueFilter)

const template = 'challengesSummaryCard.test.njk'
const alnTemplate = 'alnChallengesSummaryCard.test.njk'

describe('Tests for Challenges Summary Card component', () => {
  it('should render the component given a non ALN Challenge', () => {
    // Given
    const challenge = aValidChallengeResponseDto({
      challengeTypeCode: ChallengeType.LANGUAGE_COMM_SKILLS_DEFAULT,
      challengeCategory: ChallengeCategory.LANGUAGE_COMM_SKILLS,
      symptoms: 'Talking is hard',
      howIdentified: [ChallengeIdentificationSource.CONVERSATIONS],
      howIdentifiedOther: null,
      fromALNScreener: false,
      createdByDisplayName: 'Person 3',
      createdAtPrison: 'BXI',
      createdAt: parseISO('2025-02-13'),
      updatedAt: parseISO('2025-02-15'),
      updatedByDisplayName: 'Person 3',
    })

    // When
    const content = njkEnv.render(template, { challenge })
    const $ = cheerio.load(content)

    // Then
    // assert ALN Challenge details
    const challengeRow = $('.govuk-summary-list__row')
    expect(challengeRow.length).toEqual(1)

    const challengeRowElement = challengeRow.eq(0)
    expect(challengeRowElement.find('p').eq(0).text().trim()).toEqual('Talking is hard')
    expect(challengeRowElement.find('[data-qa=non-aln-challenge-how-identified] li').length).toEqual(1)
    expect(challengeRowElement.find('[data-qa=non-aln-challenge-how-identified] li').eq(0).text().trim()).toEqual(
      'Through conversations with the individual',
    ) // CONVERSATIONS
    expect(challengeRowElement.find('[data-qa=non-aln-challenge-audit]').text().trim()).toEqual(
      'Added on 15 February 2025 by Person 3',
    )
  })

  it('should not render the non aln component given no challenges', () => {
    // Given
    const challenge: ChallengeResponseDto = null

    // When
    const content = njkEnv.render(template, { challenge })

    // Then
    expect(content.trim()).toEqual('')
  })

  /**
   * ALN Card tests, the aln macro takes an array of challenges to add to one summary card row
   */
  it('should not render the aln component given no challenges', () => {
    // Given
    const challenges = new Array<ChallengeResponseDto>()

    // When
    const content = njkEnv.render(alnTemplate, challenges)

    // Then
    expect(content.trim()).toEqual('')
  })

  it('should render the component given a ALN Challenge', () => {
    // Given
    const alnChallenges = [
      aValidChallengeResponseDto({
        challengeTypeCode: ChallengeType.COMMUNICATION,
        challengeCategory: ChallengeCategory.LANGUAGE_COMM_SKILLS,
        symptoms: 'Talking is hard',
        howIdentified: [ChallengeIdentificationSource.CONVERSATIONS],
        howIdentifiedOther: null,
        fromALNScreener: true,
        createdByDisplayName: 'Person 3',
        createdAtPrison: 'BXI',
        createdAt: parseISO('2025-02-13'),
        updatedAt: parseISO('2025-02-15'),
        updatedByDisplayName: 'Person 3',
      }),
    ]

    // When
    const content = njkEnv.render(alnTemplate, { alnChallenges })
    const $ = cheerio.load(content)

    // Then
    // assert ALN Challenge details
    const challengeRow = $('.govuk-summary-list__row')
    expect(challengeRow.length).toEqual(1)

    const challengeRowElement = challengeRow.eq(0)
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail]').length).toEqual(1)
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail] summary').eq(0).text().trim()).toEqual(
      'Communication',
    )
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail] div').eq(0).text().trim()).toEqual(
      'We will look up some supporting information in here',
    )
  })

  it('should render multiple details for each ALN Challenge', () => {
    // Given
    const alnChallenges = [
      aValidChallengeResponseDto({
        challengeTypeCode: ChallengeType.COMMUNICATION,
        challengeCategory: ChallengeCategory.LANGUAGE_COMM_SKILLS,
        symptoms: 'Talking is hard',
        howIdentified: [ChallengeIdentificationSource.CONVERSATIONS],
        howIdentifiedOther: null,
        fromALNScreener: true,
        createdByDisplayName: 'Person 3',
        createdAtPrison: 'BXI',
        createdAt: parseISO('2025-02-13'),
        updatedAt: parseISO('2025-02-15'),
        updatedByDisplayName: 'Person 3',
      }),
      aValidChallengeResponseDto({
        challengeTypeCode: ChallengeType.HANDWRITING,
        challengeCategory: ChallengeCategory.LITERACY_SKILLS,
        symptoms: 'Talking is hard',
        howIdentified: [ChallengeIdentificationSource.CONVERSATIONS],
        howIdentifiedOther: null,
        fromALNScreener: true,
        createdByDisplayName: 'Person 3',
        createdAtPrison: 'BXI',
        createdAt: parseISO('2025-02-13'),
        updatedAt: parseISO('2025-02-15'),
        updatedByDisplayName: 'Person 3',
      }),
    ]

    // When
    const content = njkEnv.render(alnTemplate, { alnChallenges })
    const $ = cheerio.load(content)

    // Then
    // assert ALN Challenge details
    const challengeRow = $('.govuk-summary-list__row')
    expect(challengeRow.length).toEqual(1)

    const challengeRowElement = challengeRow.eq(0)
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail]').length).toEqual(2)
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail] summary').eq(0).text().trim()).toEqual(
      'Communication',
    )
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail] div').eq(0).text().trim()).toEqual(
      'We will look up some supporting information in here',
    )
    // Verify the second details for the second challenge
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail] summary').eq(1).text().trim()).toEqual(
      'Handwriting',
    )
    expect(challengeRowElement.find('[data-qa=aln-challenge-detail] div').eq(1).text().trim()).toEqual(
      'We will look up some supporting information in here',
    )
  })
})
