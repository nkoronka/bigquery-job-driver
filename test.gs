function testYesterdayDateCode(){
  var yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate()-1);
  var year = pad((yesterdayDate).getFullYear().toString());
  var month = pad(parseInt((yesterdayDate).getMonth().toString()) + 1);  
  var date = pad(yesterdayDate.getDate().toString());
  
  x = 1 + 2;
  
/*  
  if(actionItem.debugArray['yesterdayDate']['overrideYesterdayDate']){
    Logger.log("Overriding yesterdayDate = "+ actionItem.debugArray['yesterdayDate']['date']);
    return actionItem.debugArray['yesterdayDate']['date'];
  } else {
    Logger.log("Get yesterday date returns :" + year+month+date);
    return year+month+date;
  }
*/
}




function test() {
  Logger.log(actionItemsConfig);
}

function test2(){
  var storage = new Storage();
  var stored = storage.load("core_daily_reporting_processed_today");
  Logger.log(stored);
}


function testPartitionPresent(){
  var actionItem = new ActionItem(
    actionItemsConfig[0].id,
    actionItemsConfig[0].type,
    actionItemsConfig[0].schedule,
    actionItemsConfig[0].bigquery,
    actionItemsConfig[0].email_data
  ); 

  var scheduler = new Scheduler();
  Logger.log(scheduler._checkDataAvailable(actionItem));
}



function logStatus(){
  var item = new ActionItem(
    actionItemsConfig[0].id,
    actionItemsConfig[0].type,
    actionItemsConfig[0].schedule,
    actionItemsConfig[0].bigquery,
    actionItemsConfig[0].email_data
  )
  
  var scheduler = new Scheduler(item);
  
  var partitionNotPresent = scheduler._checkPartitionNotPresent(item);
  var dataAvailable       = scheduler._checkDataAvailable(item);
  var alreadyProcessed    = scheduler._checkActionItemProcessed(item);
  
  Logger.log("Partition not present: "+ partitionNotPresent);
  Logger.log("data available: " + dataAvailable);
  Logger.log("Already processed: " + alreadyProcessed);
}


function setItemToNotAlreadyProcessed(){
  var storage = new Storage();
  storage.save('core_daily_reporting_processed_today', false);
}