import type { Prisoner } from 'prisonerSearchApiClient'

export interface PrisonerSearchStore {
  setPrisoner(prisoner: Prisoner, durationHours: number): Promise<void>

  getPrisoner(prisonNumber: string): Promise<Prisoner>
}
