import type { Prisoner } from 'prisonerSearchApiClient'
import { PrisonerSearchStore } from './prisonerSearchStore'

export default class InMemoryPrisonerSearchStore implements PrisonerSearchStore {
  private data: Map<string, Prisoner> = new Map()

  setPrisoner(prisoner: Prisoner, _durationHours: number): Promise<void> {
    this.data.set(`prisoner.${prisoner.prisonerNumber}`, prisoner)
    return Promise.resolve()
  }

  getPrisoner(prisonNumber: string): Promise<Prisoner> {
    return Promise.resolve(this.data.get(`prisoner.${prisonNumber}`))
  }
}
