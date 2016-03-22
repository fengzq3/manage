module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                ASCIIOnly:true,
                banner: '/*! <%= pkg.name %><%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> author:feng */',
                compress: {
                    drop_console: true
                }
            },
            js: {
                files: [{
                    expand: true,
                    cwd: 'expo/js',
                    src: '**/*.js',
                    dest: 'expo/build/js'
                }]
            }
        },
        cssmin: {
            css: {
                files: [{
                    expand: true,
                    cwd: 'expo/css',
                    src: '**/*.css',
                    dest: 'expo/build/css'
                }]
            },
            css2: {
                files: [{
                    expand: true,
                    cwd: 'expo/member/css',
                    src: '**/*.css',
                    dest: 'expo/build/member/css'
                }]
            }
        }


    });

    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    //grunt.loadNpmTasks('grunt-contrib-htmlmin');
    //grunt.loadNpmTasks('grunt-css-import');
    //grunt.loadNpmTasks('grunt-css-combo');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'cssmin']);

};