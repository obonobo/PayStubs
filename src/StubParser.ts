type wkWeek = {
    endingDate: Date,
    hours: Number,
    current: Number,
    YTD: Number,
    startIndex: number,
    endIndex: number,
}

/**
 * A class that parses an IBM paystub. One-time use only.
 * Alternatively, you can use the static method.
 */
export class IBMStubParser  {

    private stub: string
    private parsed: boolean
    private parserFunction: Function

    public static regular = /^REGULAR$/;
    public static pay = /^PAY$/;
    public static date = /^\d{2}\/\d{2}\/\d{2}$/;
    public static payment = /^(\d{1,3}\,)*\d{1,3}\.\d{2,4}$/;
    public static hours = /^\d{1,2}\.?\d{0,2}$/;

    /**
     * Creates a new parser object.
     * @param stub The stub that you would like to parse
     */
    public constructor(stub: string, parserFunction = IBMStubParser.defaultParserFunction) {
        this.stub = stub;
        this.parsed = false;
        this.parserFunction = parserFunction;
    }

    /**
     * Parse the string held inside me.
     * @returns An object with the parsed fields
     */
    public parse(): Object {
        this.parsed = true;
        return this.parserFunction(this.stub);
    }

    // Getters
    public isParsed() { return this.parsed; }
    public getStub() { return new String(this.stub) }

    /**
     * The default parsing function of a stub parser
     * @param stub 
     */
    private static defaultParserFunction(stub: string) {
        let ret: any = {};

        let data = stub.replace(/(\n|\r)+/g, ' ').split(/ +/);
        // Remove the excess up to the 'regular pay' section
        data.splice(0, 25); data.splice(2, 2);  data.splice(4, 8);
        data.splice(5, 2);  data.splice(7, 3);  data.splice(8, 18);
        data.splice(10, 2); data.splice(11, 5); data.splice(12, 6);
        data.splice(13, 7); data.splice(15, 1); data.splice(16, 2);
        data.splice(17, 14);
    
        // Extract the set of regular pay weeks
        ret.weeklyPay = [];
        let workWeeks: Array<wkWeek> = [];
        let count = 0;
        while (IBMStubParser.regular.test(data[17])) {
            workWeeks[count] = IBMStubParser.parseRegularPay(data, 17);
            data.splice(workWeeks[count].startIndex, 
                        workWeeks[count].endIndex - workWeeks[count].startIndex);

            delete workWeeks[count].endIndex;
            delete workWeeks[count].startIndex;
            ret.weeklyPay.push(workWeeks[count]);
            count++;
        }
        
        // Remove the rest of the excess
        data.splice(17, 3); data.splice(19, 2); data.splice(21, 5);
        data.splice(23, 2); data.splice(25, 2); data.splice(27, 2);
        data.splice(29, 2); data.splice(31, data.length - 31); 
    
        // Build a new object.
        ret.processor = {};
        ret.employer = {};
        ret.expenseAcc = {};
        ret.vacationPay = {};
        ret.totalPay = {};
        ret.netDeposit = {};
        ret.me = { name: {} };
        ret.taxInformation = { federal: {
            personalExempt: 0, specialExempt: 0, additionalTax: 0, 
            estEarnings: 0, estExpenses: 0, helpCentre: 0 
        }, provincial: {
            personalExempt: 0, specialExempt: 0, additionalTax: 0, 
            estEarnings: 0, estExpenses: 0, helpCentre: 0
        }};
        ret.deductions = { CPP_QPP: {}, EI: {}, fedTax: {}, total: {} };
        ret.processor.code = data.shift();
        ret.processor.name = data.shift();
        ret.employer.code = data.shift();
        ret.employer.name = data.shift();
        ret.payPeriodEndDate = new Date(data.shift());
        ret.me.name.last = data.shift().replace(',', '');
        ret.me.name.first = data.shift();
        ret.me.serial = data.shift();
        ret.taxInformation.federal.personalExempt = Number.parseFloat(data.shift());
        ret.taxInformation.provincial.personalExempt = Number.parseFloat(data.shift());
        ret.depositeDate = new Date(data.shift());
        ret.profileSalary = Number.parseFloat(data.shift().replace(/,/g,''));
        ret.hourlyWage = Number.parseFloat(data.shift().replace(/,/g,''));
        ret.expenseAcc.accNum = data.shift().replace(/[aA-zZ\.]/g, '').concat(data.shift());
        ret.expenseAcc.charge = Number.parseFloat(data.shift().replace(/,/g,''));
        ret.taxInformation.federal.helpCentre 
            = ret.taxInformation.provincial.helpCentre 
            = data.shift().replace(/[aA-zZ\:]/g, '');
        ret.vacationPay.current = Number.parseFloat(data.shift().replace(/,/g,''));
        ret.vacationPay.YTD = Number.parseFloat(data.shift().replace(/,/g,''));
        ret.totalPay.current = Number.parseFloat(data.shift().replace(/,/g,''));
        ret.totalPay.YTD = Number.parseFloat(data.shift().replace(/,/g, ''));
        ret.deductions.CPP_QPP.current = Number.parseFloat(data.shift().replace(/,/g, ''));
        ret.deductions.CPP_QPP.YTD = Number.parseFloat(data.shift().replace(/,/g, ''));
        ret.deductions.EI.current = Number.parseFloat(data.shift().replace(/,/g, ''));
        ret.deductions.EI.YTD = Number.parseFloat(data.shift().replace(/,/g, ''));
        ret.deductions.fedTax.current = Number.parseFloat(data.shift().replace(/,/g, ''));
        ret.deductions.fedTax.YTD = Number.parseFloat(data.shift().replace(/,/g, ''));
        ret.deductions.total.current = Number.parseFloat(data.shift().replace(/,/g, ''));
        ret.deductions.total.YTD = Number.parseFloat(data.shift().replace(/,/g, ''));
        ret.netDeposit.current = Number.parseFloat(data.shift().replace(/,/g, ''));
        ret.netDeposit.YTD = Number.parseFloat(data.shift().replace(/,/g, ''));

        return ret; 
    }

