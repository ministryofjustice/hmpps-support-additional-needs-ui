import type { ReferencedAndAuditable } from 'dto'

/**
 * Mapper that takes any DTO that extends ReferencedAndAuditable, and a map of prison IDs to prison names; and maps the
 * prison name into the createdAtPrison and updatedAtPrison properties.
 */
const mapPrisonNamesToReferencedAndAuditable = <T extends ReferencedAndAuditable>(
  dto: T,
  prisonNamesById: Map<string, string>,
): T => ({
  ...dto,
  createdAtPrison: prisonNamesById.get(dto.createdAtPrison) || dto.createdAtPrison,
  updatedAtPrison: prisonNamesById.get(dto.updatedAtPrison) || dto.updatedAtPrison,
})

export default mapPrisonNamesToReferencedAndAuditable
