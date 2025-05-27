import type { Prisoner } from 'prisonerSearchApiClient'

export interface PrisonerSearchStore {
  setPrisoner(prisoner: Prisoner, durationHours: number): Promise<string>

  getPrisoner(prisonNumber: string): Promise<Prisoner>
}