    /**
     * Parses a pattern of regular pay entry found in the array
     * @param data The array to parse
     * @param i Starting index where you found the 'regular pay' pattern
     */
    private static parseRegularPay(data: Array<string>, i: number): wkWeek {
        let regular = /^REGULAR$/;
        let pay = /^PAY$/;
        let date = /^\d{2}\/\d{2}\/\d{2}$/;
        let payment = /^(\d{1,3}\,)*\d{1,3}\.\d{2,4}$/;
        let hours = /^\d{1,2}\.?\d{0,2}$/;
    
        let isRegPay = regular.test(data[i]) && pay.test(data[i + 1]);
        if (!isRegPay || i + 4 > data.length) return null;
    
        let myPay = {
            endingDate: null,
            hours: 0,
            current: 0,
            YTD: 0,
            startIndex: 0,
            endIndex: 0,
        }
    
        let almostIter = {values: ['current', 'YTD'], current: 0};
        let current = i + 2;
        let count = 0;
        let ele = data[current];
        while ((date.test(ele) || payment.test(ele) || hours.test(ele)) && count < 4) {
            let temp = ele;
            count++; current++;
            ele = data[current];
            if (date.test(temp)) {
                myPay.endingDate = new Date(temp);
            } else if (hours.test(temp)) {
                myPay.hours = Number.parseFloat(temp);
            } else if (payment.test(temp)) {
                myPay[almostIter.values[almostIter.current++]]
                    = Number.parseFloat(temp.replace(',', ''));
            }
        }
        myPay.startIndex = i;
        myPay.endIndex = i + count + 2;
        return myPay;
    }

    /**
     * Prints the values contained within a nested object.
     * @param obj The object to print. 
     */
    public static printNestedObj(obj: Object): void {
        for (let key in obj) {
            if (typeof obj[key] === 'object') {
                console.log(`${key}: {`);
                IBMStubParser.printNestedObj(obj[key]);
                console.log('}');
            } else {
                console.log(`${key}: ${obj[key]}`);
            }
        }
    }
}

export const testSample: string = `Statement of Earnings and Deductions
IBM CANADA
For more information regarding the format or content of your pay statement,
please visit our web site http://w3-01.ibm.com/hr/web/ca/payroll/







01    CERIDIAN                        PAY STATEMENT                                                  
0202 IBM CDA LTD (PERSONAL)           PAY PERIOD END DATE - 05/22/20                                  
NAME    :      BENABOU, ETHAN                           SERIAL # :     0B1815                        
ADDRESS :          /0T4I/ 37A/ OTT                                                                    
                                                       |---------------------------------------------
                                                       |                                              
                                                       | TAX INFORMATION     FEDERAL       PROV      
                         *PERSONAL*                    |                                              
                                                       |                                              
                                                       | PERSONAL EXEMPT       12298      10783      
DEPOSIT DATE                                 05/29/20  | SPECIAL EXEMPT                              
PROFILE SALARY                                 938.40  | ADDITIONAL TAX                              
BI-WEEKLY GROSS/HOURLY RATE                   23.4600  | EST. EARNINGS                                
                                                       | EST. EXPENSES                                
EARNINGS ACCT.00447681 6376133      AMOUNT    1521.40  | HELP CENTRE:1-866-214-0977                  
EXPENSE ACCT. 00447681 6376133      AMOUNT        .    |                                              

-----------------------------------------------------------------------------------------------------

PAYMENTS                  WEEK ENDING       HOURS        CURRENT          YTD                        
REGULAR PAY                05/15/20           40.00        938.40                                    
REGULAR PAY                05/22/20           40.00        938.40      2,815.20                      
VAC.PAY - SUPPS                                             75.07        112.61                      
*TOTAL PAYMENTS                                          1,951.87      2,927.81                      

DEDUCTIONS                                               CURRENT          YTD                        
CPP/QPP DED                                                 95.41        139.58                      
EI DED                                                      30.84         46.26                      
FEDERAL TAX                                                304.22        400.41                      
*TOTAL DED'NS                                              430.47        586.25                      

NET DEPOSIT                                              1,521.40      2,341.56                      



Total Net Payment will be posted to your financial institution account on the  
designated deposit date.

    DO NOT REPLY OR FORWARD NOTES TO THE ID THAT TRANSMITTED THIS STATEMENT`
