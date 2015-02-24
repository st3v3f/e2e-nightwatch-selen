// Nightwatch globals module.
// Setup to add an html (nightwatch-html-reporter) and JSON file
// reporter plugins.
// Does a sneaky retrieval of browser type and environment used for the
// tests from the nightwatch context, allowing output files to named like
// like the default JUnit xml output files.

// Use nightwatch-html-reporter plugin to generate html reports.
var HtmlReporter = require('nightwatch-html-reporter');

// Allow output of test reports to JSON files also.
function jsonReporter(results, directory, filename, browserEnv) {
  var fs = require('fs'),
    path = require('path');

  var reportPathAndFilename = path.join(directory, filename);

  var output = {};
  output.datetime = new Date();
  output.browserEnv = browserEnv;
  output.results = results;

  var json = JSON.stringify(output, null, 2);

  fs.writeFileSync(reportPathAndFilename, json);
};

module.exports = {

  reporter: function(results, done) {

    /* Build the custom reporter object dynamically so we can set the output
       filename based on the browser type like nightwatch does for the default
       JUnit XML output.
       Note this uses undocumented access to the
       this.test_settings.report_prefix property of nightwatch's internal
       context.
     */
    var ts = this.test_settings || {};

    // Get this.test_settings.report_prefix
    var outputFilenamePrefix = ((ts || {}).report_prefix) || 'testReport_';

    var outputDirectory = __dirname + '/results';

    var htmlReporter = new HtmlReporter({
      openBrowser: true,
      reportsDirectory: outputDirectory,

      /* The filename that the html report will be saved as. */
      reportFilename: outputFilenamePrefix + '.html',

      /* The theme that will be used to generate the html report. */
      themeName: 'default',
    });

    // Just for fun dump the results as a JSON file first.
    browserEnv = outputFilenamePrefix
                   .substring(0, outputFilenamePrefix.lastIndexOf('_'));
    jsonReporter(results,
      outputDirectory,
      outputFilenamePrefix + '.json',
      browserEnv);

    // Call the nightwatch-html-reporter function now.
    htmlReporter.fn(results, done);
  }
};
