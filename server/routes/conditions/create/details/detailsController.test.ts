import { Request, Response } from 'express'
import DetailsController from './detailsController'
import { aValidConditionDto, aValidConditionsList } from '../../../../testsupport/conditionDtoTestDataBuilder'
import ConditionType from '../../../../enums/conditionType'
import aValidPrisonerSummary from '../../../../testsupport/prisonerSummaryTestDataBuilder'

describe('detailsController', () => {
  const controller = new DetailsController()

  const prisonNumber = 'A1234BC'
  const prisonerSummary = aValidPrisonerSummary({ prisonNumber })
  const conditionsList = aValidConditionsList({
    prisonNumber,
    conditions: [aValidConditionDto({ conditionTypeCode: ConditionType.ADHD, conditionDetails: null })],
  })

  const req = {
    session: {},
    journeyData: {},
    body: {},
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
    res.locals.invalidForm = undefined

    const expectedViewTemplate = 'pages/conditions/details/index'
    const expectedViewModel = {
      form: {
        conditionDetails: { ADHD: '' },
      },
      prisonerSummary,
      dto: conditionsList,
    }

    // When
    await controller.getDetailsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given previously submitted invalid form', async () => {
    // Given
    const invalidForm = {
      conditionDetails: ['not-a-valid-value'],
    }
    res.locals.invalidForm = invalidForm

    const expectedViewTemplate = 'pages/conditions/details/index'
    const expectedViewModel = {
      form: invalidForm,
      prisonerSummary,
      dto: conditionsList,
    }

    // When
    await controller.getDetailsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should render view given DTO has previously submitted values', async () => {
    // Given
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
    }

    // When
    await controller.getDetailsView(req, res, next)

    // Then
    expect(res.render).toHaveBeenCalledWith(expectedViewTemplate, expectedViewModel)
  })

  it('should submit form and redirect to next route', async () => {
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
    const expectedNextRoute = `/profile/${prisonNumber}/challenges`

    // When
    await controller.submitDetailsForm(req, res, next)

    // Then
    expect(res.redirectWithSuccess).toHaveBeenCalledWith(expectedNextRoute, 'Condition(s) updated')
    expect(req.journeyData.conditionsList).toEqual(expectedConditionsList)
  })
})
