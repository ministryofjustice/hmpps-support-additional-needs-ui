import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO, startOfToday } from 'date-fns'
import type { ChallengeResponseDto } from 'dto'
import formatDateFilter from '../../../filters/formatDateFilter'
import formatChallengeIdentificationSourceScreenValueFilter from '../../../filters/formatChallengeIdentificationSourceFilter'
import { formatChallengeTypeScreenValueFilter } from '../../../filters/formatChallengeTypeFilter'
import aValidChallengeResponseDto from '../../../testsupport/challengeResponseDtoTestDataBuilder'
import ChallengeType from '../../../enums/challengeType'
import ChallengeCategory from '../../../enums/challengeCategory'
import ChallengeIdentificationSource from '../../../enums/challengeIdentificationSource'
import challengeStaffSupportTextLookupFilter from '../../../filters/challengeStaffSupportTextLookupFilter'

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
  .addFilter('challengeSupportTextLookup', challengeStaffSupportTextLookupFilter)

const prisonNamesById = {
  BXI: 'Brixton (HMP)',
  LEI: 'Leeds (HMP)',
}
const userHasPermissionTo = jest.fn()
const templateParams = {
  title: 'Literacy skills',
  challengesData: {
    nonAlnChallenges: [aValidChallengeResponseDto()],
    latestAlnScreener: {
      createdAtPrison: 'BXI',
      screenerDate: startOfToday(),
      challenges: [
        aValidChallengeResponseDto({
          challengeTypeCode: ChallengeType.SENSORY,
          challengeCategory: ChallengeCategory.SENSORY,
        }),
      ],
    },
  },
  prisonNamesById,
  userHasPermissionTo,
  showActions: true,
}

const template = 'challengesSummaryCard.test.njk'

