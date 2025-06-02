import JourneyDataStore from './journeyDataStore'

export default class InMemoryJourneyDataStore implements JourneyDataStore {
  private data: Map<string, Express.JourneyData> = new Map()

  setJourneyData(
    username: string,
    journeyId: string,
    journeyData: Express.JourneyData,
    _durationHours: number,
  ): Promise<void> {
    this.data.set(`journey.${username}.${journeyId}`, journeyData)
    return Promise.resolve()
  }

  getJourneyData(username: string, journeyId: string): Promise<Express.JourneyData> {
    return Promise.resolve(this.data.get(`journey.${username}.${journeyId}`))
  }

  deleteJourneyData(username: string, journeyId: string): Promise<void> {
    this.data.delete(`journey.${username}.${journeyId}`)
    return Promise.resolve()
  }
}
