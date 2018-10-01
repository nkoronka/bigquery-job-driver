function testGetRows(){
  var sql = "SELECT * FROM `greyhound-1336.105290899.reporting_prototype_partitioned_*`";
  var bigQuery = new BQ();
  var data = bigQuery.getRows(sql, true);
  Logger.log(data);
}



// Responsible for taking GBQ sql query and returning well formatted data

// constructor
function BQ() {
}

BQ.prototype.getRows = function(sql, returnHeader){
  var projectId = "411917840025"; // from Google Developers Console

  var request = {
    query: sql,
    useLegacySql: false,
    useQueryCache: false
  };  
  
  var queryResults = BigQuery.Jobs.query(request, projectId);
  var jobId = queryResults.jobReference.jobId;

  var queryStart = new Date().getTime();

  // wait for job complete flag
  var sleepTimeMs = 500;
  while (!queryResults.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId);
  }
  
  var queryFinish = new Date().getTime();
  var queryLengthMins = (queryFinish - queryStart)/60000;
  var rows = queryResults.rows;
  
  // gather together results in case of multiple pages
  while (queryResults.pageToken) {
    queryResults = BigQuery.Jobs.getQueryResults(projectId, jobId, {
      pageToken: queryResults.pageToken
    });
    rows = rows.concat(queryResults.rows);
  }
  
  if(rows){ // rows will be json array if query worked
    var headers = queryResults.schema.fields.map(function(field) {
      return field.name;
    });
    var jsArray = this._bigQueryToArray([headers, rows], returnHeader);
    return jsArray;
  } else {
    return false;
  }
}

BQ.prototype.runJob = function(sql, projectId, datasetId, tableId, writeDisposition, createDisposition){
  var configuration = {
    "query": {
      "useQueryCache": false,
      "destinationTable": {
        "projectId": projectId,
        "datasetId": datasetId,
        "tableId": tableId
      },
      "writeDisposition": writeDisposition, 
      "createDisposition": createDisposition,
      "allowLargeResults": true,
      "useLegacySql": false,
      "query": sql
    }
  };
   
  var job = {
      "configuration": configuration
  };
   
  var jobResult = BigQuery.Jobs.insert(job, projectId);
  var jobId = jobResult.jobReference.jobId;
  
  // wait for job complete flag
  var sleepTimeMs = 500;
  while (!jobResult.jobComplete) {
    Utilities.sleep(sleepTimeMs);
    sleepTimeMs *= 2;
    jobResult = BigQuery.Jobs.getQueryResults(projectId, jobId);
  }
  
  if(jobResult.jobComplete){
    return true;
  } else {
    return false;
  }
}


BQ.prototype._bigQueryToArray = function(data, returnHeader){
  // converts the non-tabular array format handed back by GBQ into conventional table array  
  /*
  e.g data returned:
  [
    [Medium, Revenue], 
    [
      {f=[{v=referral}, {v=896460.65}]}, 
      {f=[{v=cpc}, {v=502093.69}]}, 
      {f=[{v=organic}, {v=490287.64}]}, 
      {f=[{v=(none)}, {v=421252.48}]}, 
      {f=[{v=email}, {v=75232.62}]}, 
      {f=[{v=cpm}, {v=4480.8}]}, 
      {f=[{v=webbutton}, {v=929.25}]}, 
      {f=[{v=(not set)}, {v=15.4}]}
     ]
   ]
  */
  
  var headers = data[0];
  var rows = data[1];  
  var flat_array = new Array(rows.length); 
  // cycle through rows
  for (var i = 0; i < rows.length; i++) {
    var cols = rows[i].f;

    flat_array[i] = new Array(cols.length);
    // cycle through columns
    for (var j = 0; j < cols.length; j++) {
      // set v columns returned from f - GBQ API returns unexpected array structure - {"f":[{"v":"P1709"},{"v":"44587"},{"v":"139166"},{"v":"3380"},{"v":"154909.45"}]},{"f":[{"v":"P1710"},{"v":"44927"},{"v":"153822"},{"v":"4471"},{"v":"222657.95"}]}
      individual_column_of_f = cols[j].v;
      flat_array[i][j] = cols[j].v;
    }
  }
  
  if(returnHeader){
    flat_array.unshift(headers);
  }
  
  return flat_array;
}