describe('Tests for Challenges Summary Card component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the component given non-ALN and ALN challenges', () => {
    // Given
    const params = {
      ...templateParams,
      challengesData: {
        nonAlnChallenges: [
          aValidChallengeResponseDto({
            challengeTypeCode: ChallengeType.WRITING,
            challengeCategory: ChallengeCategory.LITERACY_SKILLS,
            symptoms: 'Hand-written text is not neat and hard to read',
            howIdentified: [ChallengeIdentificationSource.COLLEAGUE_INFO, ChallengeIdentificationSource.OTHER],
            howIdentifiedOther: `I have seen and experienced John's written text before`,
            fromALNScreener: false,
            updatedByDisplayName: 'Person 1',
            updatedAtPrison: 'LEI',
            updatedAt: parseISO('2025-02-10T09:01:00'),
          }),
          aValidChallengeResponseDto({
            challengeTypeCode: ChallengeType.READING,
            challengeCategory: ChallengeCategory.LITERACY_SKILLS,
            symptoms: 'Is very slow at reading',
            howIdentified: [ChallengeIdentificationSource.EDUCATION_SKILLS_WORK],
            howIdentifiedOther: null,
            fromALNScreener: false,
            updatedByDisplayName: 'Person 1',
            updatedAtPrison: 'LEI',
            updatedAt: parseISO('2025-02-10T09:00:00'),
          }),
        ],
        latestAlnScreener: {
          createdAtPrison: 'BXI',
          screenerDate: parseISO('2025-06-13'),
          challenges: [
            aValidChallengeResponseDto({
              challengeTypeCode: ChallengeType.SENSORY,
              challengeCategory: ChallengeCategory.SENSORY,
              symptoms: null,
              howIdentified: null,
              howIdentifiedOther: null,
              fromALNScreener: true,
              createdByDisplayName: 'Person 3',
              createdAtPrison: 'BXI',
              createdAt: parseISO('2025-06-13'),
            }),
          ],
        },
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    // assert non-ALN challenges
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(2)

    const firstChallenge = nonAlnChallenges.eq(0)
    expect(firstChallenge.find('p').eq(0).text().trim()).toEqual('Hand-written text is not neat and hard to read')
    expect(firstChallenge.find('[data-qa=non-aln-challenge-how-identified] li').length).toEqual(2)
    expect(firstChallenge.find('[data-qa=non-aln-challenge-how-identified] li').eq(0).text().trim()).toEqual(
      'Based on information shared by colleagues or other professionals',
    ) // COLLEAGUE_INFO
    expect(firstChallenge.find('[data-qa=non-aln-challenge-how-identified] li').eq(1).text().trim()).toEqual(
      `I have seen and experienced John's written text before`,
    ) // 'other' text
    expect(firstChallenge.find('[data-qa=non-aln-challenge-audit]').text().trim()).toEqual(
      'Last updated 10 Feb 2025 by Person 1, Leeds (HMP)',
    )

    const secondChallenge = nonAlnChallenges.eq(1)
    expect(secondChallenge.find('p').eq(0).text().trim()).toEqual('Is very slow at reading')
    expect(secondChallenge.find('[data-qa=non-aln-challenge-how-identified] li').length).toEqual(1)
    expect(secondChallenge.find('[data-qa=non-aln-challenge-how-identified] li').eq(0).text().trim()).toEqual(
      'Direct observation in education, skills and work',
    ) // EDUCATION_SKILLS_WORK
    expect(secondChallenge.find('[data-qa=non-aln-challenge-audit]').text().trim()).toEqual(
      'Last updated 10 Feb 2025 by Person 1, Leeds (HMP)',
    )

    // assert ALN challenges
    const alnChallenges = $('.govuk-summary-list__row.aln-challenges li')
    expect(alnChallenges.length).toEqual(1)
    expect(alnChallenges.eq(0).find('summary').text().trim()).toEqual('Sensory') // SENSORY
    expect($('[data-qa=aln-challenges-audit]').text().trim()).toEqual(
      'From Additional Learning Needs Screener completed on 13 Jun 2025, Brixton (HMP)',
    )
  })

  it('should render the component given only non-ALN challenges and no ALN Screener at all', () => {
    // Given
    const params = {
      ...templateParams,
      challengesData: {
        nonAlnChallenges: [
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
          }),
        ],
        latestAlnScreener: {},
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    // assert non-ALN challenges
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(1)

    const firstChallenge = nonAlnChallenges.eq(0)
    expect(firstChallenge.find('p').eq(0).text().trim()).toEqual('Hand-written text is well written and easy to read')
    expect(firstChallenge.find('[data-qa=non-aln-challenge-how-identified] li').length).toEqual(2)
    expect(firstChallenge.find('[data-qa=non-aln-challenge-how-identified] li').eq(0).text().trim()).toEqual(
      'Based on information shared by colleagues or other professionals',
    ) // COLLEAGUE_INFO
    expect(firstChallenge.find('[data-qa=non-aln-challenge-how-identified] li').eq(1).text().trim()).toEqual(
      `I have seen and experienced John's written text before`,
    ) // 'other' text
    expect(firstChallenge.find('[data-qa=non-aln-challenge-audit]').text().trim()).toEqual(
      'Last updated 10 Feb 2025 by Person 1, Leeds (HMP)',
    )

    // assert ALN challenges
    const alnChallenges = $('.govuk-summary-list__row.aln-challenges li')
    expect(alnChallenges.length).toEqual(0)
  })

  it('should render the component given only ALN challenges', () => {
    // Given
    const params = {
      ...templateParams,
      challengesData: {
        nonAlnChallenges: [] as Array<ChallengeResponseDto>,
        latestAlnScreener: {
          createdAtPrison: 'BXI',
          screenerDate: parseISO('2025-06-13'),
          challenges: [
            aValidChallengeResponseDto({
              challengeTypeCode: ChallengeType.SENSORY,
              challengeCategory: ChallengeCategory.SENSORY,
              symptoms: null,
              howIdentified: null,
              howIdentifiedOther: null,
              fromALNScreener: true,
              createdByDisplayName: 'Person 3',
              createdAtPrison: 'BXI',
              createdAt: parseISO('2025-06-13'),
            }),
          ],
        },
      },
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    // assert non-ALN challenges
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(0)

    // assert ALN challenges
    const alnChallenges = $('.govuk-summary-list__row.aln-challenges li')
    expect(alnChallenges.length).toEqual(1)
    expect(alnChallenges.eq(0).find('summary').text().trim()).toEqual('Sensory') // SENSORY
    expect($('[data-qa=aln-challenges-audit]').text().trim()).toEqual(
      'From Additional Learning Needs Screener completed on 13 Jun 2025, Brixton (HMP)',
    )
  })

  it('should render the component given prisonNamesById does not contain the prison', () => {
    // Given
    const params = {
      ...templateParams,
      challengesData: {
        nonAlnChallenges: [] as Array<ChallengeResponseDto>,
        latestAlnScreener: {
          createdAtPrison: 'BXI',
          screenerDate: parseISO('2025-06-13'),
          challenges: [
            aValidChallengeResponseDto({
              challengeTypeCode: ChallengeType.SENSORY,
              challengeCategory: ChallengeCategory.SENSORY,
              symptoms: null,
              howIdentified: null,
              howIdentifiedOther: null,
              fromALNScreener: true,
              createdByDisplayName: 'Person 3',
              createdAtPrison: 'BXI',
              createdAt: parseISO('2025-06-13'),
            }),
          ],
        },
      },
      prisonNamesById: {},
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    expect($('.govuk-summary-card__title').text().trim()).toEqual('Literacy skills')

    // assert non-ALN challenges
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(0)

    // assert ALN challenges
    const alnChallenges = $('.govuk-summary-list__row.aln-challenges li')
    expect(alnChallenges.length).toEqual(1)
    expect(alnChallenges.eq(0).find('summary').text().trim()).toEqual('Sensory') // SENSORY
    expect($('[data-qa=aln-challenges-audit]').text().trim()).toEqual(
      'From Additional Learning Needs Screener completed on 13 Jun 2025, BXI',
    )
  })

  it('should not render the component given no challenges', () => {
    // Given
    const params = {
      ...templateParams,
      challengesData: {
        nonAlnChallenges: [] as Array<ChallengeResponseDto>,
        latestAlnScreener: {
          createdAtPrison: 'BXI',
          screenerDate: startOfToday(),
          challenges: [] as Array<ChallengeResponseDto>,
        },
      },
    }

    // When
    const content = njkEnv.render(template, params)

    // Then
    expect(content.trim()).toEqual('')
  })

  it('should not render any actions given the showActions flag is false', () => {
    const params = {
      ...templateParams,
      challengesData: {
        ...templateParams.challengesData,
        nonAlnChallenges: [aValidChallengeResponseDto()],
      },
      showActions: false,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('.govuk-summary-card__actions').length).toEqual(0)
    expect(userHasPermissionTo).not.toHaveBeenCalled()
  })

  it('should not render any actions given the showActions flag is true but the user does not have any permissions', () => {
    userHasPermissionTo.mockReturnValue(false)

    const params = {
      ...templateParams,
      challengesData: {
        ...templateParams.challengesData,
        nonAlnChallenges: [aValidChallengeResponseDto()],
      },
      showActions: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('[data-qa=edit-challenge-button]').length).toEqual(0)
    expect(nonAlnChallenges.eq(0).find('[data-qa=archive-challenge-button]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_CHALLENGES')
  })

  it('should render edit challenge action given the showActions flag is true and the user only has permission to edit challenges', () => {
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)

    const params = {
      ...templateParams,
      challengesData: {
        ...templateParams.challengesData,
        nonAlnChallenges: [aValidChallengeResponseDto()],
      },
      showActions: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('[data-qa=edit-challenge-button]').length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('[data-qa=archive-challenge-button]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_CHALLENGES')
  })

  it('should render archive challenge action given the showActions flag is true and the user only has permission to archive challenges', () => {
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)

    const params = {
      ...templateParams,
      challengesData: {
        ...templateParams.challengesData,
        nonAlnChallenges: [aValidChallengeResponseDto()],
      },
      showActions: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('[data-qa=edit-challenge-button]').length).toEqual(0)
    expect(nonAlnChallenges.eq(0).find('[data-qa=archive-challenge-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_CHALLENGES')
  })

  it('should render both challenge actions given the showActions flag is true and the user has permissions to edit and archive challenges', () => {
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
      challengesData: {
        ...templateParams.challengesData,
        nonAlnChallenges: [aValidChallengeResponseDto()],
      },
      showActions: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const nonAlnChallenges = $('.govuk-summary-list__row.non-aln-challenge')
    expect(nonAlnChallenges.length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('[data-qa=edit-challenge-button]').length).toEqual(1)
    expect(nonAlnChallenges.eq(0).find('[data-qa=archive-challenge-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_CHALLENGES')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_CHALLENGES')
  })
})
