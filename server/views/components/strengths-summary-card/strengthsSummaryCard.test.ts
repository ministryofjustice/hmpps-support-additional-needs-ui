import nunjucks from 'nunjucks'
import * as cheerio from 'cheerio'
import { parseISO, startOfToday } from 'date-fns'
import type { StrengthResponseDto } from 'dto'
import { aValidStrengthResponseDto } from '../../../testsupport/strengthResponseDtoTestDataBuilder'
import formatDateFilter from '../../../filters/formatDateFilter'
import { formatStrengthTypeScreenValueFilter } from '../../../filters/formatStrengthTypeFilter'
import StrengthType from '../../../enums/strengthType'
import StrengthCategory from '../../../enums/strengthCategory'
import StrengthIdentificationSource from '../../../enums/strengthIdentificationSource'
import formatStrengthIdentificationSourceScreenValueFilter from '../../../filters/formatStrengthIdentificationSourceFilter'

const njkEnv = nunjucks.configure([
  'node_modules/govuk-frontend/dist/',
  'node_modules/@ministryofjustice/frontend/',
  'server/views/',
  __dirname,
])

njkEnv //
  .addFilter('formatDate', formatDateFilter)
  .addFilter('formatStrengthTypeScreenValue', formatStrengthTypeScreenValueFilter)
  .addFilter('formatStrengthIdentificationSourceScreenValue', formatStrengthIdentificationSourceScreenValueFilter)
  .addGlobal('featureToggles', { editAndArchiveEnabled: true })

const prisonNamesById = {
  BXI: 'Brixton (HMP)',
  LEI: 'Leeds (HMP)',
}
const userHasPermissionTo = jest.fn()
const templateParams = {
  title: 'Literacy skills',
  strengthsData: {
    nonAlnStrengths: [aValidStrengthResponseDto()],
    latestAlnScreener: {
      createdAtPrison: 'BXI',
      screenerDate: startOfToday(),
      strengths: [aValidStrengthResponseDto()],
    },
  },
  prisonNamesById,
  userHasPermissionTo,
  showActions: true,
}

const template = 'strengthsSummaryCard.test.njk'

