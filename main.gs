function main() {
  var storage = new Storage();
  var scheduler = new Scheduler(storage);
  var itemActioner = new ItemActioner(storage);
  var actionItems = [];

  var actionItemsConfig = returnConfig();

  // create and collect actionItem objects
  for(var i = 0; i < actionItemsConfig.length; i++) {
    actionItems.push(
      new ActionItem(
        actionItemsConfig[i].id,
        actionItemsConfig[i].type,
        actionItemsConfig[i].schedule,
        actionItemsConfig[i].bigquery,
        actionItemsConfig[i].email_data
      )
    );
  } 
  
  // cycle through actionItems and consider actioning
  for(var i = 0; i < actionItems.length; i++) { 
    Logger.log("Processing item: "+actionItems[i].id);
  
    var schedulerResult = scheduler.shouldAction(actionItems[i]);
    
    if(schedulerResult[0]){
      if(itemActioner.actionItem(actionItems[i], schedulerResult[1])){
        scheduler.updateLastRan(actionItems[i]);
        Logger.log("Report run - based on scheduler response. Report status updated.");
      }
    } else {
      if(schedulerResult[1] == 'partition_already_present'){
        scheduler.updateLastRan(actionItems[i]);
        Logger.log("Report not run: Partition already present, status updated.");
      } else if(schedulerResult[1] == 'no_data'){
        Logger.log("Report not run: No data available.");
      } else if(schedulerResult[1] == 'item_already_processed'){
        Logger.log("Report not run: Item already processed."); // not thought to ever occur
      } else {
        Logger.log("Report not run: Condition for not running not captured.");
      }
    }
  }
}



    