const autoFaviconKiller = () => {
	return (req, res, next) => {
		if (req.path === '/favicon.ico') {
			res.send();
		} else {
			next();
		}
		return;
	}
}

export default autoFaviconKiller;
