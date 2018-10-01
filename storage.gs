function Storage(){
  this._properties = undefined;
  this._initialise();
}

Storage.prototype._initialise = function(){
  this._properties = PropertiesService.getScriptProperties();
}

Storage.prototype.save = function(key, value) {
  this._properties.setProperty(key, value);
}

Storage.prototype.load = function(key){
  return this._properties.getProperty(key);
}



function testStorage(){
  testStorage = new Storage();
  testStorage.save("testKey", "testValue");
}


function viewStorage(){
  var storage = new Storage();
  var item = storage.load('core_daily_reporting_processed_today');
  Logger.log(item);
}

function loadStorage(){
  testStorage = new Storage();
  testStorage.save("revenue_by_channel", '201812');
}

function seeValue(){
  storage = new Storage();
  var lastRunWeek = storage.load('revenue_by_channel');
  Logger.log(lastRunWeek);
}

/*
 * - https://developers.google.com/apps-script/guides/properties
 */
