angular.module('example').config(['$routeProvider',
	function ($routeProvider) {
		$routeProvider
			.when('/', {
				templateUrl: 'modules/example/views/example.client.view.html'
			})
			.otherwise({
				redirectTo: '/'
			});
	}
]);