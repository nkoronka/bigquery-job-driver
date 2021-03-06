/* Responsible for determining whether a job needs actioning at a
   given moment in time. Considers data availability, whether data
   has already been processed and whether a report has already run etc.
*/


// constructor
function Scheduler(storage){
  this.storageRef = storage;
}


// determine if item needs actioning
Scheduler.prototype.shouldAction = function(actionItem){
  var itemProcessed = this._checkActionItemProcessed(actionItem);
  // check whether item is already processed
  if(!itemProcessed || !actionItem.debugArray['itemProcessed']){
    var dataAvailable = this._checkDataAvailable(actionItem);
    if(dataAvailable || actionItem.debugArray['dataAvailable']){
      var partitionNotPresent = this._checkPartitionNotPresent(actionItem);
      if(partitionNotPresent || actionItem.debugArray['partitionNotPresent']){
        Logger.log("Scheduler returned true: data available and partitionNotPresent");
        return [true, this._getYesterdayDate(actionItem)];
      } else {
        Logger.log("Scheduler returned false: data available and partition already present");
        return [false, 'partition_already_present'];
      }
    } else {
      Logger.log("Scheduler returned false: data not yet available");
      return [false, 'no_data']; // data not yet available
    }
  } else {
    Logger.log("Scheduler returned false: item already processed");
    return [false, 'item_already_processed']; // item already processed
  }
}


// Updates storage detailing whether report has already run
Scheduler.prototype.updateLastRan = function(actionItem){
  this.storageRef.save(actionItem.id+"_processed_today", true);
  Logger.log("Updated last ran date in storage");
}


// Return all reports to 'outstanding' status
Scheduler.prototype.setReportsToOutstanding = function(){
  var actionItemsConfig = returnConfig();

  var storage = new Storage();
  for(var i = 0; i < actionItemsConfig.length; i++) {
    storage.save(actionItemsConfig[i].id+"_processed_today", false);
  }
  Logger.log("Reports set to outstanding");
};


Scheduler.prototype._checkActionItemProcessed = function (actionItem){
  var storage = new Storage();
  if(actionItem.debugArray['itemProcessed'] !== 'undefined' && actionItem.debugArray['itemProcessed'] != null){
    Logger.log("Overriding alreadyProcessed flag in storage set to: " + actionItem.debugArray['itemProcessed']);
    return actionItem.debugArray['itemProcessed'];
  } else {
    Logger.log("Storage returned " + actionItem.id+"_processed_today:"+ storage.load(actionItem.id+"_processed_today"));
    return storage.load(actionItem.id+"_processed_today");
  }
}


Scheduler.prototype._checkDataAvailable = function (actionItem){
  if(actionItem.debugArray['dataAvailable'] !== 'undefined' && actionItem.debugArray['dataAvailable'] != null){
    Logger.log("Data available flag overwritten to :" + actionItem.debugArray['dataAvailable']);
    return actionItem.debugArray['dataAvailable'];
  } else {
    var bigQuery = new BQ();
    var sql = "SELECT * FROM `" + actionItem.bigquery.source_project + "." + actionItem.bigquery.source_dataset + ".__TABLES_SUMMARY__` WHERE table_id = '" + actionItem.bigquery.source_table + "_" + this._getYesterdayDate(actionItem)+ "'";
    var rows = bigQuery.getRows(sql, false);
    if(rows == false){
      Logger.log("Data available check returns: false");
      return false;
    } else {
      Logger.log("Data available check returns: true");
      return true;
    }
  }
}


Scheduler.prototype._checkPartitionNotPresent = function (actionItem){
  var bigQuery = new BQ();
  var sql = "SELECT * FROM `" + actionItem.bigquery.destination_project + "." + actionItem.bigquery.destination_dataset + ".__TABLES_SUMMARY__` WHERE table_id = '" + actionItem.bigquery.destination_table_id + "_" + this._getYesterdayDate(actionItem)+ "'";
  var rows = bigQuery.getRows(sql, false);
  if(rows == false){
    Logger.log("Check partition not present returns: true");
    return true;
  } else {
    Logger.log("Check partition not present returns: false");
    return false;
  }
}


Scheduler.prototype._getCurrentDate = function(actionItem){
  var year = pad((new Date()).getFullYear().toString());
  var month = pad(parseInt((new Date()).getMonth().toString()) + 1);
  var date = pad((new Date()).getDate().toString());
  Logger.log("Get current date returns :" + year+month+date);
  return year+month+date;
}


Scheduler.prototype._getYesterdayDate = function(actionItem){
  var yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate()-1);
  var year = pad((yesterdayDate).getFullYear().toString());
  var month = pad(parseInt((yesterdayDate).getMonth().toString()) + 1);
  var date = pad(yesterdayDate.getDate().toString());
  if(actionItem.debugArray['yesterdayDate']['overrideYesterdayDate']){
    Logger.log("Overriding yesterdayDate = "+ actionItem.debugArray['yesterdayDate']['date']);
    return actionItem.debugArray['yesterdayDate']['date'];
  } else {
    Logger.log("Get yesterday date returns :" + year+month+date);
    return year+month+date;
  }
}
