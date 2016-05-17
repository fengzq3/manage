module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                ASCIIOnly: true,
                banner: '/*! <%= pkg.name %><%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %> author:feng */',
                compress: {
                    drop_console: true
                }
            },
            js: {
                files: [{
                    expand: true,
                    cwd: 'src/js',
                    src: '**/*.js',
                    dest: 'build/js'
                }]
            }
        },
        cssmin: {
            options: {
                ASCIIOnly: true,
                banner: '/*! <%= pkg.name %><%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:mm:ss") %> author:feng */',
                compress: {
                    drop_console: true
                }
            },
            css: {
                files: [{
                    expand: true,
                    cwd: 'src/css',
                    src: '**/*.css',
                    dest: 'build/css'
                }]
            }
        },
        watch: {
            options: {
                livereload:true,
                debounceDelay:1000
            },
            js:{
                files:'src/js/**/*.js',
                tasks:['uglify']
            },
            css:{
                files:'src/css/**/*.css',
                tasks:['cssmin']
            }
        }


    });

    // Load the plugin that provides the "uglify" task.
    //grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    //grunt.loadNpmTasks('grunt-contrib-htmlmin');
    //grunt.loadNpmTasks('grunt-css-import');
    //grunt.loadNpmTasks('grunt-css-combo');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'cssmin']);

};