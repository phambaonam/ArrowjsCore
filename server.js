'use strict';

/**
 * Module dependencies.
 */
let debug = require('debug')('ArrowJs');
let init = require('./config/init')(),
    config = require('./config/config'),
    fs = require('fs');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */
global.__base = __dirname + '/';
global.__config = config;
global.__utils = require(__base + 'core/libs/utils');
global.__ = require(__base + 'core/libs/global_function');
global.__modules = require(__base + 'core/libs/modules_manager')();
global.__models = require(__base + 'core/libs/models_manager');
global.__acl = require(__base + 'core/libs/acl');
global.__menus = require(__base + 'core/libs/menus_manager')();
global.__setting_menu_module = [];
global.__widgets = require(__base + 'core/libs/widgets_manager')();
global.__pluginManager = require(__base + 'core/libs/plugins_manager');
global.__messages = [];
global.__current_theme = {};
global.__cache = require(__base + 'core/libs/arr_caching')();
global.BackModule = require(__base + 'core/libs/BackModule');
global.FrontModule = require(__base + 'core/libs/FrontModule');
__pluginManager.loadAllPlugins();

/**
 * Create app dir if not exist
 */
try {
    fs.mkdirSync(__base + 'app', 755);
    fs.mkdirSync(__base + 'app/custom_filters', 755);
    fs.mkdirSync(__base + 'app/modules', 755);
    fs.mkdirSync(__base + 'app/plugins', 755);
    fs.mkdirSync(__base + 'app/widgets', 755);
} catch (err) {
    console.log("Create app dir:");
    console.log(err);
}

/** Init the express application */
let app = require('./config/app')();

/** Bootstrap passport config */
require('./config/passport')();

/** Start the app by listening on <port> */
let server = app.listen(config.port);

/** Expose app */
module.exports = app;

/** Logging initialization */
console.log('Application started on port ' + config.port);

