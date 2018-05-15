function getSpreadsheetUrl()
{
  
  var url = "https://docs.google.com/spreadsheets/d/";
  var propLiveDataSpreadsheetID = PropertiesService.getScriptProperties().getProperty("propLiveDataSpreadsheetID");
  
  url += propLiveDataSpreadsheetID;
  url += "/edit?";
  return url;
}

function openSpreadsheet()
{
  var url = getSpreadsheetUrl();
  _log("Opening " + url);
  var ss=SpreadsheetApp.openByUrl(url);
  return ss;
}

function getSheet(name)
{
  var ss = openSpreadsheet();
  var sheet = ss.getSheetByName(name);
  return sheet
}
