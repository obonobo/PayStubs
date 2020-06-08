import express, { Router } from 'express';
import { configure, getLogger, Logger } from 'log4js';
import mongoose from 'mongoose';

import { appConfig, dbConfig } from './config';
import exampleData from './extra/ExamplePaystub';
import { hookShutdown } from './nodehooks';
import { PayStubSchema } from './schemas/PayStubschema';
import { StubParser } from './StubParser';

// Logger information
configure('./config/log4js.json');
const myLogger: Logger = getLogger();
myLogger.level = dbConfig.logLevel;

// Register some hooks on the node process
hookShutdown(process, mongoose, myLogger);

/**
 * Saves to the database
 */
const saveReq = function(): void {
    // Testing db connection
    myLogger.info('Attempting Database Connection...');

    // Grab a database connection
    mongoose.connect(dbConfig.db_URL, dbConfig.connectionOpts)
        .then(() => myLogger.info('Connection Successful!'))
        .catch(err => {
            myLogger.error(`Could not connect: ${err}`);
            process.exit(1);
        }).then(() => {
            myLogger.info('Attempting to save your data...');
        });

    // Make a new document
    let PayStub = mongoose.model('PayStub', PayStubSchema);
    let payStub = new PayStub(exampleData);

    payStub.save()
        .then(val => myLogger.info(`Document saved! It's ID is: ${val._id}`))
        .catch(err => {
            myLogger.error(`Failed to save document: ${err}`);
            process.exit(1);
        });
}

// TODO ==================== EXPRESS ==========================
// App information
const app = express();

// This tells express to use a middleware for
// parsing the requests 
app.use(express.json());

// Test route 
app.get('/', function (req, res) {
    res.send('Hello, World!');
});

// This route handles paystub 
app.post('/paystub', function(req, res) {
    myLogger.info(`A paystub request of type: "${req.get('Content-Type')}" has been received:\n`);
    myLogger.info(`It was sent from address: ${req.ip}`);
    myLogger.info(`Here is the paystub data:\n${req.body.stub}`);
    
    res.json(req.body);
});

app.listen(appConfig.listenPort, err => {
    if (err) {
        myLogger.error(`Something went wrong while listening: ${err}`);
        throw err;
    }

    myLogger.info(`PayStubs listening @ http://${appConfig.hostIP}:${appConfig.listenPort}`);
});


