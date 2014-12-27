var todoApp = angular.module('todoApp', ['ngRoute']);

todoApp.config(function($routeProvider) {
    $routeProvider
        .when('/',
        {
            controller: "LoginController",
            templateUrl: "LoginPage.html"
        })
        .when('/mytodos',
        {
            controller: "ToDoController",
            templateUrl: "ToDo.html"
        })
        .when('/publictodos',
        {
            controller: "PublicTodosController",
            templateUrl: "Public.html"
        })
        .otherwise({
            redirectTo: "/"
        });
    
});

todoApp.factory('UsersFactory', function () {
    var users = {};
    var currentUser;
    var factory = {};
    factory.getUsers = function () {
        return users;
    }

    factory.addUser = function (user) {
        console.log(user);
        users[user.name] = user;
    }

    factory.setUser = function (user) {
        if (users[user.name]) {
            currentUser = user;
        }
    }

    factory.getCurrent = function() {
        return currentUser;
    }

    factory.editCurrent = function (user) {
        users[currentUser.name] = user;
    }

    return factory;

})

todoApp.controller('LoginController', function($scope, $location, UsersFactory) {
        $scope.login = function () {
            var users = UsersFactory.getUsers();
            if (!users[$scope.username]) {
                console.log("New User");
                var user = {};
                user.isPublic = false;
                user.todos = [];
                user.name = $scope.username;
                UsersFactory.addUser(user);
            }
            UsersFactory.setUser(users[$scope.username]);
            $location.path('/mytodos');
        }

})

todoApp.controller('ToDoController', function($scope, $location, UsersFactory) {

        currentUser = UsersFactory.getCurrent();
        $scope.todos = currentUser.todos;
        $scope.username = currentUser.name;
        $scope.isPublic = currentUser.isPublic;
        $scope.disableSave = true;
        $scope.addToDo = function () {
            $scope.todos.push({"title": $scope.newToDo, done: false});
            $scope.newToDo = "";
            $scope.disableSave = false;
        }

        $scope.saveList = function () {
            currentUser.isPublic = $scope.isPublic;
            currentUser.todos = $scope.todos;
            UsersFactory.editCurrent(currentUser);
            $scope.disableSave = true;
        }

        $scope.clearFinished = function () {
            $scope.disableSave = false;
            $scope.todos = $scope.todos.filter(function (item) {
                return !item.done;
            });
        }
});

todoApp.controller('PublicTodosController', function($scope, $location, UsersFactory) {
    $scope.users = UsersFactory.getUsers();
    console.log($scope.users);

    $scope.filterPublic = function (users) {
      var result = {};
        angular.forEach(users, function(value, key) {
            if (value.isPublic === true ) {
                result[key] = value;
            }
        });
        return result;
    };
});
