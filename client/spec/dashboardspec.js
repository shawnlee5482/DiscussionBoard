describe('Dashboard Controller Test', function() {
	var $scope;
	beforeEach(function() {
		function() {
			module('topic');
			module('dashboard');
		}
	});

	var $controller;
	var $rootScope;

	beforeEach(inject(function(_$controller_, _$rootScope_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
		$rootScope = _$rootScope_;
		$scope = $rootScope.$new();
	}));

	it('getTopics should return topics', function() {	
		$controller('dashboardController', {$scope: $scope});
		var topics = [
			{topic: "test1", category:"General", createdAt:"2016-07-10T20:20:17.848Z"},
			{topic: "test2", category:"General", createdAt:"2016-07-10T20:20:17.848Z"}
		];		

		// just mock service
		var topicFactory = {
		  getTopics: function() {}
		};

		$scope.getTopics();

		// spy on the mock service
        spyOn(topicFactory, 'getTopics').and.returnValue(topics); 
		expect($scope.topics.length).not.toBe(0);
	});	
});