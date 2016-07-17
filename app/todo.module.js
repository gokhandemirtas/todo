(function() {
	'use strict';

	angular.module('todo.module',[])
		.factory('todoService', todoService)
		.controller('todoController', todoController);

	function todoService($http) {

		var api = 'http://localhost:3000';

		return {
			post:function (resource, payload) {
				return $http.post(api+resource, angular.toJson(payload))
			},
			put:function (resource, payload) {
				return $http.put(api+resource, angular.toJson(payload))
			},
			get:function (resource) {
				return $http.get(api+resource)
			}
		}
	}

	function todoController($scope, todoService) {

		$scope.todoContent = '';
		$scope.isBusy = false;
		$scope.todos = [];
		$scope.todo = {
			_id:'',
			content:'',
			isComplete:false,
			priority:0
		};

		function getTodoList(){
			$scope.isBusy = true;
			$scope.todos.length = 0;
			todoService.get('/getall').then(function(response){
				var rows = response.data.rows;
				angular.forEach(rows, function(value, key) {
					insertTodo(value.doc)
				});
				$scope.isBusy = false;
			}, function(error){
				console.error(error);
				$scope.isBusy = false;
			})
		};
		getTodoList();

		function insertTodo(obj){
			obj.priority = $scope.todos.length;
			$scope.todos.push(obj)
		}

		$scope.createTodo = function(content){
			$scope.isBusy = true;
			var payload = angular.copy($scope.todo);
			payload.content = content || '';
			payload._id = 'todo_'+(new Date()).getTime();

			todoService.post('/create', payload).then(function(response){
				insertTodo(payload);
				$scope.todoContent = '';
				$scope.isBusy = false;
			}, function(error){
				console.error(error);
				$scope.isBusy = false;
			})
		};

		$scope.updateTodo = function(todo){
			var payload = angular.copy(todo);
			payload.isComplete = !payload.isComplete;
			$scope.isBusy = true;
			todoService.put('/update',payload).then(function(response){
				todo.isComplete = payload.isComplete;
				$scope.isBusy = false;
			}, function(error){
				console.error(error);
				todo.isComplete = false;
				$scope.isBusy = false;
			})
		};

		$scope.deleteTodo = function(_id){
			$scope.isBusy = true;
			todoService.put('/delete',{'_id':_id}).then(function(response){
				getTodoList();
				$scope.isBusy = false;
			}, function(error){
				console.error(error);
				$scope.isBusy = false;
			})
		};

	}

})();
