exports.render = function (req, res) {
	res.render('index', {
		title: 'Howdy World',
		user: JSON.stringify(req.user)
	});
};