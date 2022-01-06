const redirection = () => {
	return (req, res, next) => {
		const { settings } = res.locals.common;
		// console.log(settings);
		// console.log(req.path);

		next();
		return;
	};
}

export default redirection;
