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

function buildData(sheetname, specCase, properties)
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
    
    if (specCase) {
      /* This is a dirty solution
      Items can have any number of properties, which need to be handled
      The specCase flag is for this.
      If true, this is the Items, so we need to deal with the Props
      If false, this is not needed
      The caller has to take care of it
      
      row[5] is the number of Props and everything beyond is the index of the Props
      */
      var itemProps = [];
      
      for (var propIndex = 0; propIndex < row[5]; propIndex++) {
        itemProps.push(row[propIndex + 6]);
      }
      record["Props"] = itemProps;
    }
    
    data.push(record);

  }
  return data;
}

function buildDataSet()
{
  var dataSet = {};
  
  dataSet.Items = buildData("Items", 1);
  dataSet.Qtt = buildData("Qtt", 0);
  dataSet.Mes = buildData("Mes", 0);
  dataSet.Prop = buildData("Prop", 0);
    
  return dataSet;
}



