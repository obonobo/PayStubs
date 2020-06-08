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
export class StubParser {

    private stub: string
    private parsed: boolean
    private delim: RegExp
    private result: Object
    private parserFunction: ParsingFunction

    public static regular = /^REGULAR$/;
    public static pay = /^PAY$/;
    public static date = /^\d{2}\/\d{2}\/\d{2}$/;
    public static payment = /^(\d{1,3}\,)*\d{1,3}\.\d{2,4}$/;
    public static hours = /^\d{1,2}\.?\d{0,2}$/;

    /**
     * An example of the layout require for the data
     */
    private templateData = {
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
    }

    /**
     * Creates a new parser object.
     * @param stub The stub that you would like to parse
     */
    public constructor(stub: string, parserFunction = StubParser.defaultParserFunction) {
        this.stub = stub;
        this.parsed = false;
        this.result = null;
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
    public getParsed() { if (this.isParsed) return this.result }

    /**
     * The default parsing function of a stub parser
     * @param stub 
     */
    private defaultParserFunction(stub: string) {
        let data = stub.replace(/(\n|\r)+/g, ' ').split(/ +/);
        // Remove the excess up to the 'regular pay' section
        data.splice(0, 25); data.splice(2, 2);  data.splice(4, 8);
        data.splice(5, 2);  data.splice(7, 3);  data.splice(8, 18);
        data.splice(10, 2); data.splice(11, 5); data.splice(12, 6);
        data.splice(13, 7); data.splice(15, 1); data.splice(16, 2);
        data.splice(17, 14);
    
        // Extract the set of regular pay weeks
        let workWeeks: Array<wkWeek> = [];
        let count = 0;
        while (StubParser.regular.test(data[17])) {
            workWeeks[count] = StubParser.parseRegularPay(data, 17);
            data.splice(workWeeks[count].startIndex, 
                        workWeeks[count].endIndex - workWeeks[count].startIndex);
            count++;
        }
        
        // Remove the rest of the excess
        data.splice(17, 3); data.splice(19, 2); data.splice(21, 5);
        data.splice(23, 2); data.splice(25, 2); data.splice(27, 2);
        data.splice(29, 2); data.splice(31, data.length - 31); 
    
        let t = this.templateData;

        t.

        // Start building our return value
        return this.templateData; 
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
            // console.log(temp);
            count++; current++;
            ele = data[current];
            if (date.test(temp)) {
                // console.log('MATCHED DATE');
                myPay.endingDate = new Date(temp);
            } else if (hours.test(temp)) {
                // console.log('MATCHED HOURS');
                
                myPay.hours = Number.parseFloat(temp);
            } else if (payment.test(temp)) {
                // console.log('MATCHED PAYMENT');
                
                myPay[almostIter.values[almostIter.current++]]
                    = Number.parseFloat(temp.replace(',', ''));
            }
        }
        myPay.startIndex = i;
        myPay.endIndex = i + count + 2;
        return myPay;
    }
}
