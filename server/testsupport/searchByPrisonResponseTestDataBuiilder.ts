import type { Person, SearchByPrisonResponse } from 'supportAdditionalNeedsApiClient'
import aValidPerson from './personTestDataBuilder'

const aValidSearchByPrisonResponse = (
  options: {
    totalElements?: number
    totalPages?: number
    page?: number
    last?: boolean
    first?: boolean
    pageSize?: number
    people?: Array<Person>
  } = {
    totalElements: 1,
    totalPages: 1,
    page: 1,
    last: true,
    first: true,
    pageSize: 50,
    people: [aValidPerson()],
  },
): SearchByPrisonResponse => ({
  pagination: {
    totalElements: options.totalElements,
    totalPages: options.totalPages,
    page: options.page,
    last: options.last,
    first: options.first,
    pageSize: options.pageSize,
  },
  people: options.people,
})

export default aValidSearchByPrisonResponse
