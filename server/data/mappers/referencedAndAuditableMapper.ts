import { parseISO } from 'date-fns'
import type { ReferencedAndAuditable } from 'dto'

const toReferenceAndAuditable = (
  apiResponse: {
    reference: string
    createdBy: string
    createdByDisplayName: string
    createdAt: string
    createdAtPrison: string
    updatedBy: string
    updatedByDisplayName: string
    updatedAt: string
    updatedAtPrison: string
  },
  prisonNamesById: Map<string, string>,
): ReferencedAndAuditable => ({
  reference: apiResponse.reference,
  createdBy: apiResponse.createdBy,
  createdByDisplayName: apiResponse.createdByDisplayName,
  createdAt: apiResponse.createdAt ? parseISO(apiResponse.createdAt) : null,
  createdAtPrison: prisonNamesById.get(apiResponse.createdAtPrison) || apiResponse.createdAtPrison,
  updatedBy: apiResponse.updatedBy,
  updatedByDisplayName: apiResponse.updatedByDisplayName,
  updatedAt: apiResponse.updatedAt ? parseISO(apiResponse.updatedAt) : null,
  updatedAtPrison: prisonNamesById.get(apiResponse.updatedAtPrison) || apiResponse.updatedAtPrison,
})

export default toReferenceAndAuditable
