// constructor - this is a method for representing the reports stored in the config array - it doesn't necessarily need any methods
function ActionItem(id, type, schedule, bigquery, email_data) {
    this.id = id; 
    this.type = type;
    this.schedule = schedule;
    this.bigquery = bigquery;
    this.email_data = email_data;
    this.debugArray = getDebugArray();
}