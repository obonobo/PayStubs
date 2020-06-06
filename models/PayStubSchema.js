const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/***
 * A business entity is like IBM or ceridian. 
 * It has a name and a code associated.
 */
const business = new Schema({
  name: {type: String},
  code: {
    type: String, 
    minlength: 2,
    maxlength: 6
  }
});

/***
 * A person has identifiable information such as
 * name and serial number.
 * NOTE: I have left no limit on serial number size
 */
const person = new Schema({
  name: {
    first: String,
    last: String
  },
  serial: String
});

/***
 * Represents a charge to a business account
 */
const accountCharge = new Schema({
  accNum: String,
  charge: Number
});

/**
 * Contains exemptions and estimated earnings 
 * NOTE: helpCentre should be a phone number
 */
const taxInfo = new Schema({
  personalExempt: Number,
  specialExempt: Number,
  additionalTax: Number,
  estEarnings: Number,
  estExpenses: Number,
  helpCentre: String
});

/***
 * Paystubs documents should include the information below.
 * For now, I haven't made any fields required
 */
const payStubSchema = new Schema({
  
  // Our two business entities
  processor: business,
  employer: business,

  // Dates from the top of your stub
  payPeriodEndDate: Date,
  depositeDate: Date,

  // Personal info
  me: person,
  profileSalary: Number,
  hourlyWage: Number,

  // Charges to business accounts
  earningsAccNum: accountCharge,
  expenseAccNum: accountCharge,

  // Federal and provincial tax information
  taxInformation: {
    federal: taxInfo,
    provincial: taxInfo
  },

  // Pay stub section - your actual pay
  weeklyPay: [{ 
    endingDate: Date, 
    hours: Number, 
    current: Number, 
    YTD: Number 
  }],
  vacationPay: { current: Number, YTD: Number },
  totalPay: { current: Number, YTD: Number },

  // Deductions
  deductions: {
    CPP_QPP: { current: Number, YTD: Number },
    EI: { current: Number, YTD: Number },
    fedTax: { current: Number, YTD: Number },
    total: { current: Number, YTD: Number }
  },

  netDeposit: { current: Number, YTD: Number }
});

module.exports = mongoose.model("PayStub", PayStubSchema);
