import expressProxy from 'express-http-proxy';
import urlJoin from 'url-join';

import config from '../common/config';

const assetResolver = () => {
	return expressProxy(config.api.API_DOMAIN, {
		proxyReqPathResolver: req => {
			return urlJoin('/assets', req.url);
		}
	});
}

export default assetResolver;
