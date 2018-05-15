function onError(e)
{
  onError2(e.fileName, e.lineNumber, e.message);
}

function onError2(fileName, lineNumber, message)
{
  Logger.log("Error in %s, line %s:%s", fileName, lineNumber, message);
  
  var propErrorSpreadsheetID = PropertiesService.getScriptProperties().getProperty("propErrorSpreadsheetID");
  var errorSheet = SpreadsheetApp.openById(propErrorSpreadsheetID).getSheetByName('Errors');
  
  lastRow = errorSheet.getLastRow();
  var cell = errorSheet.getRange('A1');
  cell.offset(lastRow, 0).setValue(message);
  cell.offset(lastRow, 1).setValue(fileName);
  cell.offset(lastRow, 2).setValue(lineNumber);
}
