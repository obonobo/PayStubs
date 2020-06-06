import { Schema } from 'mongoose';

/***
 * A business entity is like IBM or ceridian. 
 * It has a name and a code associated.
 */
const business : Schema = new Schema({
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
const person : Schema = new Schema({
  name: {
    first: String,
    last: String
  },
  serial: String
});

/***
 * Represents a charge to a business account
 */
const accountCharge : Schema = new Schema({
  accNum: String,
  charge: Number
});

/**
 * Contains exemptions and estimated earnings 
 * NOTE: helpCentre should be a phone number
 */
const taxInfo : Schema = new Schema({
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
const payStubSchema : Schema = new Schema({
  
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
}, { 
  
  /**
   * Collation = rules for string comparison
   * 
   * Here we are also specifying a collation for our schema
   * Collation is feature that allows you to specify
   * some options for string comparisons, like case insensitive, etc. 
   */
  collation: {
    locale: 'en_US',    // Mandatory when specifying collation
    strength: 1,        // Perform comparison of base chars only, no case etc.
    caseFirst: "upper", // Sort order, "upper" -> Upper case sorts higher than lower
    numericOrdering: true, // Compare numeric strings as numbers
  }
});

export default payStubSchema;
