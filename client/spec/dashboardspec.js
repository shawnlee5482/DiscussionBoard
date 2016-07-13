angular.module('mock.topics', []).
	factory('topicFactory', function() {
		var factoryService = {};
	
		factoryService.getTopics = function() 
		{
			return topics;
		}
		return factoryService;
	})


describe('Dashboard Controller Test', function() {
	beforeEach(function() {
		module('dashboard');
		module('mock.topics');
	});

	var $scope;
	var ctrl;
	var topicFactory;

	beforeEach(inject(function($controller, $rootScope, _topicFactory_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$scope = $rootScope.$new();
		topicFactory = _topicFactory_;	
		ctrl = $controller('dashboardController', {$scope: $scope, topicFactory:_topicFactory_});
	}));

	it('getTopics should return topics', function() {	
		// spy on the mock service
		$scope.topics = [
			{topic: "test1", category:"General", createdAt:"2016-07-10T20:20:17.848Z"},
			{topic: "test2", category:"General", createdAt:"2016-07-10T20:20:17.848Z"}
		];		
        spyOn(topicFactory, 'getTopics').and.returnValue($scope.topics); 

		// just mock service
		$scope.getTopics();
		expect($scope.topics.length).not.toBe(0);
	});	

});