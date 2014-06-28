module.exports = function(grunt) {
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.initConfig({
        concat: {
        	main: {
                src: [
                        'src/md5.js',
                        'src/jquery.domchange.js',
        		        'src/jClever.js'
                    ],
        		dest: 'build/jClever.js'
        	}
        },
        min: {
        	main: {
        		src: 'build/jClever.js',
        		dest: 'build/jClever.min.js'
        	}	
        },
        uglify: {
            my_target: {
              files: {
                'build/jClever.min.js': ['build/jClever.js']
              }
            }
          }
       
    });
    grunt.registerTask('default', ['concat', 'uglify'/*,'min'*/]);
};