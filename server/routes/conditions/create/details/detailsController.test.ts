import { Request, Response } from 'express'
import DetailsController from './detailsController'
import { aValidConditionDto, aValidConditionsList } from '../../../../testsupport/conditionDtoTestDataBuilder'
import ConditionType from '../../../../enums/conditionType'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'
import ConditionService from '../../../../services/conditionService'
import ConditionSource from '../../../../enums/conditionSource'

jest.mock('../../../../services/conditionService')

describe('detailsController', () => {
  const conditionService = new ConditionService(null) as jest.Mocked<ConditionService>
  const controller = new DetailsController(conditionService)

  const username = 'FRED_123'
  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })

  const conditionsList = aValidConditionsList({
    prisonNumber,
    conditions: [aValidConditionDto({ conditionTypeCode: ConditionType.ADHD, conditionDetails: null })],
  })

  const flash = jest.fn()

  const req = {
    user: { username },
    session: {},
    journeyData: {},
    body: {},
    flash,
  } as unknown as Request
  const res = {
    redirect: jest.fn(),
    redirectWithErrors: jest.fn(),
    redirectWithSuccess: jest.fn(),
    render: jest.fn(),
    locals: { prisonerSummary },
  } as unknown as Response
  const next = jest.fn()

  beforeEach(() => {
    jest.resetAllMocks()
    req.body = {}
    req.journeyData = { conditionsList }
  })

  it('should render view given no previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/conditions/details/index'
    const expectedViewModel = {
      form: {
        conditionDetails: { ADHD: '' },
      },
      prisonerSummary,
      dto: conditionsList,
      errorRecordingConditions: false,
    }

    // When
    await controller.getDetailsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    flash.mockReturnValue([])
    const invalidForm = {
      conditionDetails: ['not-a-valid-value'],
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/conditions/details/index'
    const expectedViewModel = {
      form: invalidForm,
      prisonerSummary,
      dto: conditionsList,
      errorRecordingConditions: false,
    }

    // When
    await controller.getDetailsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should render view given api errors from previous submission', async () => {
    // Given
    flash.mockReturnValue(['true'])
    res.locals.invalidForm = undefined

    const conditions = aValidConditionsList({
      prisonNumber,
      conditions: [
        aValidConditionDto({
          conditionTypeCode: ConditionType.ADHD,
          conditionDetails: 'Can become distracted and easily agitated',
        }),
        aValidConditionDto({
          conditionTypeCode: ConditionType.VISUAL_IMPAIR,
          conditionName: 'Colour blindness',
          conditionDetails: 'Has red-green colour blindness',
        }),
      ],
    })
    req.journeyData = { conditionsList: conditions }

    const expectedViewTemplate = 'pages/conditions/details/index'
    const expectedViewModel = {
      form: {
        conditionDetails: {
          ADHD: 'Can become distracted and easily agitated',
          VISUAL_IMPAIR: 'Has red-green colour blindness',
        },
      },
      prisonerSummary,
      dto: conditions,
      errorRecordingConditions: true,
    }

    // When
    await controller.getDetailsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors')
  })

  it('should submit form and redirect to next route given conditionDiagnosis is not in form submission and calling API is successful', async () => {
    // Given
    const conditions = aValidConditionsList({
      prisonNumber,
      conditions: [
        aValidConditionDto({
          conditionTypeCode: ConditionType.ADHD,
          conditionDetails: '',
        }),
        aValidConditionDto({
          conditionTypeCode: ConditionType.VISUAL_IMPAIR,
          conditionName: 'Colour blindness',
          conditionDetails: '',
        }),
      ],
    })
    req.journeyData = { conditionsList: conditions }
    req.body = {
      conditionDetails: {
        ADHD: 'Can become distracted and easily agitated',
        VISUAL_IMPAIR: 'Has red-green colour blindness',
      },
    }

    conditionService.createConditions.mockResolvedValue(null)

    const expectedConditionsList = aValidConditionsList({
      prisonNumber,
      conditions: [
        aValidConditionDto({
          conditionTypeCode: ConditionType.ADHD,
          conditionDetails: 'Can become distracted and easily agitated',
          source: ConditionSource.SELF_DECLARED,
        }),
        aValidConditionDto({
          conditionTypeCode: ConditionType.VISUAL_IMPAIR,
          conditionName: 'Colour blindness',
          conditionDetails: 'Has red-green colour blindness',
          source: ConditionSource.SELF_DECLARED,
        }),
      ],
    })
    const expectedNextRoute = `/profile/${prisonNumber}/conditions`

    // When
    await controller.submitDetailsForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Condition(s) updated')
    expect(req.journeyData.conditionsList).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(conditionService.createConditions).toHaveBeenCalledWith(username, expectedConditionsList)
  })

  it('should submit form and redirect to next route given conditionDiagnosis is in form submission and calling API is successful', async () => {
    // Given
    const conditions = aValidConditionsList({
      prisonNumber,
      conditions: [
        aValidConditionDto({
          conditionTypeCode: ConditionType.ADHD,
          conditionDetails: '',
        }),
        aValidConditionDto({
          conditionTypeCode: ConditionType.VISUAL_IMPAIR,
          conditionName: 'Colour blindness',
          conditionDetails: '',
        }),
      ],
    })
    req.journeyData = { conditionsList: conditions }
    req.body = {
      conditionDetails: {
        ADHD: 'Can become distracted and easily agitated',
        VISUAL_IMPAIR: 'Has red-green colour blindness',
      },
      conditionDiagnosis: {
        ADHD: 'CONFIRMED_DIAGNOSIS',
        VISUAL_IMPAIR: 'SELF_DECLARED',
      },
    }

    conditionService.createConditions.mockResolvedValue(null)

    const expectedConditionsList = aValidConditionsList({
      prisonNumber,
      conditions: [
        aValidConditionDto({
          conditionTypeCode: ConditionType.ADHD,
          conditionDetails: 'Can become distracted and easily agitated',
          source: ConditionSource.CONFIRMED_DIAGNOSIS,
        }),
        aValidConditionDto({
          conditionTypeCode: ConditionType.VISUAL_IMPAIR,
          conditionName: 'Colour blindness',
          conditionDetails: 'Has red-green colour blindness',
          source: ConditionSource.SELF_DECLARED,
        }),
      ],
    })
    const expectedNextRoute = `/profile/${prisonNumber}/conditions`

    // When
    await controller.submitDetailsForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Condition(s) updated')
    expect(req.journeyData.conditionsList).toBeUndefined()
    expect(flash).not.toHaveBeenCalled()
    expect(conditionService.createConditions).toHaveBeenCalledWith(username, expectedConditionsList)
  })

  it('should submit form and redirect to next route given calling API is not successful', async () => {
    // Given
    const conditions = aValidConditionsList({
      prisonNumber,
      conditions: [
        aValidConditionDto({
          conditionTypeCode: ConditionType.ADHD,
          conditionDetails: '',
        }),
        aValidConditionDto({
          conditionTypeCode: ConditionType.VISUAL_IMPAIR,
          conditionName: 'Colour blindness',
          conditionDetails: '',
        }),
      ],
    })
    req.journeyData = { conditionsList: conditions }
    req.body = {
      conditionDetails: {
        ADHD: 'Can become distracted and easily agitated',
        VISUAL_IMPAIR: 'Has red-green colour blindness',
      },
    }

    conditionService.createConditions.mockRejectedValue(new Error('Internal Server Error'))

    const expectedConditionsList = aValidConditionsList({
      prisonNumber,
      conditions: [
        aValidConditionDto({
          conditionTypeCode: ConditionType.ADHD,
          conditionDetails: 'Can become distracted and easily agitated',
        }),
        aValidConditionDto({
          conditionTypeCode: ConditionType.VISUAL_IMPAIR,
          conditionName: 'Colour blindness',
          conditionDetails: 'Has red-green colour blindness',
        }),
      ],
    })
    const expectedNextRoute = 'details'

    // When
    await controller.submitDetailsForm(req, res, next)

    // Then
    expect(res.redirect).toHaveBeenCalledWith(expectedNextRoute)
    expect(req.journeyData.conditionsList).toEqual(conditions)
    expect(flash).toHaveBeenCalledWith('pageHasApiErrors', 'true')
    expect(conditionService.createConditions).toHaveBeenCalledWith(username, expectedConditionsList)
  })
})
