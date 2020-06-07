// This is a "client" that sends paystubs to the web server component
// of this project. It is a script that is set to run every so often
// on a Gmail account. If it detects any inboxed emails tagged with
// "Paystub" label, then it performs some minor parsing/cleaning 
// of the email message body and sends it to the PayStub web server.
// 
// NOTE:  This is written in Apps Script, which is a Javascript-based
//        scripting platform for G suite apps like Gmail and Google Sheets

var label = GmailApp.getUserLabelByName("Paystub");
var labelProcessed = GmailApp.getUserLabelByName("Paystub-PROCESSED");

/**
 * @param paystub 
 */
function parsePayStub(paystub) {

}

/**
* A function to process emails with the label paystub
*/
function processPayStubs() {
  var threads = label.getThreads();
  for (var i = threads.length - 1; i >= 0; i--) {
    var message = threads[i].getMessages()[0];
    var htmlMessageBody = message.getBody();
    var plainMessageBody = message.getPlainBody();
    var rawMessageBody = message.getRawContent();
//  var parsedStub = parsePayStub(messageBody);
    

    // replaceLabel(threads[i]);
//    threads[i].reply(htmlMessageBody).refresh();
    threads[i].reply(htmlMessageBody).refresh();
  }
}

/**
 * 
 * @param thread 
 */
function replaceLabel(thread) {
  thread.removeLabel(label).addLabel(labelProcessed).refresh();
}
