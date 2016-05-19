module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    lambda_package: {
        default: {
            options: {
                // Task-specific options go here.
            }
        }
    },
  });

  grunt.loadNpmTasks('grunt-aws-lambda');
  // Load the plugin that provides the "uglify" task.
 
  // Default task(s).
  grunt.registerTask('default', ['lambda_package']);

};