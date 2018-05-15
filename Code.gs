function doGet(e) {
  
  try {
    /*
    **
    ** Developer mode has a different script ID and URL than the normal one
    ** 
    ** Published script 
    **
    */
    var _developerMode_ = true;
    
    /* what to do
    **
    ** The action can be one of these: 'insert', 'update', 'read', 'delete'
    ** test action is strictly for testing purposes
    **
    */
    var op = e.parameter.action;
    var url = "https://docs.google.com/spreadsheets/d/";
    var propLiveDataSpreadsheetID = PropertiesService.getScriptProperties().getProperty("propLiveDataSpreadsheetID");
    
    url += propLiveDataSpreadsheetID;
    url += "/edit?";
    
    var ss=SpreadsheetApp.openByUrl(url);
    var sheet = ss.getSheetByName("Sheet2");
    
    if (op) {
      
      if(op == "insert") {
        Logger.log("Insert");
        return insert_value(e,sheet);
      }
      
      if(op == "read") {
        Logger.log("Read");
        return read_value(e,ss);
      }
      
      if(op == "update") {
        Logger.log("Update");
        return update_value(e,sheet);
      }
      
      if(op == "delete") {
        Logger.log("Delete");
        return delete_value(e,sheet);
      }
      
      if (op == 'test') {
        Logger.log("Test");
        return test(sheet);
      }
      
    } else {
      
      // There is no op/action, so render the entire HTML page
      
      onError2("This file", 0, "There is no op/action, so render the entire HTML page");
      
      var template = HtmlService.createTemplateFromFile("App");
      
      var propScriptID = "";
      
      if (_developerMode_) {
        /*
        In develope mode there is a different URL and script ID
        */
        propScriptID = PropertiesService.getScriptProperties().getProperty("propDevScriptID");
        template.scriptUrl = "https://script.google.com/macros/s/" + propScriptID + "/dev";
      } else {
        /*
        In normale mode there is a different URL and script ID
        */
        propScriptID = PropertiesService.getScriptProperties().getProperty("propLiveScriptID");
        template.scriptUrl = "https://script.google.com/macros/s/" + propScriptID + "/exec";
      }
      template.developerMode = _developerMode_;
      
      var html = template.evaluate();
      return html;
    }
  } catch(e) {
    onError(e);
  }
}

function test(sheet)
{
  var id = 100;
  var value = "Automatic test value";
  
  var d = new Date();
  var currentTime = d.toLocaleString();
  var rowData = sheet.appendRow([currentTime,id,value]);  
  var result="Insertion successful de miert?";
  
  result = JSON.stringify({
    "result": result
  });  

  return ContentService.createTextOutput(result).setMimeType(ContentService.MimeType.TEXT);
}

function insert_value(request,sheet){
 
 
   var id = request.parameter.id;
  var country = request.parameter.name;
  
  var flag=1;
  var lr= sheet.getLastRow();
  for(var i=1;i<=lr;i++){
    var id1 = sheet.getRange(i, 2).getValue();
    if(id1==id){
      flag=0;
  var result="Id already exist!";
    } }
  //add new row with recieved parameter from client
  if(flag==1){
  var d = new Date();
    var currentTime = d.toLocaleString();
  var rowData = sheet.appendRow([currentTime,id,country]);  
  var result="Insertion successful";
  }
     result = JSON.stringify({
    "result": result
  });  
    
  return ContentService
  .createTextOutput(request.parameter.callback + "(" + result + ")")
  .setMimeType(ContentService.MimeType.JAVASCRIPT);   
  }
  
  
function readValues()
{
  Logger.log("readValues");
  
  var output  = ContentService.createTextOutput();
  
  try {
  
    var url = "https://docs.google.com/spreadsheets/d/";
    var propLiveDataSpreadsheetID = PropertiesService.getScriptProperties().getProperty("propLiveDataSpreadsheetID");
    
    url += propLiveDataSpreadsheetID;
    url += "/edit?";
    
    var ss=SpreadsheetApp.openByUrl(url);
    
    var data    = {};
    var sheet="sheet2";
    
    data.records = readData_(ss, sheet);
    
    output.setContent(JSON.stringify(data));
    output.setMimeType(ContentService.MimeType.JSON);
    
    Logger.log("readValues complete");
    Logger.log(data);
  
   } catch(e) {
    output.setContent("ERROR");
    
    output.setMimeType(ContentService.MimeType.TEXT);
    
    onError(e);
  }
  
  return data;
}


function read_value(request,ss){
  
 
  var output  = ContentService.createTextOutput(),
      data    = {};
      var sheet="sheet2";

  data.records = readData_(ss, sheet);
  
  var callback = request.parameters.callback;
  
  if (callback === undefined) {
    output.setContent(JSON.stringify(data));
  } else {
    output.setContent(callback + "(" + JSON.stringify(data) + ")");
  }
  output.setMimeType(ContentService.MimeType.JAVASCRIPT);
  
  return output;
}


function readData_(ss, sheetname, properties) {

  if (typeof properties == "undefined") {
    properties = getHeaderRow_(ss, sheetname);
    properties = properties.map(function(p) { return p.replace(/\s+/g, '_'); });
  }
  
  var rows = getDataRows_(ss, sheetname),
      data = [];

  for (var r = 0, l = rows.length; r < l; r++) {
    var row     = rows[r],
        record  = {};

    for (var p in properties) {
      record[properties[p]] = row[p];
    }
    
    data.push(record);

  }
  return data;
}



function getDataRows_(ss, sheetname) {
  var sh = ss.getSheetByName(sheetname);

  return sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
}


function getHeaderRow_(ss, sheetname) {
  var sh = ss.getSheetByName(sheetname);

  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];  
} 
  

//update function

function update_value(request,sheet){

var output  = ContentService.createTextOutput();
   var id = request.parameter.id;
  var flag=0;
  var country = request.parameter.name;
  var lr= sheet.getLastRow();
  for(var i=1;i<=lr;i++){
    var rid = sheet.getRange(i, 2).getValue();
    if(rid==id){
      sheet.getRange(i,3).setValue(country);
      var result="value updated successfully";
      flag=1;
    }
}
  if(flag==0)
    var result="id not found";
  
   result = JSON.stringify({
    "result": result
  });  
    
  return ContentService
  .createTextOutput(request.parameter.callback + "(" + result + ")")
  .setMimeType(ContentService.MimeType.JAVASCRIPT);   
  
  
}


  

function delete_value(request,sheet){
  
  var output  = ContentService.createTextOutput();
   var id = request.parameter.id;
  var country = request.parameter.name;
  var flag=0;

  
  
  var lr= sheet.getLastRow();
  for(var i=1;i<=lr;i++){
    var rid = sheet.getRange(i, 2).getValue();
    if(rid==id){
      sheet.deleteRow(i);
      var result="value deleted successfully";
      flag=1;
    }
    
  }

  if(flag==0)
    var result="id not found";
  
  
 
   result = JSON.stringify({
    "result": result
  });  
    
  return ContentService
  .createTextOutput(request.parameter.callback + "(" + result + ")")
  .setMimeType(ContentService.MimeType.JAVASCRIPT);   
  


}
