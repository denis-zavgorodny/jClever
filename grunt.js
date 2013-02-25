module.exports = function(grunt) {
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
       
    });
    grunt.registerTask('default', ['concat','min']);
};