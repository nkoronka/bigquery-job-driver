# Automate BigQuery Jobs with Google AppScript

## Overview
This code is designed to run daily BigQuery jobs inserting processed data into
date labelled partitioned tables. It's built using Google AppScript and therefore
requires no provisioning of virtual hardware. Google Analytics Premium data feeds
were in mind when the code was written, but the system is suitable to run any
BigQuery processing.

The system is highly flexible and with intelligently selected jobs could form
the driving component of a simple data warehousing solution within BigQuery.

## Setup
The starting point is [Google AppScript](https://script.google.com/home). Create a new
script and add all .gs files from this repo.

Action the following:
- Set project-id in bigquery.gs obtain this from your GCP console
- Create a daily trigger at Edit -> Current project triggers

![creating daily trigger](https://github.com/nkoronka/bigquery-job-driver/blob/master/images/triggers2.png)

- Enable BigQuery API
![Enable BigQuery API](https://github.com/nkoronka/bigquery-job-driver/blob/master/images/resources-advanced-google-services.png)

- Configure desired jobs within config.gs

## Pointer
The system can easily be made to process yesterday's data by including dynamic dates
within the defining processing view:

![creating daily trigger](https://github.com/nkoronka/bigquery-job-driver/blob/master/images/query2.png)

## Components
Explanations for main components of code base:

*main.gs* - starting point of application flow<br>
*actionItem.gs* - object representing a report or any other kind of task we wish the code to run<br>
*itemActioner.gs* - class to delegate actioning of report to<br>
*storage.gs* - basic storage for understanding which reports have run and which still need actioning throughout the day<br>
*config.gs* - details settings for desired job schedule<br>
*scheduler.gs* - responsible for determining whether to execute an item at a
particular moment in time<br>
