#E2E Testing using Nightwatch.js / Selenium with Grunt on mac.

24/02/2014

To see Nightwatch.js in action:

1) Clone the repo,

2) Install the npm dependencies: ```npm install```

3) Retrieve the required binaries for the /lib folder - see /lib/readme.md.

4) Run: ```grunt```.

The example tests will be run on Chrome, Firefox, PhantomJS and Safari.
The test results are created by Nightwatch as JUnit XML files, and also into html
by the nightwatch-html-reporter plugin.
The test results are also output to JSON files.

A subsequent grunt task is then run to convert the individual JUnit test .xml files
to html formatted test reports using xsltproc.

To allow JSON and html files to be written to filenames specifying the browser and environment (like the default JUnit xml file output), there is a sneaky access of the nightwatch context within the reporter callback, to get ```this.test_settings.report_prefix```.

I am using this repo to play with End-to-End (E2E) testing using grunt, Nightwatch/Selenium.

#Notes on setting up Nightwatch and Selenium from scratch.

(Automated Browser Testing / User simulation)

This is a summary of how to setup selenium/nightwatch on a mac for use with the Chrome browser.
For full details for other browsers/OS see the nightwatch site on which this simplified guide is based:
 http://nightwatchjs.org/guide

 This blog post povides a great intro as well:
 http://juristr.com/blog/2014/02/nightwatch-test-automation/

 Useful presentation on slideshare:
 http://www.slideshare.net/sethmcl/join-the-darkside-nightwatchjs

##Install Selenium
The selenium server controls the browser instance.
The selenium server runs as a java application.

Download the latest version of the selenium-server-standalone-{VERSION}.jar file from the Selenium downloads page.
http://selenium-release.storage.googleapis.com


##Get Selenium driver for (Chrome) browser
Get it here: http://chromedriver.storage.googleapis.com/

For mac get latest version of chromedriver_mac32.zip
This is a binary executable file providing an api to control the chrome browser.

Note the (default) firefox browser driver comes built in to the selenium server - so no separate firefox driver is required to be retrieved.

##Install Nightwatch.js (globally or locally)

Global installation (allows ``nightwatch`` to be run from cmd line. (Note this doesn't work with grunt-nightwatchjs task runner though as grunt-nightwatchjs expects to find the nightwatch executable at node_modules/.bin/nightwatch).
```
npm install -g nightwatch
```

Local installation
```
npm install nightwatch --save-dev
```

##Create tests as CommonJs (node module) format file(s)
Create a /tests folder to contain test files.
Create one or more tests.
For example a simple google test (googletest.js) would be:

```javascript
module.exports = {
  "Demo test Google" : function (browser) {
    browser
      .url("http://www.google.com")
      .waitForElementVisible('body', 1000)
      .setValue('input[type=text]', 'nightwatch')
      .waitForElementVisible('button[name=btnG]', 1000)
      .click('button[name=btnG]')
      .pause(1000)
      .assert.containsText('#main', 'The Night Watch')
      .end();
  }
};
```

##Create nightwatch.json configuration file
```javascript
{
  "src_folders" : ["./tests"],
  "output_folder" : "./results",
  "custom_commands_path" : "",
  "custom_assertions_path" : "",
  "globals_path" : "./globalsModule.js",

  "selenium" : {
    "start_process" : true,
    "server_path" : "./lib/selenium-server-standalone-2.43.1.jar",
    "log_path" : "./results",
    "host" : "127.0.0.1",
    "port" : 4444,
    "cli_args" : {
      "webdriver.chrome.driver" : "./lib/chromedriver"
    }
  },

  "test_settings" : {

    "default" : {
      "launch_url" : "http://localhost",
      "selenium_port"  : 4444,
      "selenium_host"  : "localhost",
      "silent": true,
      "screenshots" : {
        "enabled" : true,
        "path" : "./results"
      },
      "desiredCapabilities": {
        "browserName": "firefox",
        "javascriptEnabled": true,
        "acceptSslCerts": true
      }
    },

    "chrome" : {
      "desiredCapabilities": {
        "browserName": "chrome",
        "javascriptEnabled": true,
        "acceptSslCerts": true
      }
    },

    "htmlunit" : {
      "desiredCapabilities" : {
        "browserName" : "htmlunit",
        "javascriptEnabled" : true,
        "acceptSslCerts" : true
      }
    },

    "safari" : {
      "desiredCapabilities" : {
        "browserName" : "safari",
        "javascriptEnabled" : true,
        "acceptSslCerts" : true
      }
    },

    "phantomjs" : {
      "desiredCapabilities" : {
        "browserName" : "phantomjs",
        "javascriptEnabled" : true,
        "acceptSslCerts" : true,
        "phantomjs.binary.path" : "./lib/phantomjs"
      }
    }

  }
}

```

##Selenium server startup.
Set the property selenium.start_process to true in the nightwatch config file to auto-start selenium when nightwatch is run.

The path to the selenium server jar file must also be specified in the selenium.server_path property.

The selenium server can also be run manually:
    java -jar selenium-server-standalone-2.43.1.jar

##Run nightwatch without using Grunt
 If nightwatch was globally installed via `npm install -g nightwatch` just run `nightwatch`, if installed as local dependency run `./node_modules/.bin/nightwatch`.

 To run tests with the Chrome browser type `nightwatch -e chrome`.

 To run tests with the Chrome browser AND Firefox browser ***at the same time*** type `nightwatch -e default,chrome`.
or `./node_modules/.bin/nightwatch -e default,chrome` if installed as local dependency.


##Issues with Grunt-nightwatchjs task runner.
1) Parallel running of nightwatch environments not supported (the list of run environments is passed as comma separted list to nightwatch with the -e option - Grunt-nightwatchjs only uses the -env option to specify a single environment.)

2) Grunt-nightwatchjs relies on nightwatch.js to be installed in the local node_modules directory - it wont run nightwatch if nightwatch has been installed globally (with ``npm install -g``).

To fixe the second issue - this code can be added to /grunt-nightwatchjs/tasks/nightwatchjs.js file:
```javascript

  var nwPath = 'nightwatch';
  if (require('fs').existsSync('./node_modules/.bin/nightwatch')) {
       nwPath = './node_modules/.bin/nightwatch';
  }

  require('child_process').spawn(nwPath ...
```
Both these issues look to be straightforward fixes/improvements if required.

##Safari Webdriver fix
The safari webdriver needs to be installed manually for recent versions of Safari.
See here: http://elementalselenium.com/tips/69-safari

##PhantomJS
Some info here: http://elementalselenium.com/tips/46-headless-ghostdriver

The latest PhantomJS 2.0 build for mac from http://phantomjs.org/download.html doesn't run on OS X v10 Yosemite
(exits with ```killed 9```). See https://github.com/ariya/phantomjs/issues/12928.
There is an issue with the packing of the binary with upx.
A rebuilt binary can be found here https://github.com/eugene1g/phantomjs/releases.

To run the phantomJS web driver manually use
```./lib/phantomjs --webdriver=8001```
