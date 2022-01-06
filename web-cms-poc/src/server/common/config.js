import appBaseHref from 'app-root-path';
import path from 'path';
// const yargs = require('yargs');

const envDirPath = path.resolve(appBaseHref.path, 'env');
process.env.NODE_CONFIG_DIR = envDirPath;
// process.env.NODE_ENV = yargs.argv.env || process.env.NODE_ENV;

const configLib = require('config');

// console.log(configLib);

/**
 * Application configuration object.
 */
const config = {
	common: {
		ENV: configLib.get('common.ENV'),
		PORT: configLib.get('common.PORT'),
	},
	api: {
		API_DOMAIN: configLib.get('api.API_DOMAIN'),
	}
};

export default config;