// TODO ==================== TEST ==========================
const testAxios = function () {
    const axios = require('axios');
    const headers = { 'Content-Type': 'application/json' }
    const res = axios.post('http://localhost:3000/paystub', {
      stub: `<div class="socmaildefaultfont" dir="ltr" style="font-family:Arial, Helvetica, sans-serif;font-size:10pt" ><div dir="ltr" >&nbsp;</div>
      <div dir="ltr" >&nbsp;</div>
      <blockquote data-history-expanded="1" dir="ltr" style="border-left:solid #aaaaaa 2px; margin-left:5px; padding-left:5px; direction:ltr; margin-right:0px" >----- Original message -----<br>From: e-Paystub Distribution<br>Sent by: NA UnrAgentmgr/Poughkeepsie/IBM<br>To: Ethan Benabou/Canada/IBM@IBM<br>Cc:<br>Subject: *IBM Confidential: IBM Canada e-Paystub - 2020-05-29<br>Date: Thu, May 28, 2020 9:27 AM<br>&nbsp;<br>&nbsp;
      <div align="center" ><table border="1" >        <tbody>                <tr valign="top" >                        <td width="107" bgcolor="#000000" >                        <div align="center" ><font size="5" face="IBMLogo" color="#0000FF" >IBM</font></div>                        </td>                        <td width="536" bgcolor="#008080" >                        <div align="center" ><tt><font size="3" face="" color="#FFFFFF" >Canada Payroll Services</font></tt></div>                        </td>                </tr>        </tbody></table></div>
      <div align="center" ><br><br><tt><font size="3" face="" >Statement of Earnings and Deductions </font></tt><br><tt><font size="3" face="" >IBM CANADA</font></tt><br><tt><font size="3" face="" >For more information regarding the format or content of your pay statement,</font></tt><br><tt><font size="3" face="" >please visit our web site </font></tt><tt><font size="3" face="" ><a href="http://w3-01.ibm.com/hr/web/ca/payroll" target="_blank" >http://w3-01.ibm.com/hr/web/ca/payroll</a>/</font></tt></div><br><br><br><br><br><br><br><tt><font size="3" face="" >01 &nbsp; &nbsp;CERIDIAN &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;PAY STATEMENT &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><tt><font size="3" face="" >0202 IBM CDA LTD (PERSONAL) &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; PAY PERIOD END DATE - 05/22/20 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</font></tt><br><tt><font size="3" face="" >NAME &nbsp; &nbsp;: &nbsp; &nbsp; &nbsp;BENABOU, ETHAN &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; SERIAL # : &nbsp; &nbsp; 0B1815 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><tt><font size="3" face="" >ADDRESS : &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;/0T4I/ 37A/ OTT &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</font></tt><br><tt><font size="3" face="" >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;|--------------------------------------------- </font></tt><br><tt><font size="3" face="" >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</font></tt><br><tt><font size="3" face="" >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;| TAX INFORMATION &nbsp; &nbsp; FEDERAL &nbsp; &nbsp; &nbsp; PROV &nbsp; &nbsp; &nbsp; </font></tt><br><tt><font size="3" face="" >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;*PERSONAL* &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</font></tt><br><tt><font size="3" face="" >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</font></tt><br><tt><font size="3" face="" >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;| PERSONAL EXEMPT &nbsp; &nbsp; &nbsp; 12298 &nbsp; &nbsp; &nbsp;10783 &nbsp; &nbsp; &nbsp; </font></tt><br><tt><font size="3" face="" >DEPOSIT DATE &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 05/29/20 &nbsp;| SPECIAL EXEMPT &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><tt><font size="3" face="" >PROFILE SALARY &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 938.40 &nbsp;| ADDITIONAL TAX &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><tt><font size="3" face="" >BI-WEEKLY GROSS/HOURLY RATE &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 23.4600 &nbsp;| EST. EARNINGS &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</font></tt><br><tt><font size="3" face="" >&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;| EST. EXPENSES &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</font></tt><br><tt><font size="3" face="" >EARNINGS ACCT.00447681 6376133 &nbsp; &nbsp; &nbsp;AMOUNT &nbsp; &nbsp;1521.40 &nbsp;| HELP CENTRE:1-866-214-0977 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><tt><font size="3" face="" >EXPENSE ACCT. 00447681 6376133 &nbsp; &nbsp; &nbsp;AMOUNT &nbsp; &nbsp; &nbsp; &nbsp;. &nbsp; &nbsp;| &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;</font></tt><br><br><tt><font size="3" face="" >----------------------------------------------------------------------------------------------------- </font></tt><br><br><tt><font size="3" face="" >PAYMENTS &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;WEEK ENDING &nbsp; &nbsp; &nbsp; HOURS &nbsp; &nbsp; &nbsp; &nbsp;CURRENT &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;YTD &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><tt><font size="3" face="" >REGULAR PAY &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;05/15/20 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 40.00 &nbsp; &nbsp; &nbsp; &nbsp;938.40 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><tt><font size="3" face="" >REGULAR PAY &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;05/22/20 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 40.00 &nbsp; &nbsp; &nbsp; &nbsp;938.40 &nbsp; &nbsp; &nbsp;2,815.20 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><tt><font size="3" face="" >VAC.PAY - SUPPS &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 75.07 &nbsp; &nbsp; &nbsp; &nbsp;112.61 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><tt><font size="3" face="" >*TOTAL PAYMENTS &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1,951.87 &nbsp; &nbsp; &nbsp;2,927.81 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><br><tt><font size="3" face="" >DEDUCTIONS &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; CURRENT &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;YTD &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><tt><font size="3" face="" >CPP/QPP DED &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; 95.41 &nbsp; &nbsp; &nbsp; &nbsp;139.58 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><tt><font size="3" face="" >EI DED &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;30.84 &nbsp; &nbsp; &nbsp; &nbsp; 46.26 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><tt><font size="3" face="" >FEDERAL TAX &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;304.22 &nbsp; &nbsp; &nbsp; &nbsp;400.41 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><tt><font size="3" face="" >*TOTAL DED'NS &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;430.47 &nbsp; &nbsp; &nbsp; &nbsp;586.25 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><br><tt><font size="3" face="" >NET DEPOSIT &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;1,521.40 &nbsp; &nbsp; &nbsp;2,341.56 &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; </font></tt><br><br><br><br><tt><font size="3" face="" >Total Net Payment will be posted to your financial institution account on the &nbsp; </font></tt><br><tt><font size="3" face="" >designated deposit date.</font></tt><br><br><tt><font size="3" face="" >&nbsp; &nbsp; DO NOT REPLY OR FORWARD NOTES TO THE ID THAT TRANSMITTED THIS STATEMENT</font></tt></blockquote>
      <div dir="ltr" >&nbsp;</div></div><BR>`
    }, { headers } ).then(val => {
        myLogger.info(`Here is your response: "${val.data.stub}".`);
    }).catch(err => {
        myLogger.error(`${err}`);
    });
}
// testAxios();
