export const exampleData = {
  processor: {
    name: "CERIDIAN", code: "01"
  },
  employer: {
    name: "IBM", code: "0202"
  },

  payPeriodEndDate: '05/22/20',
  depositeDate: '05/29/20',

  me: {
    name: {
      first: 'Ethan', last: 'Benabou'
    },
    serial: '0B1815'
  },
  profileSalary: 938.40,
  hourlyWage: 23.4600,

  earningsAcc: {
    accNum: '00447681 6376133',
    charge: 1521.40
  },
  expenseAcc: {
    accNum: '00447681 6376133',
    charge: 0
  },

  taxInformation: {
    federal: {
      personalExempt: 12298,
      specialExempt: 0,
      additionalTax: 0,
      estEarnings: 0,
      estExpenses: 0,
      helpCentre: "514-712-0242"
    },
    provincial: {
      personalExempt: 10783,
      specialExempt: 0,
      additionalTax: 0,
      estEarnings: 0,
      estExpenses: 0,
      helpCentre: "514-712-0242"
    }
  },

  weeklyPay: [
    {
      endingDate: '05/15/20',
      hours: 40.00,
      current: 938.40,
      YTD: 0
    },
    {
      endingDate: '05/22/20',
      hours: 40.00,
      current: 938.40,
      YTD: 2815.20
    }
  ],
  vacationPay: { current: 75.07, YTD: 112.61 },
  totalPay: { current: 1951.87, YTD: 2927.81 },

  deductions: {
    CPP_QPP: { current: 95.41, YTD: 139.58 },
    EI: { current: 30.84, YTD: 46.26 },
    fedTax: { current: 304.22, YTD: 400.41 },
    total: { current: 430.47, YTD: 586.25 }
  },

  netDeposit: { current: 1521.40, YTD: 2341.56 }
};


export const exampleDataEmpty = {
  processor: { name: "", code: "" },
  employer: { name: "", code: "" },
  payPeriodEndDate: '',
  depositeDate: '',
  me: { name: { first: '', last: '' }, serial: '' },
  profileSalary: '',
  hourlyWage: '',
  earningsAcc: { accNum: '', charge: '' },
  expenseAcc: { accNum: '', charge: '' },
  taxInformation: {
      federal:    { personalExempt: '', specialExempt: '', additionalTax: '', 
                    estEarnings: '', estExpenses: '', helpCentre: "" },
      provincial: { personalExempt: '',specialExempt: '',additionalTax: '',
                    estEarnings: '',estExpenses: '',helpCentre: "" }
  },
  weeklyPay: [{ endingDate: '',hours: '',current: '',YTD: '' }],
  vacationPay: { current: '', YTD: '' },
  totalPay: { current: '', YTD: '' },
  deductions: { CPP_QPP: { current: '', YTD: '' },EI: { current: '', YTD: '' },
               fedTax: { current: '', YTD: '' },total: { current: '', YTD: '' }},
  netDeposit: { current: '', YTD: '' }
};
