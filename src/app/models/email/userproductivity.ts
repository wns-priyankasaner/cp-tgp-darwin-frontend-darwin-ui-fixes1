export interface IUserProductivity {
    queryCases: number;
    caseCompleted: number;
    holdCase: number;
    productiveHours: number | null;
    breakHours: number | null;
    auxTakenByUser: any;
    breaksdDetail: any;
    callCompleted: number;
    dropedCases: number;
    empId: string;
    empName: string;
    futureDate: number;
    generalBreakHours: number | null;
    handoff: number;
    idealTime: number | null;
    nfa: number;
    nfaJunkSPAMemail: number;
    nonProductiveHours: number | null;
    other: number;
    otherAuxBreaks: any;
    queryAlreadyCompleted: number;
    requestinfo: number;
    result: number;
    subQueueName: string;
    supportEscalation: number;
    totHours: number | null;
    totalTimeTaken: string;
  }
  