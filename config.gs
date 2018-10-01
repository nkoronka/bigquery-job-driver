// configure required jobs below
function returnConfig(){
  var actionItemsConfig = [
    {
      id: "core_daily_reporting", // give a unique name to daily job
      type: "bigquery_job",
      schedule: {
        frequency: "daily", // so far ignored, but ready to accommodate other frequency with further dev
        dow: null
      },
      bigquery: {
        source_project: "{project-id}", // where will the data be? It will be ensured that the relevant partition is available before the code runs
        source_dataset: "{dataset-id}",
        source_table: "ga_sessions",
        data_definition: {
          method: "query", /* view/query - if view then ensure 'defining_view' returns desired data
                                         - if query then ensure 'defining_query' returns desired data
                            */
          defining_view: {
            view_project: "{project-id}",
            view_dataset: "{dataset-id}",
            view_name: "reporting_view_produce_core"
          },
          defining_query: "SELECT * FROM `{project-id}.{dataset-id}.reporting_view_produce_core`" //example_report_sql // must be either defined as string in full or a defined variable within separate file - may use multiline string (for readability) using backlashes to escape new lines
        },
        destination_project: "{project-id}",
        destination_dataset: "{dataset-id}",
        destination_table_id: "reporting_core",
        write_disposition: "WRITE_TRUNCATE", // overwrite partition if exists - https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs - WRITE_TRUNCATE/WRITE_APPEND/WRITE_EMPTY
        create_disposition: "CREATE_IF_NEEDED" // create partition if need be - https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs
      },
      email_data: { // config added for further dev of notifications
        send_email: false,
        subject: null,
        message: null,
        bcc: null,
        template: null,
        column_formatters: null
      }
    }
    // add other jobs here as required
  ];

  return actionItemsConfig;
}
