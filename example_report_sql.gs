/*
  If config is set to use queries rather than views this serves as an example of
    how you can specify the query to run
*/

var example_report_sql = "SELECT * FROM `{project}}.}{data-set}.reporting_view_produce_core`";
// use double backslashes if you wish to spread query out on multiple lines

function returnexample_report_sql(){
  return example_report_sql
}
