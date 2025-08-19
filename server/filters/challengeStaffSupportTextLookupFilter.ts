import ChallengeType from '../enums/challengeType'

const challengeTypeStaffStrategyValues = new Map<ChallengeType, string>([
  [
    ChallengeType.LISTENING,
    `Good listening is a key skill for communication and understanding. Encourage individuals to take notes during meetings or to ask for written summaries. Where possible, provide instructions in small, clear steps. Be aware of any changes in hearing skills. Support referrals for hearing checks if needed.

  Possible Support Strategies:

  Discuss providing meeting notes or summaries to support understanding.

  Show how they can take brief notes during conversations or sessions.

  Provide instructions to be given in manageable steps.

  Arrange hearing if listening difficulties are reported.`,
  ],
  [
    ChallengeType.VISUAL_SKILLS,
    `Support individuals in using tools like a ruler or reading guide to help with tracking words on a page. Watch for signs of visual strain, like headaches or blurry vision, and recommend a visit to the optometrist. If available, help them access text-to-speech tools to support reading.

  Possible Support Strategies:

  Show how to use a ruler, piece of card under lines  during reading tasks.

  Report any eye strain or headaches to staff or medical team.

  Explore the use of text-to-speech software for reading materials.`,
  ],
  [
    ChallengeType.AUDITORY_DISCRIMINATION,
    `If background noise makes it difficult for someone to concentrate, help them find a quieter space if possible. Offer or suggest the use of noise-cancelling headphones or calming background music to aid focus.

  Possible Support Strategies:

  Identify quieter spaces for focused activities.

  Use noise-cancelling headphones when available.

  Try listening to calming music during independent tasks.`,
  ],
  [
    ChallengeType.CREATIVITY,
    `Creativity can support problem-solving and emotional wellbeing. Encourage individuals to work collaboratively when possible and engage in physical activity like walking, which can help generate new ideas.

Possible Support Strategies:

  Take part in at least one creative or group-based problem-solving activity each week.

  Engage in physical activity (e.g., walking or exercise) to support mental focus.

  Record new ideas or reflections in a journal.`,
  ],
  [
    ChallengeType.VISUAL_SPATIAL_SKILLS,
    `Visual-spatial skills help with movement, spatial awareness, and understanding directions. Encourage activities like drawing, building, or playing spatial games. Offer practical tools like maps or digital navigation aids where appropriate.

  Possible Support Strategies:

  Engage in weekly visual-spatial tasks (e.g., puzzles, drawing, or building).

Practise following maps or visual instructions for navigation tasks.

  Use navigation aids (like GPS) if available and relevant.`,
  ],
  [
    ChallengeType.SENSORY_PROCESSING,
    `Some individuals may feel discomfort due to certain sensory inputs. Support them in identifying triggers (e.g., noise, texture, smell) and using coping strategies like headphones, breathable fabrics, or avoiding specific environments.

  Possible Support Strategies:

  Identify and list known sensory triggers and preferred coping strategies.

  Use headphones or calming tools when in challenging environments.

  Discuss sensory needs regularly with staff to update strategies.`,
  ],
  [
    ChallengeType.CALM,
    `Supporting individuals in learning how to calm themselves can improve focus, emotional control, and wellbeing. Encourage them to engage in calming activities, such as quiet hobbies, breathing exercises, or mindfulness practices during structured or break times in the day. Help them find a quiet, safe space if possible.

  Possible Support Strategies:

  Practise a relaxation activity (e.g., breathing, stretching, quiet hobby) for 5–10 minutes daily.

  Identify and use a designated calm space when available.

  Take part in a mindfulness or calming session once a week if offered.`,
  ],
  [
    ChallengeType.CONFIDENCE,
    `Transitioning into custody or new routines can cause anxiety. Build confidence by clearly explaining daily routines, introducing key staff, and offering to walk through new environments. Answer questions openly and offer reassurance.

  Possible Support Strategies:

  Attend an orientation or induction session to understand routines.

  Find out who are the key staff contacts and write down who to go to for support.

  Visit new activity areas with support staff to know what happens.`,
  ],
  [
    ChallengeType.MANAGING_CHANGE,
    `Support individuals who find change difficult by giving early notice of upcoming changes in schedule or environment. Offer regular check-ins to talk through transitions and provide written reminders where helpful.

  Possible Support Strategies:

  Attend regular check-ins with staff to prepare for upcoming changes.

  Practise using a weekly planner or routine sheet to increase predictability.

  Use calming techniques before and after a change in routine.`,
  ],
  [
    ChallengeType.EMOTIONAL_CONTROL,
    `Help individuals recognise triggers and early signs of emotional overwhelm. Encourage reflection and use of strategies like taking space, deep breathing, or talking to staff before emotions escalate. Reinforce positive behaviour choices.

  Possible Support Strategies:

  Keep a log of your emotional triggers and any early warning signs you notice.

  Practise one calming strategy during emotional moments (e.g., deep breathing, stepping away from the setting (where possible)).

Practice a “cool down” plan during high-stress situations.`,
  ],
  [
    ChallengeType.IMPULSE_CONTROL,
    `Support individuals in recognising patterns of impulsive behaviour. Encourage the “pause and plan” technique—helping them stop, think, and choose before acting. Use role-playing or daily reflection to reinforce self-control skills.

  Possible Support Strategies:

  Practise the “stop and think” technique once daily during decision-making.

  Identify common triggers in the past for your impulsive actions.

  Role-play potential scenarios that require a delayed response so you can plan to avoid them (where possible).`,
  ],
  [
    ChallengeType.EMPATHY,
    `If someone struggles with showing empathy, help them consider how others might feel by talking through some real life scenarios. Encourage respectful communication and ask reflective questions about tone and intention. Show how this can be done.Offer feedback supportively. Check for understanding.

                                                                                                                                                                                                                                                                                                                                                                                                                                      Possible Support Strategies:

  Practise one weekly activity focused on understanding others’ perspectives. Create some scenarios that are real-life to use.

  Ask for and accept feedback about tone and behaviour in social settings.

  Discuss using journaling or having a conversation if unsure of feelings of others in a specific situation where possible.`,
  ],
  [
    ChallengeType.READING_EMOTIONS,
    `Some individuals may struggle to read facial expressions, tone, or body language. Offer support by pointing out emotional cues during conversations in one to one feedback. Practice through role-play, videos, or supported social scenarios.

  Possible Support Strategies:

  Take part in weekly activities that focus on recognising emotional cues (e.g., facial expressions, tone of voice).

  Discuss checking understanding by asking others how they feel in conversation.
  Identify your emotions in different situations.`,
  ],
  [
    ChallengeType.RESTFULNESS,
    `Support those who need movement to concentrate by offering discreet 'fidget tools' (e.g., elastic bands, doodling) and agreeing on acceptable ways to manage this in structured environments. Encourage respectful use.

  Possible Support Strategies:

  Use a fidget aid or calming strategy during seated tasks.

  Identify which tools improve focus without causing disruption.

  Discuss usage and boundaries for use during activities or meetings.`,
  ],
  [
    ChallengeType.TASK_SWITCHING,
    `Switching between tasks can be challenging for some individuals. Encourage a focus on one task at a time and ways  to track progress. Help them schedule time blocks and discuss ways to break tasks into smaller, more manageable steps.

  Possible Support Strategies:

  Plan tasks using time blocks focused on one task at a time. Try using a timer if available.

  Use a notepad, tick list or log to track where you left off.

  Ask how to break large tasks into small parts and complete them step by step.`,
  ],
  [
    ChallengeType.ATTENTION_TO_DETAIL,
    `Support individuals who struggle with accuracy by helping them identify when they are most focused. Suggest tools like spelling or grammar checkers and encourage them to avoid highly detailed tasks during low-energy periods.

  Possible Support Strategies:

  Understand that focused tasks need to be done during peak concentration times and not when you are too tired.

  Use checklists or spelling/grammar tools when completing written work.

  Ask staff to review important work together and practise checking work twice before submission.`,
  ],
  [
    ChallengeType.FORWARD_PLANNING,
    `Planning ahead can be difficult. Help individuals identify where they struggle—short-term vs. long-term. Provide tools like daily planners, alarms, and ask guiding questions about their priorities and time use.

  Possible Support Strategies:

  Use a planner or schedule to record tasks for the day/week.

  Set alarms or reminders to support time management.

  Prioritise tasks by checking with staff or peers.`,
  ],
  [
    ChallengeType.TASK_INITIATION,
    `Getting started, especially with less interesting tasks, can be a barrier. Encourage individuals to break tasks down, share their goals or deadlines with staff, and use small rewards to stay motivated.

  Possible Support Strategies:

  Identify one small task to start each day and complete it.

  Break large tasks into 2–3 smaller steps.

  Share daily or weekly goals with a trusted staff member.`,
  ],
  [
    ChallengeType.SELF_ORGANISED,
    `Lack of structure can affect wellbeing and memory. Help individuals develop a simple daily plan. Support them in prioritising key tasks and writing down anything they need to remember for the next day.

  Possible Support Strategies:

  Create and follow a basic daily routine with 3–5 priority items.

  Prepare a “next day” list each evening.

  Practise organising personal items in the same place daily.`,
  ],
  [
    ChallengeType.TIME_ALLOCATION,
    `Many people benefit from support in managing time and prioritising tasks. Offer help with to-do lists, breaking tasks into steps, and using reminders. Check in to help them assess which tasks matter most.

  Possible Support Strategies:

  Maintain a daily to-do list with time estimates.

  Ask for staff support in prioritising tasks weekly.

  Use visual or written reminders for upcoming deadlines.`,
  ],
  [
    ChallengeType.PROBLEM_SOLVING,
    `Problem solving takes practice. Encourage individuals to break down problems, talk through options, and test out possible solutions. Support reflection on outcomes to learn from experience.

  Possible Support Strategies:

  Break down one problem or challenge each week into smaller parts.

  Discuss possible solutions with staff or peers.

  Record what solution was chosen and how it worked.`,
  ],
  [
    ChallengeType.FINISHING_TASKS,
    `Staying motivated through to the end of a task can be tough. Help the person set small, clear goals, reduce distractions, and use motivation techniques like rewards or purpose-focused thinking.

  Possible Support Strategies:

  Set clear start and end points for each task.

  Identify and consider if there is a potential distraction before beginning and if you can reduce it e.g. wearing headphones if there is noise( where possible).

  Practise completing at least one full task per day and use a reward system to celebrate task completion.`,
  ],
  [
    ChallengeType.TIDINESS,
    `Support individuals in creating consistent habits for where they keep personal items. Encourage short, daily tidying routines to reduce stress and support better functioning in a shared space.

  Possible Support Strategies:

  Spend 10–15 minutes daily organising and tidying personal space.

  Keep key items (e.g., books, hygiene items) in designated spots.

  Create a checklist to prepare for the next day.`,
  ],
  [
    ChallengeType.FOCUSING,
    `Maintaining focus on a task can be difficult. Help individuals set clear work periods with no distractions, using short breaks and written task lists to stay engaged. Encourage retrying if they lose focus.

  Possible Support Strategies:

  Work on one task at a time for 10–15 minute sessions.

  Create a distraction-free space for work when possible.

  Use task lists to stay on track and tick off completed items.`,
  ],
  [
    ChallengeType.PEOPLE_PERSON,
    `Some people prefer their own company. If someone has recently withdrawn from social interaction, check in on their emotional wellbeing. Support low-pressure engagement, such as small groups or one-to-one activities.

  Possible Support Strategies:

  Join one small group or one-to-one activity weekly.

  Talk to staff if feeling very anxious or low/depressed.

  Identify one social activity that feels manageable.`,
  ],
  [
    ChallengeType.NON_VERBAL_COMMUNICATION,
    `If someone struggles with eye contact or body language, help them find other ways to show interest, such as making relevant comments or nodding. Be patient and open in conversation.

  Possible Support Strategies:

  Practise showing listening through nodding or brief responses.

  Inform others that not looking at a person directly (eye contact) doesn’t mean a lack of interest.`,
  ],
  [
    ChallengeType.ACTIVE_LISTENING,
    `Support individuals in focusing during conversations by reducing background distractions. Encourage them to summarise or ask questions to show understanding.

  Possible Support Strategies:

  Practise summarising what someone says in a conversation to check you have understood.

  If uncertain ask for information to be repeated.

  Look at the person's body language also to see if there are any other clues what they are saying/feeling.`,
  ],
  [
    ChallengeType.WORD_FINDING,
    `Allow extra time for individuals who struggle to find the right words. Encourage them to make notes or ask for written information to support understanding.

  Possible Support Strategies:

  Write down key words before or during conversations.

  Request written information when needed.

  Practise explaining things with staff support.`,
  ],
  [
    ChallengeType.SPEAKING,
    `If someone has difficulty speaking fluently, create space for slower speech. Offer writing as an alternative form of communication when needed.

  Possible Support Strategies:

  Practise speaking slowly during daily conversations.

  Use writing to prepare for important discussions.
  Practice talking aout subjects you feel more confident about.`,
  ],
  [
    ChallengeType.SOCIAL_NUANCES,
    `Support individuals in recognising and interpreting jokes or sarcasm. Encourage them to ask for clarification and reassure them it’s okay to ask.

  Possible Support Strategies:

  Ask for clarification when unsure about jokes or comments.

  Note examples of sarcasm or humour each week.

  Practise checking meanings with a peer or staff member.`,
  ],
  [
    ChallengeType.EXTROVERSION_INTROVERSION,
    `For those uncomfortable with socialising, support interaction in low-pressure settings. Help them prepare safe conversation topics and guide them in choosing suitable environments.

  Possible Support Strategies:

  Practise joining a small group once a week to be with others with similar interests..

  Prepare 2–3 safe topics to talk about (e.g., food, hobbies).

  Identify what social settings feel most comfortable for you such as one -to-one conversations.`,
  ],
  [
    ChallengeType.COMMUNICATION,
    `Some individuals may need support starting or ending conversations. Help them practise common phrases and model polite conversation endings.

  Possible Support Strategies:

  Practise starting a conversation once a day.

  Use polite phrases to end conversations respectfully.

  List 3 topics to refer to during chats that will not upset others and focus on these.`,
  ],
  [
    ChallengeType.SOCIAL_ADAPTABILITY,
    `Social change or unfamiliar environments may cause anxiety. Offer clear information about what to expect in new settings and, where possible, introduce peer mentors.

  Possible Support Strategies:

  Ask staff for details about new social situations or changes in advance where possible.

  Meet with a peer mentor once a week and discuss if there are things you are not sure about.

  Reflect after new situations to identify what went well.`,
  ],
  [
    ChallengeType.TURN_TAKING,
    `Taking turns in conversation helps build respectful communication. If someone struggles with interrupting, suggest note-taking and support the habit of waiting for natural pauses.

  Possible Support Strategies:

  Practise waiting for a pause before speaking.

  Use notes to record thoughts instead of interrupting.

  Receive feedback from staff on conversation habits.`,
  ],
  [
    ChallengeType.LANGUAGE_FLUENCY,
    `Support individuals who need extra time to organise their thoughts. Allow time for responses, and help them practise structuring what they want to say.

  Possible Support Strategies:

  Use planning tools (e.g., information in bullet points or written notes) before speaking.

  Practise structured speaking weekly with staff on a topic you enjoy or know something about.

  Ask for extra time when needed in conversations.`,
  ],
  [
    ChallengeType.READING,
    `Help individuals build confidence with reading by using headings, scanning for key points, or offering audio alternatives where available.

  Possible Support Strategies:

  Practise scanning a short article each day to improve reading fluency.

  Listen, if you can to a podcast or audiobook,read a magazine or chapter in a book.

  Identify and highlight main ideas in short texts you have read.`,
  ],
  [
    ChallengeType.SPELLING,
    `If spelling is a challenge, encourage sounding out words, using dictionaries, or asking someone to review their writing. Offer non-judgmental support.

  Possible Support Strategies:

  Use a dictionary or spelling tools for daily tasks.

  Ask a staff member to check written work weekly.

  Practise spelling 3–5 new words each week.`,
  ],
  [
    ChallengeType.WRITING,
    `Support with writing by modelling how to plan or outline tasks using bullet points or templates. Provide examples of similar writing tasks if needed.

  Possible Support Strategies:

  Use bullet points to plan out writing tasks.

  Ask staff for a writing example or template.

  Complete one structured writing task per week.`,
  ],
  [
    ChallengeType.ALPHABET_ORDERING,
    `Alphabetical knowledge helps with using dictionaries or indexes. Practise learning letters in small groups and offer games or visual prompts to support memorisation.

  Possible Support Strategies:

  Practise ordering letters in small groups (e.g., A–E, F–J).

Use alphabetical lists once per week.

  Apply alphabetical skills in a dictionary task.`,
  ],
  [
    ChallengeType.READING_COMPREHENSION,
    `When someone struggles to understand what they’re reading, encourage them to use headings and key words to get an idea of the main topic before reading. Support them to read in small sections, highlight or underline important words, and discuss what they’ve read. Offer help when needed and create a supportive space for questions.

  Use headings and key words to predict the topic before reading a new text.

  Practise reading in small chunks and highlight or underline key points.

  Take part in weekly reading discussions with staff or peers to improve understanding.

  Ask for support when unsure about the meaning of a passage or word.`,
  ],
  [
    ChallengeType.READING_VISUAL_DISCRIMINATION,
    `If someone finds reading difficult, encourage them to read in short, manageable chunks rather than whole paragraphs at once. Support them in checking their understanding as they go to build comprehension and confidence. Offering to read aloud with or to them can also make the text more accessible and improve engagement.

  Possible Support Strategies:

  Practise reading in short sections and pause to check understanding after each one.

  Discuss or write a summary of what was read to reinforce comprehension.

  Take part in shared reading sessions with staff or peers once a week.`,
  ],
  [
    ChallengeType.TRACKING,
    `If an individual struggles to follow the text while reading, show them how to use a finger or a guide (like a ruler or strip of paper) to keep their place. Be aware of complaints like blurred vision or frequent loss of focus, and refer them for an eye check-up if needed.

  Possible Support Strategies:

  Use a visual guide such as a piece of card under each line of words to support reading focus.

  Attend an eye check-up if recommended by staff.`,
  ],
  [
    ChallengeType.LANGUAGE_DECODING,
    `Staff can help individuals learn to break longer or difficult words into smaller parts to improve reading and spelling. Encourage them to build a personal word list with definitions of important or frequently used terms. This supports vocabulary growth and confidence in using written language.

  Possible Support Strategies:

  Practice breaking down unfamiliar words during reading sessions into parts.

  Create and update a personal vocabulary list each week.

  Use new words from the list in writing or conversation.`,
  ],
  [
    ChallengeType.HANDWRITING,
    `Handwriting helps with written communication, filling forms, and daily planning. Offenders may write slowly or with poor legibility. Encourage clarity over speed and offer practice with lined paper or handwriting guides. Where possible, provide alternative ways to communicate (e.g., short written notes, typed text if available).                                                                                                      Possible Support Strategies:                                                                          Practise writing clearly for 10 minutes each day.

  Use lined paper to help with neatness.

  Complete one written form or note each week with staff support.`,
  ],
  [
    ChallengeType.BALANCE,
    `Good balance supports safe movement in the cell, gym, or workshops. Poor balance may affect confidence when walking or standing. Help individuals practise simple exercises like standing on one leg (next to a wall for safety) or shifting weight from foot to foot. Reinforce the importance of good sitting posture during education or work.
  Possible Support Strategies:

  Practise standing balance daily (e.g., on one leg for 10 seconds).

  Check sitting posture each time you start work.

  Attend a group exercise session if available to build strength.`,
  ],
  [
    ChallengeType.FINE_MOTOR_SKILLS,
    `Fine motor skills help with tasks requiring hand control like writing, buttoning, or using tools. Offenders may struggle with tasks that require precise finger movement. Provide opportunities for practice through low-risk tasks like puzzles, beading, or folding paper. Suggest wider grips or adaptive tools if available.

  Possible Support Strategies:

  Practise fastening or unfastening buttons/clips each day.

  Complete one fine motor task (puzzle, model, etc.) each week.

  Use assistive tools if provided.`,
  ],
  [
    ChallengeType.LEARNING_NEW_SKILLS,
    `Learning new skills supports rehabilitation and future employment. It may take longer for some individuals, especially with coordination or memory issues. Break tasks into small steps, offer repetition, and use visual aids. Encourage progress over perfection and give regular encouragement.

  Possible Support Strategies:

  Choose one new skill to work on (e.g., laundry, reading instructions).

  Practise new skills requiring coordination 2–3 times per week.

  Recognise what skills are improving with practice and over time.`,
  ],
  [
    ChallengeType.SPORTING_BALL_SKILLS,
    `Ball skills involve coordination, timing, and spatial awareness. Offenders who find these difficult may feel excluded from team sports. Suggest alternative fitness activities like walking, bodyweight exercise, or yoga if permitted. Emphasise participation and personal fitness over competition.

  Possible Support Strategies:

  Join a physical activity session once a week.

  Try a new solo fitness activity (e.g., stretches, push-ups).

  Track activity 3 times a week.`,
  ],
  [
    ChallengeType.DUAL_TASKING,
    `Dual tasking involves doing two things at once (e.g., walking and listening, or speaking while working). Some people find this overwhelming. Support them by encouraging structured tasks that combine steps gradually—like walking while counting, or listening while writing short notes. Allow extra time when needed.

  Possible Support Strategies:

  Practise 1 task each day that involves more than one step e.g. standing on one leg and cleaning your teeth.

  Try combining movement with a mental activity (e.g., walking and counting).`,
  ],
  [
    ChallengeType.FOLDING_PACKING_SORTING,
    `These practical tasks require both motor planning and attention. They can build routine and confidence in self-care and work. Encourage structured sorting or packing tasks (laundry, paperwork, cleaning) with clear instructions. Start with small amounts and praise attention to detail and care.

  Possible Support Strategies:

  Practise sorting or folding items daily.

  Ask staff for one structured task involving packing or organising per week.`,
  ],
  [
    ChallengeType.STAMINA,
    `Stamina affects the ability to complete physical and cognitive tasks over time. Low stamina can affect engagement in work or education. Encourage small, regular activity increases, such as short walks, standing exercises, or stretching. Allow for paced breaks and celebrate gradual improvement.

  Possible Support Strategies:

  Do some physical activity 5 days a week building your capacity e.g. sit ups, squats.
  Track energy levels to notice improvement as you become fitter.`,
  ],
  [
    ChallengeType.GRASP,
    `Grasping skills help with tasks like holding pens, turning taps, or opening food packages. Difficulty may result in frustration or giving up. Suggest tools with wider handles, grips, or elastic bands for support. Include daily practice tasks like unscrewing lids or squeezing objects to build strength.

  Possible  Support Strategies:

  Do 5 minutes of grip-strength activities each day.

  Try using a pen with a larger grip for handwriting.

  Practise tasks like opening containers or turning keys.`,
  ],
  [
    ChallengeType.SPATIAL_AWARENESS,
    `Spatial awareness supports safe movement and task accuracy. Poor spatial skills may result in bumping into objects or placing items inaccurately. Offer tasks that involve physical awareness—like stacking, puzzles, or games involving direction. Reinforce awareness during daily movement and group activity.

  Possible Support Strategies:

  Ask if your eye site can be checked if it has changed recently.

  Complete spatial puzzles (e.g., block or jigsaw) once a week.

  Practice balance tasks such as standing on one leg to improve your skills.`,
  ],
  [
    ChallengeType.SPEED_OF_CALCULATION,
    `Being able to do quick sums supports budgeting, planning, and real-life decision-making. Some may rely on fingers or written methods. Support daily practice of basic sums (adding and subtracting under 20). Offer praise for trying mentally before using a calculator.

  Possible Support Strategies:

  Practise 5 mental sums each day (e.g., 7 + 8, 14 – 5).

  Use a calculator only after trying it in your head.

  Track speed improvement weekly.`,
  ],
  [
    ChallengeType.ARITHMETIC,
    `Arithmetic skills support everyday calculations like change, measurements, or scheduling. Offenders may struggle with memory for number facts like times tables. Focus on simpler tables (2, 5, 10), and encourage frequent real-life practice such as canteen budgeting or checking change.

  Possible Support Strategies:

  Learn one new times table each fortnight.

  Practise using maths to solve one real-life problem per day e.g. budgeting.

  Use flashcards if available.`,
  ],
  [
    ChallengeType.ESTIMATION,
    `Estimation helps with timekeeping, costs, and task planning. Difficulty here can lead to under- or over-preparing. Support rounding up amounts and timing everyday tasks (e.g., how long a chore takes). Use simple visual examples and reflect on accuracy to improve confidence.

  Possible Support Strategies:

  Practise estimating time to complete a daily task.

  Try rounding up prices in the canteen to check costs.`,
  ],
  [
    ChallengeType.MATHS_LITERACY,
    `Maths literacy involves understanding maths vocabulary and reading instructions accurately. Confusing terms or mixing up numbers and letters is common. Encourage reading questions aloud, using coloured pens or underlining to highlight key terms, and checking understanding with staff or peers.

  Possible Support Strategies:

  Read maths questions aloud.

  Check you understand the terms being used such as plus, sum, add and and all mean the same thing.

  Use a checklist to avoid common mistakes.`,
  ],
  [
    ChallengeType.MATHS_CONFIDENCE,
    `Confidence impacts how willingly someone tackles maths tasks. Past struggles may cause avoidance or anxiety. Start small and offer reassurance. Use puzzles, games, or practical examples that feel less threatening. Praise effort and remind them it’s okay to use support tools like calculators.

  Possible Support Strategies:

  Do a short maths activity or puzzle daily like Sudoku.

  Identify where you need some help such as budgeting.

  Try using tools such as a calculator or visual aid to make maths easier.`,
  ],
  [
    ChallengeType.FRACTIONS_PERCENTAGES,
    `Understanding fractions and percentages helps with budgeting, cooking, and everyday decision-making. Use real-world examples like half-price deals, or sharing amounts. Reinforce practice through short written problems and allow use of calculators for checking.

  Practise converting 3 common fractions to percentages (e.g., ½, ¼, ¾).

  Use a calculator to check answers.

  Try one “real life” fraction question each week e.g. cutting  up food into quarters.`,
  ],
  [
    ChallengeType.WORD_BASED_PROBLEMS,
    `These problems combine reading and maths skills, which can be overwhelming. Learners may get stuck on wording rather than the maths itself. Help them break questions down, underline keywords (e.g., plus/add), and explain the scenario in their own words before solving.

  Possible Support Strategies:

  Use highlighters or underlining to find key words.

  Ask for help if you don't understand the meaning of specific words.`,
  ],
  [
    ChallengeType.MONEY_MANAGEMENT,
    `Money management is essential for independence and successful resettlement. Support includes budgeting, adding prices, and tracking spending. Use examples from prison life like canteen costs or saving for phone credit. Encourage calculator use and practice making financial decisions in low-risk ways.

  Possible Support Strategies:

  Plan a budget for one week’s canteen allowance.

  Practise adding/subtracting different prices daily.

  Try estimating total cost before purchases.`,
  ],
  [
    ChallengeType.NUMBER_RECALL,
    `Remembering numbers like PINs or ID numbers is important for daily functioning. Some may struggle with short-term memory. Encourage use of rhymes, chunking, or repetition to strengthen recall. Reinforce safe practices for password creation and not sharing details.

  Possible Support Strategies:

  Practise remembering one important number each week (e.g., ID, PIN).

  Use memory techniques like rhymes or number patterns.

  Create a mock secure password (for practice).`,
  ],
  [
    ChallengeType.NUMBER_SEQUENCING,
    `Sequencing supports planning, time-telling, and completing steps in the right order. Offenders may mix up numbers or find it hard to judge order. Use visual supports like calendars, number lines, or routine lists. Practise with puzzles or timed tasks that involve ordering.

  Possible Support Strategies:

  Complete one sequencing puzzle or game per day.

  Practise putting events in order of time.

  Try sequencing numbers forward/backward in 2s, 5s, or 10s.`,
  ],
  [
    ChallengeType.FORWARD_PLANNING,
    `Planning ahead can be difficult. Help individuals identify where they struggle—short-term vs. long-term. Provide tools like daily planners, alarms, and ask guiding questions about their priorities and time use.

  Possible Support Strategies:

  Use a planner or schedule to record tasks for the day/week.

  Set alarms or reminders to support time management.

  Prioritise tasks by checking with staff or peers.`,
  ],
])

const challengeStaffSupportTextLookupFilter = (value: ChallengeType): string =>
  challengeTypeStaffStrategyValues.get(value)

export default challengeStaffSupportTextLookupFilter
