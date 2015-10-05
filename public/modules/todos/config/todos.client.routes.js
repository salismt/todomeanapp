angular.module('todos').config(['$routeProvider', 
	function ($routeProvider) {
		$routeProvider
			.when('/todos', {
				templateUrl: 'modules/todos/views/list-todos.client.view.html'
			})
			.when('/todos/create', {
				templateUrl: 'modules/todos/views/create-todo.client.view.html'
			})
			.when('/todos/:todoId', {
				templateUrl: 'modules/todos/views/view-todo.client.view.html'
			})
			.when('/todos/:todoId/edit', {
				templateUrl: 'modules/todos/views/edit-todo.client.view.html'
			});
	}
]);