/**
 * A class that parses an IBM paystub. One-time use only.
 * Alternatively, you can use the static method.
 */
export class StubParser {

    private stub: string;
    private parsed: boolean;
    private delim: RegExp;
    private result: Object;

    public static DEFAULT_DELIM = / +/g;

    /**
     * Creates a new parser object.
     * @param stub The stub that you would like to parse
     */
    public constructor(stub: string) {
        this.stub = stub;
        this.parsed = false;
        this.result = null;
    }

    /**
     * Parse the string held inside me.
     * @returns An object with the parsed fields
     */
    public parse(): Object {
        this.parsed = true;
        return StubParser.ibmParse(this.stub, this.delim);
    }

    // Getters
    public isParsed() { return this.parsed; }
    public getStub() { return new String(this.stub) }
    public getParsed() { if (this.isParsed) return this.result }

    /**
     * Parses a paystub in the format of IBM's paystubs. 
     * @param stub Your plain text paystub (non-html)
     * @param delim Regex delimiter, default value is whitespace
     */
    public static ibmParse(stub: string, delim: RegExp = / +/ ): Object {
        let pieces = stub.split(delim); 
        
        

        return null;
    }
}
