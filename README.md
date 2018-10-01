# Automate BigQuery Jobs with Google AppScript

## Overview

This code is designed to run daily processing jobs triggered

Designed with querying GA data in mind

![partitioned tables](https://github.com/nkoronka/bigquery-job-driver/images/partitoned_tables.png]

## Setup

Starting point is Google AppScript - https://script.google.com/home

Set project id in bigquery.gs

## Setting up jobs

## Components

Explanations for main components of code base

###Main
Starting point of application flow -

actionItem - object representing a report or any other kind of task we wish the code to run
itemActioner - class to delegate actioning of report to
storage - basic storage for understanding which reports have run and which still need actioning throughout the day
config - details settings for desired job schedule

Scheduler
