// we need to create mock factory
// for that create mock module to host it
angular.module('mock.topics', []).
	factory('topicFactory', function() {
		var factoryService = {};
	
		factoryService.getTopics = function() 
		{
			return topics;  // whatever
		}
		return factoryService;
	})


describe('Dashboard Controller Test', function() {
	beforeEach(function() {
		module('dashboard');  // load real controller for testing
		module('mock.topics'); // load mock factory
	});

	var $scope;
	var ctrl;
	var topicFactory;

	beforeEach(inject(function($controller, $rootScope, _topicFactory_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$scope = $rootScope.$new();  
		topicFactory = _topicFactory_;	// inject mock factory
		// create controller for testing
		// loginFactory, location factory is not required for getTopics testing
		// if you test for addTopic or getLoggedUser, you need to mock them as well
		ctrl = $controller('dashboardController', {$scope: $scope, topicFactory:_topicFactory_});
	}));

	it('getTopics should return topics', function() {	
		// spy on the mock service
		$scope.topics = [
			{topic: "test1", category:"General", createdAt:"2016-07-10T20:20:17.848Z"},
			{topic: "test2", category:"General", createdAt:"2016-07-10T20:20:17.848Z"}
		];		
		// simulate mock service response
        spyOn(topicFactory, 'getTopics').and.returnValue($scope.topics); 

		// call API
		$scope.getTopics();
		// see if it matches
		expect($scope.topics.length).not.toBe(0);
	});	

});