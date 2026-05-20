import { Request, Response } from 'express'
import { subDays, startOfToday } from 'date-fns'
import type { ScreenerDeletionDto } from 'dto'
import AdditionalLearningNeedsScreenerService from '../../../../services/additionalLearningNeedsScreenerService'
import loadLatestScreenerIntoJourneyData from './loadLatestScreenerIntoJourneyData'
import {
  aValidAlnScreenerList,
  aValidAlnScreenerResponseDto,
} from '../../../../testsupport/alnScreenerDtoTestDataBuilder'

jest.mock('../../../../services/additionalLearningNeedsScreenerService')

describe('loadLatestScreenerIntoJourneyData', () => {
  const alnScreenerService = new AdditionalLearningNeedsScreenerService(
    null,
  ) as jest.Mocked<AdditionalLearningNeedsScreenerService>
  const requestHandler = loadLatestScreenerIntoJourneyData(alnScreenerService)

  const username = 'a-dps-user'
  const prisonNumber = 'A1234GC'
  const otherPrisonNumber = 'Z1234ZZ'

  const flash = jest.fn()
  const req = {
    user: { username },
    params: { prisonNumber },
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.journeyData = {}
  })

  it('loads the latest screener into journeyData when none is present', async () => {
    const yesterday = subDays(startOfToday(), 1)
    const lastWeek = subDays(startOfToday(), 7)
    const newest = aValidAlnScreenerResponseDto({ screenerDate: yesterday })
    const older = aValidAlnScreenerResponseDto({ screenerDate: lastWeek })
    alnScreenerService.getAlnScreeners.mockResolvedValue(
      aValidAlnScreenerList({ prisonNumber, screeners: [older, newest] }),
    )

    await requestHandler(req, res, next)

    const dto = req.journeyData.screenerDeletionDto as ScreenerDeletionDto
    expect(dto).not.toBeUndefined()
    expect(dto.prisonNumber).toEqual(prisonNumber)
    expect(dto.latestScreener).toEqual(newest)
    expect(alnScreenerService.getAlnScreeners).toHaveBeenCalledWith(username, prisonNumber)
    expect(next).toHaveBeenCalledWith()
  })

  it('reuses the stashed screener when prison number matches and a screener is present', async () => {
    const stashed = aValidAlnScreenerResponseDto()
    req.journeyData.screenerDeletionDto = { prisonNumber, latestScreener: stashed } as ScreenerDeletionDto

    await requestHandler(req, res, next)

    expect(alnScreenerService.getAlnScreeners).not.toHaveBeenCalled()
    expect((req.journeyData.screenerDeletionDto as ScreenerDeletionDto).latestScreener).toBe(stashed)
    expect(next).toHaveBeenCalledWith()
  })

  it('refetches when the stashed DTO is for a different prisoner', async () => {
    const stashed = aValidAlnScreenerResponseDto()
    req.journeyData.screenerDeletionDto = {
      prisonNumber: otherPrisonNumber,
      latestScreener: stashed,
    } as ScreenerDeletionDto
    const refetched = aValidAlnScreenerResponseDto()
    alnScreenerService.getAlnScreeners.mockResolvedValue(
      aValidAlnScreenerList({ prisonNumber, screeners: [refetched] }),
    )

    await requestHandler(req, res, next)

    expect(alnScreenerService.getAlnScreeners).toHaveBeenCalledWith(username, prisonNumber)
    expect((req.journeyData.screenerDeletionDto as ScreenerDeletionDto).latestScreener).toEqual(refetched)
    expect(next).toHaveBeenCalledWith()
  })

  it('calls next with a 404 when the prisoner has no screener', async () => {
    alnScreenerService.getAlnScreeners.mockResolvedValue(aValidAlnScreenerList({ prisonNumber, screeners: [] }))

    await requestHandler(req, res, next)

    expect(next).toHaveBeenCalledTimes(1)
    const err = next.mock.calls[0][0] as { status?: number; message?: string }
    expect(err.status).toEqual(404)
    expect(err.message).toContain(prisonNumber)
    expect(req.journeyData.screenerDeletionDto).toBeUndefined()
  })

  it('redirects to overview with an api-error flash when the API call rejects', async () => {
    alnScreenerService.getAlnScreeners.mockRejectedValue(new Error('boom'))

    await requestHandler(req, res, next)

    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(res.redirect).toHaveBeenCalledWith(`/profile/${prisonNumber}/overview`)
    expect(next).not.toHaveBeenCalled()
  })
})
