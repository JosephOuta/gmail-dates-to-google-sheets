// This Google Script searchs on your Gmail account, and store the results on a Google Sheet file

var AVOID_REPEATED_ADDRESS = true; // gets each email address just once on sheet if set to true

// Main function, the one that you must select before run

function pullDates() {

  // Select active spreadsheet
  // console.log("Clearing sheet...");
  // var sheet = SpreadsheetApp.getActive();
  
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheets()[1];

  // Add Sheet header columns ✏️ i.e. adds 'Contact_Date' column to right of 'email' column
  sheet.insertColumnsBefore(5, 1);
  var newcol = sheet.getRange("E1");
  var lastRow = sheet.getLastRow();
  newcol.setValue("Contact_Date");
  var SEARCH_QUERY = sheet.getRange(2, 4, lastRow-1).getValues(); 
    
  for (let i = 0; i < SEARCH_QUERY.length; i++) {
    var email = SEARCH_QUERY[i]; 

    console.log(`Searching for: "${email}"`);
    var start = 0;
    var max = 500;
    
    var threads = GmailApp.search(email, start, max);
    if (threads!=null){
      console.log("Threads found 🎉");
      console.log("Collecting last date contacted...");
    } else {
      console.warn("No emails found within search criteria 😢");
      return;
    }
    
    var totalEmails = 0;
    var contact_date = [];
    var addresses = [];

    var thread = threads[0];
    var data = thread.getLastMessageDate(); //this may be redundant, check
    var msgs = threads[0].getMessages(); // formerely var msgs = threads[0].getMessages();
    var msg = msgs[0]

    // Values to get and store ✏️
    var data = msg.getDate();          
    var to = msg.getTo();
    var last_date_contacted = [data]; // formerely said: var dataLine = [data,from,to];

    // Add values to array --> may be redundant also, check
    if (!AVOID_REPEATED_ADDRESS || (AVOID_REPEATED_ADDRESS && !addresses.includes(to))){
      contact_date.push(last_date_contacted);
      addresses.push(to);
    }
      
        // Add Dates to sheet
    var row = i + 2
    var destination_col = sheet.getRange(row, 5);
    destination_col.setValues(contact_date);

    }
    
    //fix this: not doing anything at the moment
    totalEmails = totalEmails + SEARCH_QUERY.length;
    console.info(totalEmails + " dates added to sheet 🎉");
  

  var spreadsheet = SpreadsheetApp.getActive();
  spreadsheet.getRange('E:E').activate();
  var conditionalFormatRules = spreadsheet.getActiveSheet().getConditionalFormatRules();
  conditionalFormatRules.push(SpreadsheetApp.newConditionalFormatRule()
  .setRanges([spreadsheet.getRange('E1:E373')])
  .whenCellNotEmpty()
  .setBackground('#B7E1CD')
  .build());
  spreadsheet.getActiveSheet().setConditionalFormatRules(conditionalFormatRules);
  
  conditionalFormatRules = spreadsheet.getActiveSheet().getConditionalFormatRules();
  conditionalFormatRules.splice(conditionalFormatRules.length - 1, 1, SpreadsheetApp.newConditionalFormatRule()
  .setRanges([spreadsheet.getRange('E:E')])
  .whenFormulaSatisfied('=and(E1<=today(),E1>(today()-30))')
  .setBackground('#B7E1CD')
  .build());
  spreadsheet.getActiveSheet().setConditionalFormatRules(conditionalFormatRules);
  conditionalFormatRules = spreadsheet.getActiveSheet().getConditionalFormatRules();
  conditionalFormatRules.push(SpreadsheetApp.newConditionalFormatRule()
  .setRanges([spreadsheet.getRange('E:E')])
  .whenCellNotEmpty()
  .setBackground('#B7E1CD')
  .build());
  spreadsheet.getActiveSheet().setConditionalFormatRules(conditionalFormatRules);
  conditionalFormatRules = spreadsheet.getActiveSheet().getConditionalFormatRules();
  conditionalFormatRules.splice(conditionalFormatRules.length - 1, 1, SpreadsheetApp.newConditionalFormatRule()
  .setRanges([spreadsheet.getRange('E:E')])
  .whenDateEqualTo(SpreadsheetApp.RelativeDate.TODAY)
  .setBackground('#B7E1CD')
  .build());
  spreadsheet.getActiveSheet().setConditionalFormatRules(conditionalFormatRules);

};


// Original: https://github.com/TiagoGouvea/gmail-to-google-sheets-script/
