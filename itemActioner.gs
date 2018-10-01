function ItemActioner(storage){
  this.storageRef = storage;
}

ItemActioner.prototype.actionItem = function(actionItem, partitionDate){
  var bigQuery = new BQ();
  
  Logger.log("Actioning item: " + actionItem.id);
  
  // behaviour to take config - view or query and return relevant query sql string
  if(actionItem.bigquery.data_definition.method == "view"){
    var sql = 'SELECT * FROM `' + actionItem.bigquery.data_definition.defining_view.view_project + "." + actionItem.bigquery.data_definition.defining_view.view_dataset + "." + actionItem.bigquery.data_definition.defining_view.view_name + "` WHERE date = '" + partitionDate + "'";
  } else if(actionItem.bigquery.data_definition.method == "query") {
    var wildcards = {"partitionDate": partitionDate};
    var sql = this._exchangeWildCards(actionItem.bigquery.data_definition.defining_query, wildcards);
  } else {
    throw new Error( "Data defintion not set to either view or query - amend config file." );
  }

  var result = bigQuery.runJob(
    sql, 
    actionItem.bigquery.destination_project, 
    actionItem.bigquery.destination_dataset, 
    actionItem.bigquery.destination_table_id + "_" + partitionDate, 
    actionItem.bigquery.write_disposition, 
    actionItem.bigquery.create_disposition
  );
  
  if(result){
    return true;
  } else {
    return false;
  }
}



ItemActioner.prototype._exchangeWildCards = function(sql, wildcards){
  var partitionDate = RegExp('__partitiondate__', 'g');
  var startDateRegex = RegExp('__startdate__', 'g');
  var finishDateRegex = RegExp('__finishdate__', 'g');
  var date1 = RegExp('__date1__', 'g');
  var date2 = RegExp('__date2__', 'g');
  var date3 = RegExp('__date3__', 'g');
  var date4 = RegExp('__date4__', 'g');
  var lastWeekStart = RegExp('__lastWeekStart__', 'g');
  var lastWeekEnd = RegExp('__lastWeekEnd__', 'g');
  var priorWeekStart = RegExp('__priorWeekStart__', 'g');
  var priorWeekEnd = RegExp('__priorWeekEnd__', 'g');
  var lastWeekLYStart = RegExp('__lastWeekLYStart__', 'g');
  var lastWeekLYEnd = RegExp('__lastWeekLYEnd__', 'g');
  
  // replace wildcards in sql string as per wildcards array
  return sql
    .replace(partitionDate, wildcards['partitionDate'])
    .replace(startDateRegex, wildcards['startdate'])
    .replace(finishDateRegex, wildcards['finishdate'])
    .replace(date1, wildcards['date1'])
    .replace(date2, wildcards['date2'])
    .replace(date3, wildcards['date3'])
    .replace(date4, wildcards['date4'])
    .replace(lastWeekStart, wildcards['lastWeekStart'])
    .replace(lastWeekEnd, wildcards['lastWeekEnd'])
    .replace(priorWeekStart, wildcards['priorWeekStart'])
    .replace(priorWeekEnd, wildcards['priorWeekEnd'])
    .replace(lastWeekLYStart, wildcards['lastWeekLYStart'])
    .replace(lastWeekLYEnd, wildcards['lastWeekLYEnd']);
}