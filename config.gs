function returnConfig(){
  var actionItemsConfig = [
    {
      id: "core_daily_reporting",
      type: "bigquery_job",
      schedule: {
        frequency: "daily",
        dow: null
      },
      bigquery: {
        source_project: "greyhound-1336", // where will the data be? It will be ensured that the relevant partition is available before the code runs
        source_dataset: "105290899",
        source_table: "ga_sessions",
        data_definition: {
          method: "query", // view/query 
          defining_view: {
            view_project: "greyhound-1336",
            view_dataset: "105290899",
            view_name: "reporting_view_produce_core"
          },
          defining_query: "SELECT * FROM `greyhound-1336.105290899.reporting_view_produce_core`" //example_report_sql // must be either defined as string in full or a defined variable within separate file - may use multiline string (for readability) using backlashes to escape new lines
        },
        destination_project: "greyhound-1336",
        destination_dataset: "105290899",
        destination_table_id: "reporting_core",
        write_disposition: "WRITE_TRUNCATE", // https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs - WRITE_TRUNCATE/WRITE_APPEND/WRITE_EMPTY
        create_disposition: "CREATE_IF_NEEDED" // https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs
      },
      email_data: {
        send_email: false,
        subject: null,
        message: null,
        bcc: null,
        template: null,
        column_formatters: null
      }
    },
    {
      id: "site_speed",
      type: "bigquery_job",
      schedule: {
        frequency: "daily",
        dow: null
      },
      bigquery: {
        source_project: "greyhound-1336", // where will the data be? It will be ensured that the relevant partition is available before the code runs
        source_dataset: "105290899",
        source_table: "ga_sessions",
        data_definition: {
          method: "query", // view/query 
          defining_view: {
            view_project: "greyhound-1336",
            view_dataset: "105290899",
            view_name: "reporting_view_produce_site_speed"
          },
          defining_query: "SELECT * FROM `greyhound-1336.105290899.reporting_view_produce_site_speed`" //example_report_sql // must be either defined as string in full or a defined variable within separate file - may use multiline string (for readability) using backlashes to escape new lines
        },
        destination_project: "greyhound-1336",
        destination_dataset: "105290899",
        destination_table_id: "reporting_site_speed",
        write_disposition: "WRITE_TRUNCATE", // https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs - WRITE_TRUNCATE/WRITE_APPEND/WRITE_EMPTY
        create_disposition: "CREATE_IF_NEEDED" // https://cloud.google.com/bigquery/docs/reference/rest/v2/jobs
      },
      email_data: {
        send_email: false,
        subject: null,
        message: null,
        bcc: null,
        template: null,
        column_formatters: null
      }
    }        
  ];

  return actionItemsConfig;
}
