function getHeaderRow(sheetName)
{
  var sh = getSheet(sheetName);

  return sh.getRange(1, 1, 1, sh.getLastColumn()).getValues()[0];  
}

function getDataRows(sheetname)
{
  var sh = getSheet(sheetname);

  return sh.getRange(2, 1, sh.getLastRow() - 1, sh.getLastColumn()).getValues();
}

function buildData(sheetname, properties)
{
  if (typeof properties == "undefined") {
    properties = getHeaderRow(sheetname);
    properties = properties.map(function(p) { return p.replace(/\s+/g, '_'); });
  }
  
  var rows = getDataRows(sheetname);
  var data = [];

  for (var r = 0, l = rows.length; r < l; r++) {
    
    var row     = rows[r];
    var record  = {};

    for (var p in properties) {
      record[properties[p]] = row[p];
    }
    
    data.push(record);

  }
  return data;
}

function buildDataSet()
{
  var dataSet = {};
  
  dataSet.Items = buildData("Items");
  dataSet.Qtt = buildData("Qtt");
  dataSet.Mes = buildData("Mes");
  dataSet.Prop = buildData("Prop");
    
  return dataSet;
}



