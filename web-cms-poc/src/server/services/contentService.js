import Service from './Service';
import httpService from './httpService';

/**
 * Content logic related service.
 */
class ContentService extends Service {
	constructor () {
		super();
	}

	/**
	 * Fetches single post data from the API.
	 *
	 * @returns {Promise<Page>} Page promise object
	 */
	async getPostData (path) {
		const pageData = await httpService.get(path, { page: true });
		return pageData;
	}

	/**
	 * Fetches a list of post data from the API.
	 *
	 * @returns {Promise<Page>} Page promise object
	 */
	async getPostsData (path) {
		const pageData = await httpService.get(path);
		return pageData;
	}

	/**
	 * Fetches static page data from the API.
	 *
	 * @param {String} pageId Static page ID
	 * @returns {Promise<Page>} Page promise object
	 */
	async getStaticPageData (pageId) {
		const pageData = await httpService.get(`/static-pages/${ pageId }`);
		return pageData;
	}

	/**
	 * Fetches global settings data from the API.
	 *
	 * @returns {Promise<Settings>} Settings promise object
	 */
	async getSettings () {
		const settings = await httpService.get('/settings');
		return settings;
	}
}

const contentService = new ContentService();
export default contentService;
