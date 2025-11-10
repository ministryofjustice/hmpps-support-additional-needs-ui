import { Request, Response } from 'express'
import StrengthsController from './strengthsController'
import aValidPrisonerSummary from '../../../testsupport/prisonerSummaryTestDataBuilder'
import { Result } from '../../../utils/result/result'
import { aValidAlnScreenerList } from '../../../testsupport/alnScreenerDtoTestDataBuilder'
import aPlanLifecycleStatusDto from '../../../testsupport/planLifecycleStatusDtoTestDataBuilder'
import { aValidStrengthsList } from '../../../testsupport/strengthResponseDtoTestDataBuilder'

describe('strengthsController', () => {
  const controller = new StrengthsController()

  const prisonerSummary = aValidPrisonerSummary()

  const prisonNamesById = { BXI: 'Brixton (HMP)', MDI: 'Moorland (HMP & YOI)' }
  const educationSupportPlanLifecycleStatus = Result.fulfilled(aPlanLifecycleStatusDto())

  const strengths = Result.fulfilled(aValidStrengthsList())
  const alnScreeners = Result.fulfilled(aValidAlnScreenerList())

  const render = jest.fn()
  const req = {} as unknown as Request
  const res = {
    render,
    locals: { prisonerSummary, strengths, alnScreeners, prisonNamesById, educationSupportPlanLifecycleStatus },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should render the view', async () => {
    // Given
    const expectedViewTemplate = 'pages/profile/strengths/index'

    const expectedViewModel = {
      prisonerSummary,
      prisonNamesById,
      educationSupportPlanLifecycleStatus,
      tab: 'strengths',
      activeStrengths: expect.objectContaining({
        status: 'fulfilled',
      }),
      archivedStrengths: expect.objectContaining({
        status: 'fulfilled',
      }),
    }

    // When
    await controller.getStrengthsView(req, res, next)

    // Then
    expect(render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })
})