describe('Tests for Strengths Summary Card component', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the component given non-ALN and ALN strengths', () => {
    // Given
    const params = {
      ...templateParams,
      strengthsData: {
        nonAlnStrengths: [
          aValidStrengthResponseDto({
            strengthTypeCode: StrengthType.WRITING,
            strengthCategory: StrengthCategory.LITERACY_SKILLS,
            symptoms: 'Hand-written text is well written and easy to read',
            howIdentified: [StrengthIdentificationSource.COLLEAGUE_INFO, StrengthIdentificationSource.OTHER],
            howIdentifiedOther: `I have seen and experienced John's written text before`,
            fromALNScreener: false,
            updatedByDisplayName: 'Person 1',
            updatedAtPrison: 'LEI',
            updatedAt: parseISO('2025-02-10T09:01:00'),
          }),
          aValidStrengthResponseDto({
            strengthTypeCode: StrengthType.READING,
            strengthCategory: StrengthCategory.LITERACY_SKILLS,
            symptoms: 'Can read at speed',
            howIdentified: [StrengthIdentificationSource.EDUCATION_SKILLS_WORK],
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
          strengths: [
            aValidStrengthResponseDto({
              strengthTypeCode: StrengthType.LANGUAGE_COMM_SKILLS_DEFAULT,
              strengthCategory: StrengthCategory.LANGUAGE_COMM_SKILLS,
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

    // assert non-ALN strengths
    const nonAlnStrengths = $('.govuk-summary-list__row.non-aln-strength')
    expect(nonAlnStrengths.length).toEqual(2)

    const firstStrength = nonAlnStrengths.eq(0)
    expect(firstStrength.find('p').eq(0).text().trim()).toEqual('Hand-written text is well written and easy to read')
    expect(firstStrength.find('[data-qa=non-aln-strength-how-identified] li').length).toEqual(2)
    expect(firstStrength.find('[data-qa=non-aln-strength-how-identified] li').eq(0).text().trim()).toEqual(
      'Based on information shared by colleagues or other professionals',
    ) // COLLEAGUE_INFO
    expect(firstStrength.find('[data-qa=non-aln-strength-how-identified] li').eq(1).text().trim()).toEqual(
      `I have seen and experienced John's written text before`,
    ) // 'other' text
    expect(firstStrength.find('[data-qa=non-aln-strength-audit]').text().trim()).toEqual(
      'Last updated 10 Feb 2025 by Person 1, Leeds (HMP)',
    )

    const secondStrength = nonAlnStrengths.eq(1)
    expect(secondStrength.find('p').eq(0).text().trim()).toEqual('Can read at speed')
    expect(secondStrength.find('[data-qa=non-aln-strength-how-identified] li').length).toEqual(1)
    expect(secondStrength.find('[data-qa=non-aln-strength-how-identified] li').eq(0).text().trim()).toEqual(
      'Direct observation in education, skills and work',
    ) // EDUCATION_SKILLS_WORK
    expect(secondStrength.find('[data-qa=non-aln-strength-audit]').text().trim()).toEqual(
      'Last updated 10 Feb 2025 by Person 1, Leeds (HMP)',
    )

    // assert ALN strengths
    const alnStrengths = $('.govuk-summary-list__row.aln-strengths li')
    expect(alnStrengths.length).toEqual(1)
    expect(alnStrengths.eq(0).text().trim()).toEqual('Language and communication skills') // LANGUAGE_COMM_SKILLS_DEFAULT
    expect($('[data-qa=aln-strengths-audit]').text().trim()).toEqual(
      'From Additional Learning Needs Screener completed on 13 Jun 2025, Brixton (HMP)',
    )
  })

  it('should render the component given only non-ALN strengths and no ALN Screener at all', () => {
    // Given
    const params = {
      ...templateParams,
      strengthsData: {
        nonAlnStrengths: [
          aValidStrengthResponseDto({
            strengthTypeCode: StrengthType.WRITING,
            strengthCategory: StrengthCategory.LITERACY_SKILLS,
            symptoms: 'Hand-written text is well written and easy to read',
            howIdentified: [StrengthIdentificationSource.COLLEAGUE_INFO, StrengthIdentificationSource.OTHER],
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

    // assert non-ALN strengths
    const nonAlnStrengths = $('.govuk-summary-list__row.non-aln-strength')
    expect(nonAlnStrengths.length).toEqual(1)

    const firstStrength = nonAlnStrengths.eq(0)
    expect(firstStrength.find('p').eq(0).text().trim()).toEqual('Hand-written text is well written and easy to read')
    expect(firstStrength.find('[data-qa=non-aln-strength-how-identified] li').length).toEqual(2)
    expect(firstStrength.find('[data-qa=non-aln-strength-how-identified] li').eq(0).text().trim()).toEqual(
      'Based on information shared by colleagues or other professionals',
    ) // COLLEAGUE_INFO
    expect(firstStrength.find('[data-qa=non-aln-strength-how-identified] li').eq(1).text().trim()).toEqual(
      `I have seen and experienced John's written text before`,
    ) // 'other' text
    expect(firstStrength.find('[data-qa=non-aln-strength-audit]').text().trim()).toEqual(
      'Last updated 10 Feb 2025 by Person 1, Leeds (HMP)',
    )

    // assert ALN strengths
    const alnStrengths = $('.govuk-summary-list__row.aln-strengths li')
    expect(alnStrengths.length).toEqual(0)
  })

  it('should render the component given only ALN strengths', () => {
    // Given
    const params = {
      ...templateParams,
      strengthsData: {
        nonAlnStrengths: [] as Array<StrengthResponseDto>,
        latestAlnScreener: {
          createdAtPrison: 'BXI',
          screenerDate: parseISO('2025-06-13'),
          strengths: [
            aValidStrengthResponseDto({
              strengthTypeCode: StrengthType.LANGUAGE_COMM_SKILLS_DEFAULT,
              strengthCategory: StrengthCategory.LANGUAGE_COMM_SKILLS,
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

    // assert non-ALN strengths
    const nonAlnStrengths = $('.govuk-summary-list__row.non-aln-strength')
    expect(nonAlnStrengths.length).toEqual(0)

    // assert ALN strengths
    const alnStrengths = $('.govuk-summary-list__row.aln-strengths li')
    expect(alnStrengths.length).toEqual(1)
    expect(alnStrengths.eq(0).text().trim()).toEqual('Language and communication skills') // LANGUAGE_COMM_SKILLS_DEFAULT
    expect($('[data-qa=aln-strengths-audit]').text().trim()).toEqual(
      'From Additional Learning Needs Screener completed on 13 Jun 2025, Brixton (HMP)',
    )
  })

  it('should render the component given prisonNamesById does not contain the prison', () => {
    // Given
    const params = {
      ...templateParams,
      strengthsData: {
        nonAlnStrengths: [] as Array<StrengthResponseDto>,
        latestAlnScreener: {
          createdAtPrison: 'BXI',
          screenerDate: parseISO('2025-06-13'),
          strengths: [
            aValidStrengthResponseDto({
              strengthTypeCode: StrengthType.LANGUAGE_COMM_SKILLS_DEFAULT,
              strengthCategory: StrengthCategory.LANGUAGE_COMM_SKILLS,
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

    // assert non-ALN strengths
    const nonAlnStrengths = $('.govuk-summary-list__row.non-aln-strength')
    expect(nonAlnStrengths.length).toEqual(0)

    // assert ALN strengths
    const alnStrengths = $('.govuk-summary-list__row.aln-strengths li')
    expect(alnStrengths.length).toEqual(1)
    expect(alnStrengths.eq(0).text().trim()).toEqual('Language and communication skills') // LANGUAGE_COMM_SKILLS_DEFAULT
    expect($('[data-qa=aln-strengths-audit]').text().trim()).toEqual(
      'From Additional Learning Needs Screener completed on 13 Jun 2025, BXI',
    )
  })

  it('should not render the component given no strengths', () => {
    // Given
    const params = {
      ...templateParams,
      strengthsData: {
        nonAlnStrengths: [] as Array<StrengthResponseDto>,
        latestAlnScreener: {
          createdAtPrison: 'BXI',
          screenerDate: startOfToday(),
          strengths: [] as Array<StrengthResponseDto>,
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
      strengthsData: {
        ...templateParams.strengthsData,
        nonAlnStrengths: [aValidStrengthResponseDto()],
      },
      showActions: false,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const nonAlnStrengths = $('.govuk-summary-list__row.non-aln-strength')
    expect(nonAlnStrengths.length).toEqual(1)
    expect(nonAlnStrengths.eq(0).find('.govuk-summary-card__actions').length).toEqual(0)
    expect(userHasPermissionTo).not.toHaveBeenCalled()
  })

  it('should not render any actions given the showActions flag is true but the user does not have any permissions', () => {
    userHasPermissionTo.mockReturnValue(false)

    const params = {
      ...templateParams,
      strengthsData: {
        ...templateParams.strengthsData,
        nonAlnStrengths: [aValidStrengthResponseDto()],
      },
      showActions: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const nonAlnStrengths = $('.govuk-summary-list__row.non-aln-strength')
    expect(nonAlnStrengths.length).toEqual(1)
    expect(nonAlnStrengths.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(nonAlnStrengths.eq(0).find('[data-qa=edit-strength-button]').length).toEqual(0)
    expect(nonAlnStrengths.eq(0).find('[data-qa=archive-strength-button]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_STRENGTHS')
  })

  it('should render edit strength action given the showActions flag is true and the user only has permission to edit strengths', () => {
    userHasPermissionTo.mockReturnValueOnce(true)
    userHasPermissionTo.mockReturnValueOnce(false)

    const params = {
      ...templateParams,
      strengthsData: {
        ...templateParams.strengthsData,
        nonAlnStrengths: [aValidStrengthResponseDto()],
      },
      showActions: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const nonAlnStrengths = $('.govuk-summary-list__row.non-aln-strength')
    expect(nonAlnStrengths.length).toEqual(1)
    expect(nonAlnStrengths.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(nonAlnStrengths.eq(0).find('[data-qa=edit-strength-button]').length).toEqual(1)
    expect(nonAlnStrengths.eq(0).find('[data-qa=archive-strength-button]').length).toEqual(0)
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_STRENGTHS')
  })

  it('should render archive strength action given the showActions flag is true and the user only has permission to archive strengths', () => {
    userHasPermissionTo.mockReturnValueOnce(false)
    userHasPermissionTo.mockReturnValueOnce(true)

    const params = {
      ...templateParams,
      strengthsData: {
        ...templateParams.strengthsData,
        nonAlnStrengths: [aValidStrengthResponseDto()],
      },
      showActions: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const nonAlnStrengths = $('.govuk-summary-list__row.non-aln-strength')
    expect(nonAlnStrengths.length).toEqual(1)
    expect(nonAlnStrengths.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(nonAlnStrengths.eq(0).find('[data-qa=edit-strength-button]').length).toEqual(0)
    expect(nonAlnStrengths.eq(0).find('[data-qa=archive-strength-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_STRENGTHS')
  })

  it('should render both strength actions given the showActions flag is true and the user has permissions to edit and archive strengths', () => {
    userHasPermissionTo.mockReturnValue(true)

    const params = {
      ...templateParams,
      strengthsData: {
        ...templateParams.strengthsData,
        nonAlnStrengths: [aValidStrengthResponseDto()],
      },
      showActions: true,
    }

    // When
    const content = njkEnv.render(template, params)
    const $ = cheerio.load(content)

    // Then
    const nonAlnStrengths = $('.govuk-summary-list__row.non-aln-strength')
    expect(nonAlnStrengths.length).toEqual(1)
    expect(nonAlnStrengths.eq(0).find('.govuk-summary-card__actions').length).toEqual(1)
    expect(nonAlnStrengths.eq(0).find('[data-qa=edit-strength-button]').length).toEqual(1)
    expect(nonAlnStrengths.eq(0).find('[data-qa=archive-strength-button]').length).toEqual(1)
    expect(userHasPermissionTo).toHaveBeenCalledWith('EDIT_STRENGTHS')
    expect(userHasPermissionTo).toHaveBeenCalledWith('ARCHIVE_STRENGTHS')
  })
})
