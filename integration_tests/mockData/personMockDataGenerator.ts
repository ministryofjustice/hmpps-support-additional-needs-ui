import type { AdditionalNeedsSummary, Person } from 'supportAdditionalNeedsApiClient'
import { addDays, format, startOfToday, subDays } from 'date-fns'

/**
 * Generator function that can be called as a cypress task that generates and returns an array of random `Person`
 * records, that can then in turn be used with cypress tasks that mock the Search API.
 * All generated `Person` records will have a unique prison number.
 */
const personMockDataGenerator = (numberOfRecords = 500): Array<Person> => {
  const uniquePrisonNumbers = generateUniquePrisonNumbers(numberOfRecords)

  return uniquePrisonNumbers.map(prisonNumber => ({
    prisonNumber,
    forename: randomForename(),
    surname: randomSurname(),
    dateOfBirth: randomDateOfBirth(),
    releaseDate: randomReleaseDate(),
    cellLocation: generateRandomLocation(),
    sentenceType: randomSentenceType(),
    additionalNeeds: randomAdditionalNeeds(),
  }))
}

const generateUniquePrisonNumbers = (numberOfRecords: number): Array<string> => {
  const prisonNumbers = new Set<string>()
  while (prisonNumbers.size < numberOfRecords) {
    prisonNumbers.add(generatePrisonNumber())
  }
  return Array.from(prisonNumbers)
}

const generatePrisonNumber = (): string => `${randomLetters(1)}${randomNumbers(4)}${randomLetters(2)}`

const generateRandomLocation = (): string => `${randomLetters(1)}-${randomNumbers(4)}-${randomLetters(1)}`

const randomForename = (): string => FORENAMES[randomNumber(1, FORENAMES.length) - 1]

const randomSurname = (): string => SURNAMES[randomNumber(1, SURNAMES.length) - 1]

const randomSentenceType = (): string => SENTENCE_TYPES[randomNumber(1, SENTENCE_TYPES.length) - 1]

/**
 * Returns a random date sometime between 6570 days (18 years) and 25550 days (70 years) years before today
 */
const randomDateOfBirth = (): string => format(subDays(startOfToday(), randomNumber(6570, 25550)), 'yyyy-MM-dd')

/**
 * Returns a random date sometime between 30 days and 5475 days (15 years) years after today; or undefined.
 * Approximately 5% will return undefined, meaning the prisoner has no release date.
 */
const randomReleaseDate = (): string | undefined =>
  randomNumber(1, 100) > 5 ? format(addDays(startOfToday(), randomNumber(30, 5475)), 'yyyy-MM-dd') : undefined

const randomLetters = (numberOfLetters: number): string => {
  const letters: Array<string> = []
  for (let i = 0; i < numberOfLetters; i += 1) {
    letters.push(ALPHABET[randomNumber(1, 26) - 1])
  }
  return letters.join('')
}

const randomNumbers = (numberOfNumbers: number): string => {
  const numbers: Array<number> = []
  for (let i = 0; i < numberOfNumbers; i += 1) {
    numbers.push(randomNumber(0, 9))
  }
  return numbers.join('')
}

const randomNumber = (min: number, max: number): number => Math.floor(Math.random() * (max + 1 - min) + min)

const randomAdditionalNeeds = (): AdditionalNeedsSummary => {
  if (randomNumber(1, 2) === 1) {
    return undefined
  }
  return {
    hasChallenges: randomNumber(1, 2) === 2,
    hasConditions: randomNumber(1, 2) === 2,
    hasStrengths: randomNumber(1, 2) === 2,
    hasSupportRecommendations: randomNumber(1, 2) === 2,
  }
}

const ALPHABET = [
  'A',
  'B',
  'C',
  'D',
  'E',
  'F',
  'G',
  'H',
  'I',
  'J',
  'K',
  'L',
  'M',
  'N',
  'O',
  'P',
  'Q',
  'R',
  'S',
  'T',
  'U',
  'V',
  'W',
  'X',
  'Z',
  'Y',
]

const FORENAMES = [
  'BILL',
  'BEN',
  'MIKE',
  'MARK',
  'SIMON',
  'HARRY',
  'ALF',
  'ALBERT',
  'PAUL',
  'PETE',
  'PETER',
  'MARTIN',
  'FRED',
  'FRANK',
  'FREDERICK',
  'ROD',
  'RODNEY',
  'ROLF',
  'JAMES',
  'JIMMY',
  'STEVE',
  'STEPHEN',
  'JOHN',
  'OSCAR',
  'CHARLIE',
  'ROMEO',
  'JACK',
]

const SURNAMES = [
  'JONES',
  'SMITH',
  'BLOGGS',
  'HARRIS',
  'TWEED',
  'YELLOW',
  'BLUE',
  'RED',
  'DOCK',
  'BLOGS',
  'JAMESON',
  'TREE',
  'RAIN',
  'VAUXHALL',
  'FORD',
  'MONTEGO',
  'MINI',
  'GOLF',
  'TANGO',
  'ECHO',
  'FOXTROT',
  'LIMA',
  'JOHNSON',
  'JACKSON',
]

const SENTENCE_TYPES = [
  'RECALL',
  'DEAD',
  'INDETERMINATE_SENTENCE',
  'SENTENCED',
  'CONVICTED_UNSENTENCED',
  'CIVIL_PRISONER',
  'IMMIGRATION_DETAINEE',
  'REMAND',
  'UNKNOWN',
  'OTHER',
]

export default { generatePeople: personMockDataGenerator }
