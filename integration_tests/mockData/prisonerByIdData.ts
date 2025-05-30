const prisoners = {
  A00001A: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner-search-api/prisoner/A00001A',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonId: 'BXI',
        prisonerNumber: 'A00001A',
        firstName: 'ABBY',
        lastName: 'KYRIAKOPOULOS',
        releaseDate: '2030-12-31',
        nonDtoReleaseDateType: 'HDC',
        receptionDate: '2001-01-17',
        dateOfBirth: '1967-12-13',
        cellLocation: 'A-1-1023',
        restrictedPatient: false,
      },
    },
  },
  H4115SD: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner-search-api/prisoner/H4115SD',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonId: 'BXI',
        prisonerNumber: 'H4115SD',
        firstName: 'IZFNIFS',
        lastName: 'JAVULLAH',
        releaseDate: '2030-12-31',
        nonDtoReleaseDateType: 'HDC',
        receptionDate: '2003-02-17',
        dateOfBirth: '1982-04-12',
        cellLocation: 'B-2-977',
        restrictedPatient: false,
      },
    },
  },
  G5005GD: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner-search-api/prisoner/G5005GD',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonId: 'BXI',
        prisonerNumber: 'G5005GD',
        firstName: 'URPINICHE',
        lastName: 'ROYCINGTON',
        releaseDate: '2030-12-31',
        nonDtoReleaseDateType: 'HDC',
        receptionDate: '2003-03-17',
        dateOfBirth: '1980-06-22',
        cellLocation: 'F-19-572',
        restrictedPatient: false,
      },
    },
  },
  G6115VJ: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner-search-api/prisoner/G6115VJ',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonId: 'BXI',
        prisonerNumber: 'G6115VJ',
        firstName: 'EDFDAU',
        lastName: 'CARRER',
        releaseDate: '2030-12-31',
        nonDtoReleaseDateType: 'HDC',
        receptionDate: '2004-04-17',
        dateOfBirth: '1976-02-28',
        cellLocation: 'B-12-55',
        restrictedPatient: false,
      },
    },
  },
  G9981UK: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner-search-api/prisoner/G9981UK',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonId: 'BXI',
        prisonerNumber: 'G9981UK',
        firstName: 'IBARAVID',
        lastName: 'MARSHEE',
        releaseDate: '2030-12-31',
        nonDtoReleaseDateType: 'HDC',
        receptionDate: '2004-04-17',
        dateOfBirth: '1976-02-28',
        cellLocation: 'B-12-55',
        restrictedPatient: false,
      },
    },
  },
  A9404DY: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner-search-api/prisoner/A9404DY',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonId: 'PVI',
        prisonerNumber: 'A9404DY',
        firstName: 'EECHINTAS',
        lastName: 'TAREO',
        releaseDate: '2030-12-31',
        nonDtoReleaseDateType: 'HDC',
        receptionDate: '2004-04-17',
        dateOfBirth: '1976-02-28',
        cellLocation: 'B-12-55',
        restrictedPatient: false,
      },
    },
  },
  A8520DZ: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner-search-api/prisoner/A8520DZ',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonId: 'OUT',
        prisonerNumber: 'A8520DZ',
        firstName: 'YMYNNEUMAR',
        lastName: 'SARERLY',
        releaseDate: '2030-12-31',
        nonDtoReleaseDateType: 'HDC',
        receptionDate: '2004-04-17',
        dateOfBirth: '1976-02-28',
        cellLocation: 'B-12-55',
        restrictedPatient: true,
        supportingPrisonId: 'BXI',
      },
    },
  },
  G0577GL: {
    request: {
      method: 'GET',
      urlPattern: '/prisoner-search-api/prisoner/G0577GL',
    },
    response: {
      status: 200,
      headers: { 'Content-Type': 'application/json;charset=UTF-8' },
      jsonBody: {
        prisonId: 'OUT',
        prisonerNumber: 'G0577GL',
        firstName: 'DINEENG',
        lastName: 'BRIANORES',
        releaseDate: '2030-12-31',
        nonDtoReleaseDateType: 'HDC',
        receptionDate: '2004-04-17',
        dateOfBirth: '1976-02-28',
        cellLocation: 'B-12-55',
        restrictedPatient: true,
        supportingPrisonId: 'PVI',
      },
    },
  },
}

const defaultPrisoner = (prisonNumber: string) => ({
  request: {
    method: 'GET',
    urlPattern: `/prisoner-search-api/prisoner/${prisonNumber}`,
  },
  response: {
    status: 200,
    headers: { 'Content-Type': 'application/json;charset=UTF-8' },
    jsonBody: {
      prisonId: 'BXI',
      prisonerNumber: prisonNumber,
      firstName: 'ABBY',
      lastName: 'KYRIAKOPOULOS',
      releaseDate: '2030-12-31',
      nonDtoReleaseDateType: 'HDC',
      receptionDate: '2001-01-17',
      dateOfBirth: '1967-12-13',
      cellLocation: 'A-1-1023',
      restrictedPatient: false,
    },
  },
})

export { prisoners, defaultPrisoner }
