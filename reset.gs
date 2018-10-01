// return all reports to outstanding status - use with care
function resetReports() {
  var scheduler = new Scheduler();
  scheduler.setReportsToOutstanding();
}
