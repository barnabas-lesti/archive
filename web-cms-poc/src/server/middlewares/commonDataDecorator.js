import contentService from '../services//contentService'

/**
 * Middleware to set common data for routes, like settings.
 */
const commonDataDecorator = () => {
	return async (req, res, next) => {
		const settings = await contentService.getSettings();
		res.locals.common = {
			settings,
		};
		next();
		return;
	};
}

export default commonDataDecorator;
