import { Request, Response } from 'express'
import type { ScreenerDeletionDto } from 'dto'
import checkScreenerDeletionDtoExistsInJourneyData from './checkScreenerDeletionDtoExistsInJourneyData'
import { aValidAlnScreenerResponseDto } from '../../../../testsupport/alnScreenerDtoTestDataBuilder'

describe('checkScreenerDeletionDtoExistsInJourneyData', () => {
  const prisonNumber = 'A1234BC'

  const req = {
    journeyData: {},
    params: {},
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
    req.params = { prisonNumber }
  })

  it('invokes next handler given the ScreenerDeletionDto exists in journeyData', async () => {
    req.journeyData.screenerDeletionDto = {
      prisonNumber,
      latestScreener: aValidAlnScreenerResponseDto(),
    } as ScreenerDeletionDto

    await checkScreenerDeletionDtoExistsInJourneyData(req, res, next)

    expect(next).toHaveBeenCalled()
    expect(res.redirect).not.toHaveBeenCalled()
  })

  it('redirects to the Profile Overview page given no ScreenerDeletionDto exists in journeyData', async () => {
    req.journeyData.screenerDeletionDto = undefined

    await checkScreenerDeletionDtoExistsInJourneyData(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(next).not.toHaveBeenCalled()
  })

  it('redirects to the Profile Overview page given no journeyData exists', async () => {
    req.journeyData = undefined

    await checkScreenerDeletionDtoExistsInJourneyData(req, res, next)

    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
