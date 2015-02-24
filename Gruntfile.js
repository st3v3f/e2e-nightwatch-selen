module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    // Convert nightwatch JUnit xml files to html via xslt.
    xsltproc: {
      options: {
          stylesheet: './xsl/junit-noframes.xsl'
      },
      compile: {
          files: [{
              expand: true,
              cwd: "./results",
              src: '*.xml',
              dest: "./results",
              ext: '.html',
              extDot: 'last' // Important for our nightwatch .xml file names!
          }]
      }
    }
  });

  // Load grunt task runners.
  grunt.loadNpmTasks('grunt-nightwatchjs');
  grunt.loadNpmTasks('grunt-xsltproc');

  // Default task(s).
  grunt.registerTask('default', ['nightwatchjs:default',
                                 'nightwatchjs:chrome',
                                 'nightwatchjs:phantomjs',
                                 'nightwatchjs:safari',
                                 'xsltproc:compile']);
};
