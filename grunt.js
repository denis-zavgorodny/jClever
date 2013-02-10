module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
        	main: {
                src: [
                        'js/md5.js',
                        'js/jquery.domchange.js',
        		        'js/jClever.js'
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
       
    });
    grunt.registerTask('default', ['concat','min']);
};