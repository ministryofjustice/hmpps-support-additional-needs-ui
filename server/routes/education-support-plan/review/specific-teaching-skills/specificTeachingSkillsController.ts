import { NextFunction, Request, RequestHandler, Response } from 'express'
import type { EducationSupportPlanDto } from 'dto'
import YesNoValue from '../../../../enums/yesNoValue'

export default class SpecificTeachingSkillsController {
  getSpecificTeachingSkillsView: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { prisonerSummary, invalidForm } = res.locals
    const { educationSupportPlanDto } = req.journeyData

    const currentAnswer = educationSupportPlanDto.specificTeachingSkillsNeeded
      ? educationSupportPlanDto.specificTeachingSkills
      : 'No'
    const specificTeachingSkillsForm = invalidForm ?? this.populateFormFromDto(educationSupportPlanDto)

    const viewRenderArgs = { prisonerSummary, form: specificTeachingSkillsForm, mode: 'review', currentAnswer }
    return res.render('pages/education-support-plan/specific-teaching-skills/index', viewRenderArgs)
  }

  submitSpecificTeachingSkillsForm: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const specificTeachingSkillsForm = { ...req.body }
    this.updateDtoFromForm(req, specificTeachingSkillsForm)

    return res.redirect(req.query?.submitToCheckAnswers !== 'true' ? 'exam-arrangements' : 'check-your-answers')
  }

  private populateFormFromDto = (dto: EducationSupportPlanDto) => {
    if (dto.specificTeachingSkillsNeeded == null) {
      return {}
    }
    return {
      skillsRequired: dto.specificTeachingSkillsNeeded ? YesNoValue.YES : YesNoValue.NO,
      details: dto.specificTeachingSkills,
    }
  }

  private updateDtoFromForm = (req: Request, form: { skillsRequired: YesNoValue; details?: string }) => {
    const { educationSupportPlanDto } = req.journeyData
    educationSupportPlanDto.specificTeachingSkillsNeeded = form.skillsRequired === YesNoValue.YES
    educationSupportPlanDto.specificTeachingSkills = form.details
    req.journeyData.educationSupportPlanDto = educationSupportPlanDto
  }
}
