#Required Binaries

This /lib folder requires some binary files not included in this repository, these binary files must be retrieved from the relevant locations.

The required binaries are:

1) selenium-server-standalone-2.43.1.jar

2) chromedriver

3) phantomjs - for testing on headless phantomjs



##Selenium Server
Used by Nightwatch to control browsers, is required for testing on all browser types.

Download ```selenium-server-standalone-2.43.1.jar``` from here:
https://selenium-release.storage.googleapis.com/index.html?path=2.43/

##Chromedriver
Required for testing on Chrome browser only.

Get it here:
http://chromedriver.storage.googleapis.com/index.html?path=2.14/

For mac get latest version of ```chromedriver_mac32.zip```

##PhantomJs
Required for testing on PhantomJs only:

The latest PhantomJS 2.0 build for mac from http://phantomjs.org/download.html doesn't run on OS X v10 Yosemite
(exits with ```killed 9```).

There is an [issue](https://github.com/ariya/phantomjs/issues/12928) with the packing of the PhantomJs binary with upx.

A rebuilt PhantomJs 2.0 binary (```phantomjs-2.0.0-macosx.zip```) can be found here - so get it instead. https://github.com/eugene1g/phantomjs/releases.
