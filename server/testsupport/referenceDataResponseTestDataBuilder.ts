import type { ReferenceData, ReferenceDataListResponse } from 'supportAdditionalNeedsApiClient'

const aValidReferenceDataListResponse = (options?: {
  referenceDataList?: Array<ReferenceData>
}): ReferenceDataListResponse => ({
  referenceDataList: options?.referenceDataList || [aValidConditionReferenceData(), aValidChallengeReferenceData()],
})

const aValidConditionReferenceData = (options?: {
  code?: string
  description?: string
  categoryCode?: string
  categoryDescription?: string
  listSequence?: number
  active?: boolean
}): ReferenceData => ({
  code: options?.code || 'DYSLEXIA',
  description: options?.description || 'Dyslexia',
  categoryCode: options?.categoryCode || 'LEARNING_DIFFICULTY',
  categoryDescription: options?.categoryDescription || 'Learning difficulty',
  listSequence: options?.listSequence || 1,
  active: options?.active == null ? true : options?.active,
})

const aValidChallengeReferenceData = (options?: {
  code?: string
  description?: string
  categoryCode?: string
  categoryDescription?: string
  areaCode?: string
  areaDescription?: string
  listSequence?: number
  active?: boolean
}): ReferenceData => ({
  code: options?.code || 'ALPHABET_ORDERING',
  description: options?.description || 'Alphabet ordering',
  categoryCode: options?.categoryCode || 'LITERACY_SKILLS',
  categoryDescription: options?.categoryDescription || 'Literacy Skills',
  areaCode: options?.areaCode || 'COGNITION_LEARNING',
  areaDescription: options?.areaDescription || 'Cognition & learning',
  listSequence: options?.listSequence || 2,
  active: options?.active == null ? true : options?.active,
})

const aValidStrengthReferenceData = (options?: {
  code?: string
  description?: string
  categoryCode?: string
  categoryDescription?: string
  areaCode?: string
  areaDescription?: string
  listSequence?: number
  active?: boolean
}): ReferenceData => ({
  code: options?.code || 'HANDWRITING',
  description: options?.description || 'Handwriting',
  categoryCode: options?.categoryCode || 'PHYSICAL_SKILLS',
  categoryDescription: options?.categoryDescription || 'Physical Skills & coordination',
  areaCode: options?.areaCode || 'PHYSICAL_SENSORY',
  areaDescription: options?.areaDescription || 'Physical & Sensory',
  listSequence: options?.listSequence || 2,
  active: options?.active == null ? true : options?.active,
})

export {
  aValidConditionReferenceData,
  aValidChallengeReferenceData,
  aValidReferenceDataListResponse,
  aValidStrengthReferenceData,
}
