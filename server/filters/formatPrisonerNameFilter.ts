import type { PrisonerSummary } from 'viewModels'

export enum NameFormat {
  FIRST_NAME_ONLY = 'FIRST_NAME_ONLY',
  LAST_NAME_ONLY = 'LAST_NAME_ONLY',
  FIRST_NAME_LAST_NAME = 'FIRST_NAME_LAST_NAME',
  LAST_NAME_FIRST_NAME = 'LAST_NAME_FIRST_NAME',
  FIRST_NAME_COMMA_LAST_NAME = 'FIRST_NAME_COMMA_LAST_NAME',
  LAST_NAME_COMMA_FIRST_NAME = 'LAST_NAME_COMMA_FIRST_NAME',
  First_name_only = 'First_name_only',
  Last_name_only = 'Last_name_only',
  First_name_Last_name = 'First_name_Last_name',
  Last_name_First_name = 'Last_name_First_name',
  First_name_comma_Last_name = 'First_name_comma_Last_name',
  Last_name_comma_First_name = 'Last_name_comma_First_name',
}

const formatPrisonerNameFilter = (format: NameFormat): ((prisonerSummary: PrisonerSummary) => string) => {
  return (prisoner: PrisonerSummary): string => {
    let name: string
    switch (format) {
      case NameFormat.FIRST_NAME_ONLY:
        name = prisoner.firstName.toUpperCase()
        break
      case NameFormat.LAST_NAME_ONLY:
        name = prisoner.lastName.toUpperCase()
        break
      case NameFormat.FIRST_NAME_LAST_NAME:
        name = `${prisoner.firstName} ${prisoner.lastName}`.toUpperCase()
        break
      case NameFormat.LAST_NAME_FIRST_NAME:
        name = `${prisoner.lastName} ${prisoner.firstName}`.toUpperCase()
        break
      case NameFormat.FIRST_NAME_COMMA_LAST_NAME:
        name = `${prisoner.firstName}, ${prisoner.lastName}`.toUpperCase()
        break
      case NameFormat.LAST_NAME_COMMA_FIRST_NAME:
        name = `${prisoner.lastName}, ${prisoner.firstName}`.toUpperCase()
        break
      case NameFormat.First_name_only:
        name = `${String(prisoner.firstName[0]).toUpperCase()}${String(prisoner.firstName).slice(1).toLowerCase()}`
        break
      case NameFormat.Last_name_only:
        name = `${String(prisoner.lastName[0]).toUpperCase()}${String(prisoner.lastName).slice(1).toLowerCase()}`
        break
      case NameFormat.First_name_Last_name:
        name = `${String(prisoner.firstName[0]).toUpperCase()}${String(prisoner.firstName).slice(1).toLowerCase()} ${String(prisoner.lastName[0]).toUpperCase()}${String(prisoner.lastName).slice(1).toLowerCase()}`
        break
      case NameFormat.Last_name_First_name:
        name = `${String(prisoner.lastName[0]).toUpperCase()}${String(prisoner.lastName).slice(1).toLowerCase()} ${String(prisoner.firstName[0]).toUpperCase()}${String(prisoner.firstName).slice(1).toLowerCase()}`
        break
      case NameFormat.First_name_comma_Last_name:
        name = `${String(prisoner.firstName[0]).toUpperCase()}${String(prisoner.firstName).slice(1).toLowerCase()}, ${String(prisoner.lastName[0]).toUpperCase()}${String(prisoner.lastName).slice(1).toLowerCase()}`
        break
      case NameFormat.Last_name_comma_First_name:
        name = `${String(prisoner.lastName[0]).toUpperCase()}${String(prisoner.lastName).slice(1).toLowerCase()}, ${String(prisoner.firstName[0]).toUpperCase()}${String(prisoner.firstName).slice(1).toLowerCase()}`
        break
      default:
    }
    return name
  }
}

export default formatPrisonerNameFilter
