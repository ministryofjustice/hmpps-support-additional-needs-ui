import { startOfToday, subDays } from 'date-fns'
import type { AlnScreenerResponseDto, StrengthResponseDto } from 'dto'
import { aValidStrengthResponseDto, aValidStrengthsList } from '../../testsupport/strengthResponseDtoTestDataBuilder'
import StrengthType from '../../enums/strengthType'
import StrengthCategory from '../../enums/strengthCategory'
import { Result } from '../../utils/result/result'
import { aValidAlnScreenerList, aValidAlnScreenerResponseDto } from '../../testsupport/alnScreenerDtoTestDataBuilder'

const today = startOfToday()

export function setupNonAlnStrengths() {
  const numeracy = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.NUMERACY_SKILLS_DEFAULT,
    strengthCategory: StrengthCategory.NUMERACY_SKILLS,
    symptoms: 'Can add up really well',
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 5),
  })
  const numeracy2 = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.NUMERACY_SKILLS_DEFAULT,
    strengthCategory: StrengthCategory.NUMERACY_SKILLS,
    symptoms: 'Can subtract really well',
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 3),
  })
  const literacy = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.LITERACY_SKILLS_DEFAULT,
    strengthCategory: StrengthCategory.LITERACY_SKILLS,
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 1),
  })
  const emotionsNonActive = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.EMOTIONS_FEELINGS_DEFAULT,
    strengthCategory: StrengthCategory.EMOTIONS_FEELINGS,
    fromALNScreener: false,
    active: false,
    updatedAt: subDays(today, 1),
  })
  const attention = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.ATTENTION_ORGANISING_TIME_DEFAULT,
    strengthCategory: StrengthCategory.ATTENTION_ORGANISING_TIME,
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 10),
  })
  const speaking = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.SPEAKING,
    strengthCategory: StrengthCategory.LANGUAGE_COMM_SKILLS,
    fromALNScreener: false,
    active: true,
    updatedAt: subDays(today, 2),
  })

  return { numeracy, numeracy2, literacy, emotionsNonActive, attention, speaking }
}

export function setupAlnStrengths() {
  const reading = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.READING,
    strengthCategory: StrengthCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const writing = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.WRITING,
    strengthCategory: StrengthCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const alphabetOrdering = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.ALPHABET_ORDERING,
    strengthCategory: StrengthCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const wordFindingNonActive = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.WORD_FINDING,
    strengthCategory: StrengthCategory.LITERACY_SKILLS,
    fromALNScreener: true,
    active: false,
  })
  const arithmetic = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.ARITHMETIC,
    strengthCategory: StrengthCategory.NUMERACY_SKILLS,
    fromALNScreener: true,
    active: true,
  })
  const focussing = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.FOCUSING,
    strengthCategory: StrengthCategory.ATTENTION_ORGANISING_TIME,
    fromALNScreener: true,
    active: true,
  })
  const tidiness = aValidStrengthResponseDto({
    strengthTypeCode: StrengthType.TIDINESS,
    strengthCategory: StrengthCategory.ATTENTION_ORGANISING_TIME,
    fromALNScreener: true,
    active: true,
  })

  return { reading, writing, alphabetOrdering, wordFindingNonActive, arithmetic, focussing, tidiness }
}

export function setupNonAlnStrengthsPromise(
  options: {
    strengths?: Array<StrengthResponseDto>
  } = { strengths: Object.values(setupNonAlnStrengths()) },
) {
  return Result.fulfilled(aValidStrengthsList({ strengths: options.strengths }))
}

export function setupAlnScreenersPromise(
  options: {
    latestScreener?: AlnScreenerResponseDto
  } = {
    latestScreener: aValidAlnScreenerResponseDto({
      screenerDate: startOfToday(),
      createdAtPrison: 'BXI',
      strengths: Object.values(setupAlnStrengths()),
    }),
  },
) {
  const latestScreenerDate = options.latestScreener.screenerDate
  return Result.fulfilled(
    aValidAlnScreenerList({
      screeners: [
        // Latest screener
        options.latestScreener,
        // Screener from yesterday
        aValidAlnScreenerResponseDto({ screenerDate: subDays(latestScreenerDate, 1) }),
        // Screener from the day before yesterday
        aValidAlnScreenerResponseDto({ screenerDate: subDays(latestScreenerDate, 2) }),
      ],
    }),
  )
}
