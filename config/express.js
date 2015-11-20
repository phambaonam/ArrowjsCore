"use strict";

let morgan = require('morgan');


/**
 * Setting for express
 * @param app
 * @param config : config file
 * @param setting : user setting
 * @returns {*}
 */

module.exports = function (app, config, setting) {
    let bodyParser = Arrow.bodyParser,
        methodOverride = Arrow.methodOverride,
        sercurity = Arrow.sercurity,
        cookieParser = Arrow.cookieParse;
    /**
     * Set folder static resource
     */
    app.serveStatic();

    /**
     * Set local variable
     */
    app.locals.title = config.app.title;
    app.locals.description = config.app.description;
    app.locals.keywords = config.app.keywords;
    app.locals.facebookAppId = config.facebook.clientID || "";

    /** Showing stack errors */
    app.set('showStackError', true);

    /** Set views path and view engine */
    app.set('view engine', 'html');

    /** Environment dependent middleware */
    if (process.env.NODE_ENV === 'development') {
        /** Uncomment to enable logger (morgan) */
        app.use(morgan('dev'));
        /** Disable views cache */
        app.set('view cache', false);
    } else if (process.env.NODE_ENV === 'production') {
        app.locals.cache = 'memory';
    }

    app.use(bodyParser.urlencoded(config.bodyParser));
    app.use(bodyParser.json({limit: config.bodyParser.limit}));
    app.use(methodOverride());

    /** CookieParser should be above session */
    app.use(cookieParser());

    /** Express session storage */
    app.useSession();

    /** Use passport session */
    app.usePassport(setting);

    /** Flash messages */
    app.useFlashMessage();

    /** Use helmet to secure Express headers */
    app.use(sercurity.xframe());
    app.use(sercurity.xssFilter());
    app.use(sercurity.nosniff());
    app.use(sercurity.ienoopen());
    app.disable('x-powered-by');

    /** Passing the variables to environment locals */
    app.use(function (req, res, next) {
        //res.locals.hasOwnProperty = Object.hasOwnProperty;
        res.locals.url = req.protocol + '://' + req.headers.host + req.url;
        res.locals.path = req.protocol + '://' + req.headers.host;
        res.locals.route = req.url;

        next();
    });

    return app;
};